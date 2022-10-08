import fs from "fs";
import path, { resolve } from "path";

import "@nomiclabs/hardhat-ethers";
import "@openzeppelin/hardhat-upgrades";
import { ethers, upgrades } from "hardhat";
import type { FactoryOptions } from "@nomiclabs/hardhat-ethers/types";

import type { Contract, Signer } from "ethers";
import { TransactionReceipt } from "@ethersproject/providers";

import { smock } from "@defi-wonderland/smock";
import type { MockContract } from "@defi-wonderland/smock";

import { getImplementationAddress } from "@openzeppelin/upgrades-core";

import type {
  DeploymentInitParams,
  DeployedContract,
  DeploymentParams,
  DeploymentObject,
  DeploymentObjectLegacy,
  DeploymentType,
  Provider,
  Network,
  ConfigName,
} from "./types";
import {
  DeploymentFlags,
  DeploymentOptions,
  DeploymentNetwork,
  ProviderTypes,
  isProvider,
  isNetwork,
} from "./types";
import { verify } from "./utils/hardhat";

export class Deployments {
  private static DeploymentsSingleton: Deployments | undefined;

  public readonly type: DeploymentType;
  public readonly options: DeploymentOptions;
  public readonly deploymentsDir: string;
  public readonly indexDir: string;

  public readonly deployments: DeployedContract[] = [];

  private static readonly NumConfirmationsWait = 5;
  private static readonly DeploymentsIndexFileName = "index.ts";
  private static readonly DeploymentTypeSeparator = ".";
  private static readonly DeploymentFileExtension = ".json";
  private static readonly LegacyDeploymentFileExtension = ".json";

  constructor(params: DeploymentInitParams) {
    Deployments.ValidateParams(params);

    this.type = params.type;
    this.options = params.options;
    this.deploymentsDir = params.deploymentsDir;
    this.indexDir = params.indexDir;
  }

  /**
    SINGLETON
  */
  static Init(params: DeploymentInitParams): Deployments {
    if (this.DeploymentsSingleton) {
      throw new Error("Deployments already initialized");
    }

    this.DeploymentsSingleton = new Deployments(params);

    return this.DeploymentsSingleton;
  }

  static Get(): Deployments {
    if (!this.DeploymentsSingleton) {
      throw new Error("Deployments not initialized");
    }

    return this.DeploymentsSingleton;
  }

  static ValidateParams(params: DeploymentInitParams): void {
    if (
      (params.type.network === DeploymentNetwork.Develop &&
        params.type.provider === ProviderTypes.Remote) ||
      (params.type.provider === ProviderTypes.Internal &&
        params.type.network !== DeploymentNetwork.Develop)
    ) {
      throw new Error(
        `Provider ${params.type.provider} is not supported for network ${params.type.network}`
      );
    }
  }

  /**
    PUBLIC
  */
  async deploy<T extends Contract>(
    contractName: string,
    args: unknown[] = [],
    overrides: (Signer | DeploymentParams) | undefined = undefined
  ): Promise<T | MockContract<T>> {
    let options = this.options;
    let alias = undefined;

    if (this._isDeploymentParams(overrides)) {
      options = overrides.options || options;
      alias = overrides.alias;
    }

    let deployment: DeployedContract;
    if (this._hasMockOption(options) && this._isInternalProvider()) {
      deployment = await this._deployMock(contractName, args, alias, overrides);
    } else {
      deployment = await this._deploy(
        contractName,
        args,
        options,
        alias,
        overrides
      );
    }

    this.deployments.push(deployment);

    if (this._hasVerifyOption(options) && this._isDevelopNetwork() == false) {
      await this._verify(deployment, args, options);
    }

    if (this._hasMockOption(options)) {
      return deployment.contract as unknown as MockContract<T>;
    } else {
      return deployment.contract.deployed() as Promise<T>;
    }
  }

  async attach<T extends Contract>(
    contractName: string,
    contractAddress: string,
    alias?: string
  ): Promise<T> {
    const contract = await ethers.getContractAt(contractName, contractAddress);

    // Push without receipt to indicate that this is an attached contract
    this.deployments.push({
      contract,
      name: alias || contractName,
    });

    return contract.deployed() as Promise<T>;
  }

  persist(includeLegacy = false): void {
    // Cycle the previous deployment info to keep a history of deployments.
    // When deploying to develop only the latest deployment is kept.
    if (this._isDevelopNetwork() === false) {
      this._cycleDeploymentFile();
    }

    const deployments = this._getDeploymentObjectTemplate();
    const legacyDeployments = this._getLegacyDeploymentObjectTemplate();

    this.deployments.forEach((deployment) => {
      // If there is a receipt then the contract was deployed, otherwise
      // it was attached and it is considered as a dependency
      if (deployment.receipt) {
        deployments.contracts[deployment.name] = {
          address: deployment.contract.address,
          blockNumber: deployment.receipt.blockNumber,
        };
      } else {
        deployments.dependencies[deployment.name] = {
          address: deployment.contract.address,
        };
      }

      legacyDeployments.contracts[deployment.name] = {
        address: deployment.contract.address,
        blockNumber: deployment.receipt?.blockNumber || 0,
      };
    });

    const deploymentFile = this.getDeploymentsPath();
    const dirName = path.dirname(deploymentFile);

    fs.mkdirSync(dirName, { recursive: true });
    fs.writeFileSync(deploymentFile, JSON.stringify(deployments, null, 2));

    if (includeLegacy) {
      const legacyDeploymentFile = this.getLegacyDeploymentsPath();
      fs.writeFileSync(
        legacyDeploymentFile,
        JSON.stringify(legacyDeployments, null, 2)
      );
    }

    this.rebuildIndex(includeLegacy);
  }

  /**
    PUBLIC GETTERS
   */
  public static GetDeploymentTypeFromName(name: string): DeploymentType {
    const [provider, network, config] = name.split(
      Deployments.DeploymentTypeSeparator
    );

    if (!isProvider(provider)) {
      throw new Error(`Invalid provider in deployment type: ${provider}`);
    }
    if (!isNetwork(network)) {
      throw new Error(`Invalid network in deployment type: ${network}`);
    }

    return {
      provider: provider as Provider,
      network: network as Network,
      config: config as ConfigName,
    };
  }

  public static GetDeploymentNameFromType(type: DeploymentType): string {
    return `${type.provider}${Deployments.DeploymentTypeSeparator}${type.network}${Deployments.DeploymentTypeSeparator}${type.config}`;
  }

  public static GetLegacyDeploymentNameFromType(type: DeploymentType): string {
    let deploymentName = "";

    if (type.provider === ProviderTypes.Remote) {
      deploymentName =
        type.network + Deployments.DeploymentTypeSeparator + type.config;
    } else if (type.provider === ProviderTypes.Internal) {
      deploymentName = "hardhat";
    } else {
      deploymentName =
        "localhost" + Deployments.DeploymentTypeSeparator + type.config;
    }
    return deploymentName;
  }

  public getType(): DeploymentType {
    return this.type;
  }

  public getOptions(): DeploymentOptions {
    return this.options;
  }

  public getDeploymentsDir(): string {
    return this.deploymentsDir;
  }

  public getIndexDir(): string {
    return this.indexDir;
  }

  public getDeploymentsName(timestamp: number | undefined = undefined): string {
    let deploymentsFileName = Deployments.GetDeploymentNameFromType(this.type);
    const deploymentExtension = Deployments.DeploymentFileExtension;

    if (timestamp) {
      deploymentsFileName +=
        `${Deployments.DeploymentTypeSeparator}` + String(timestamp);
    }

    return deploymentsFileName + deploymentExtension;
  }

  public getDeploymentsPath(timestamp: number | undefined = undefined): string {
    const deploymentsDir = this.getDeploymentsDir();
    const providerDir = `${this.type.provider}`;
    const deploymentsFileName = this.getDeploymentsName(timestamp);

    return resolve(deploymentsDir, providerDir, deploymentsFileName);
  }

  public getLegacyDeploymentsName(
    timestamp: number | undefined = undefined
  ): string {
    const deploymentExtension = Deployments.LegacyDeploymentFileExtension;

    let deploymentsPath = "";
    if (this.type.network === DeploymentNetwork.Develop) {
      if (this.type.provider === ProviderTypes.Internal) {
        deploymentsPath = "hardhat";
      } else {
        deploymentsPath = this.type.provider;
      }
    } else if (this.type.provider === ProviderTypes.Remote) {
      deploymentsPath = this.type.network;
    } else {
      deploymentsPath = `localhost.${this.type.network}`;
    }

    if (timestamp) {
      deploymentsPath +=
        `${Deployments.DeploymentTypeSeparator}` + String(timestamp);
    }

    return deploymentsPath + deploymentExtension;
  }

  public getLegacyDeploymentsPath(
    timestamp: number | undefined = undefined
  ): string {
    const deploymentsDir = this.getDeploymentsDir();
    const deploymentsFileName = this.getLegacyDeploymentsName(timestamp);

    return resolve(deploymentsDir, deploymentsFileName);
  }

  public rebuildIndex(includeLegacy = false): void {
    let deploymentsIndex = {};

    // Loop through all the inner directories
    const deploymentDirs = fs
      .readdirSync(this.deploymentsDir, {
        withFileTypes: true,
      })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    // Read the contents of the each directory
    deploymentDirs.forEach((deploymentDir) => {
      const deploymentDirPath = resolve(this.deploymentsDir, deploymentDir);
      const deploymentFiles = fs
        .readdirSync(deploymentDirPath)
        .filter(
          (fileName) =>
            fileName.endsWith(Deployments.DeploymentFileExtension) &&
            !/\d/.test(fileName)
        );

      // Read the contents of each file
      deploymentFiles.forEach((deploymentFile) => {
        const deploymentFilePath = resolve(deploymentDirPath, deploymentFile);
        const deploymentJSON = fs.readFileSync(deploymentFilePath, "utf8");
        const deployment: DeploymentObject = JSON.parse(deploymentJSON);

        const deploymentTypeName =
          Deployments.GetDeploymentNameFromType(deployment);

        deploymentsIndex = Object.assign(deploymentsIndex, {
          [deploymentTypeName]: deployment,
        });
      });
    });

    if (includeLegacy) {
      const legacyFiles = fs
        .readdirSync(this.deploymentsDir)
        .filter(
          (fileName) =>
            fileName.endsWith(Deployments.LegacyDeploymentFileExtension) &&
            !/\d/.test(fileName)
        );

      legacyFiles.forEach((legacyFile) => {
        const legacyFilePath = resolve(this.deploymentsDir, legacyFile);
        const legacyDeploymentJSON = fs.readFileSync(legacyFilePath, "utf8");
        const legacyDeployment = JSON.parse(legacyDeploymentJSON);

        const legacyTypeName = path
          .basename(legacyFilePath)
          .replace(Deployments.LegacyDeploymentFileExtension, "");

        deploymentsIndex = Object.assign(deploymentsIndex, {
          [legacyTypeName]: legacyDeployment,
        });
      });
    }

    // Write the index file
    const indexFilePath = resolve(
      this.indexDir,
      Deployments.DeploymentsIndexFileName
    );

    fs.writeFileSync(
      indexFilePath,
      `// Autogenerated by the deployments script\n`,
      "utf8"
    );

    fs.appendFileSync(
      indexFilePath,
      `\nexport const Deployments = ${JSON.stringify(
        deploymentsIndex,
        null,
        2
      )}`,
      "utf8"
    );
  }

  /**
    PRIVATE
   */
  async _deploy(
    contractName: string,
    args: unknown[] = [],
    options: DeploymentOptions,
    alias?: string,
    overrides: (Signer | FactoryOptions) | undefined = undefined
  ): Promise<DeployedContract> {
    let contract: Contract;
    let receipt: TransactionReceipt;

    try {
      const contractFactory = await ethers.getContractFactory(
        contractName,
        overrides
      );
      if (this._hasUpgradeableOption(options)) {
        contract = await upgrades.deployProxy(contractFactory, args);
      } else {
        contract = await contractFactory.deploy(...args);
      }

      receipt = await contract.deployTransaction.wait();
    } catch (error) {
      throw new Error(`Error deploying contract ${contractName}: ` + error);
    }

    return {
      contract,
      name: alias || contractName,
      receipt,
    };
  }

  async _deployMock(
    contractName: string,
    args: unknown[] = [],
    alias?: string,
    overrides: (Signer | FactoryOptions) | undefined = undefined
  ): Promise<DeployedContract> {
    let contract: MockContract<Contract>;
    let receipt: TransactionReceipt;

    try {
      const contractFactory = await smock.mock(contractName, overrides);

      contract = await contractFactory.deploy(...args);

      receipt = await contract.deployTransaction.wait();
    } catch (error) {
      throw new Error(`Error deploying contract ${contractName}: ` + error);
    }

    // Fund the mock wallet
    await ethers.provider.send("hardhat_setBalance", [
      contract.address,
      ethers.utils.hexStripZeros(
        ethers.utils.parseEther("10000").toHexString()
      ),
    ]);

    return {
      contract,
      name: alias || contractName,
      receipt,
    };
  }

  async _verify(
    deployment: DeployedContract,
    args: unknown[],
    options: DeploymentOptions
  ) {
    await deployment.contract.deployTransaction.wait(
      Deployments.NumConfirmationsWait
    );

    let address: string;
    let parameters: unknown[];

    if (this._hasUpgradeableOption(options)) {
      address = await getImplementationAddress(
        ethers.provider,
        deployment.contract.address
      );
      parameters = [];
    } else {
      address = deployment.contract.address;
      parameters = args;
    }

    try {
      await verify(address, parameters);
    } catch (error) {
      console.log("Error verifying contract: " + error);
    }
  }

  private _cycleDeploymentFile(): void {
    const deploymentFile = this.getDeploymentsPath();

    if (!fs.existsSync(deploymentFile)) {
      return;
    }

    const latestDeploymentJSON = fs.readFileSync(deploymentFile, "utf8");
    const latestDeployment = JSON.parse(latestDeploymentJSON);

    const timestamp = latestDeployment.timestamp;

    const timestamDeploymentFile = this.getDeploymentsPath(timestamp);

    fs.renameSync(deploymentFile, timestamDeploymentFile);
  }

  private _getLegacyDeploymentObjectTemplate(): DeploymentObjectLegacy {
    return {
      timestamp: this._getNowTimestamp(),
      network: this.type.network,
      contracts: {},
    };
  }

  private _getDeploymentObjectTemplate(): DeploymentObject {
    return {
      timestamp: this._getNowTimestamp(),
      provider: this.type.provider,
      network: this.type.network,
      config: this.type.config,
      contracts: {},
      dependencies: {},
    };
  }

  private _getDeploymentType(deployment: DeploymentObject): DeploymentType {
    return {
      provider: deployment.provider,
      network: deployment.network,
      config: deployment.config,
    };
  }

  private _getNowTimestamp(): number {
    return Math.floor(new Date().getTime() / 1000);
  }

  private _hasVerifyOption(options?: DeploymentOptions): boolean {
    return options && options & DeploymentFlags.Verify ? true : false;
  }

  private _hasUpgradeableOption(options?: DeploymentOptions): boolean {
    return options && options & DeploymentFlags.Upgradeable ? true : false;
  }

  private _hasMockOption(options?: DeploymentOptions): boolean {
    return options && options & DeploymentFlags.Mock ? true : false;
  }

  private _isDeploymentParams(
    options: Signer | DeploymentParams | undefined
  ): options is DeploymentParams {
    return (
      options !== undefined &&
      ((options as DeploymentParams).options !== undefined ||
        (options as DeploymentParams).alias !== undefined)
    );
  }

  private _isDevelopNetwork(): boolean {
    return this.type.network === DeploymentNetwork.Develop;
  }

  private _isInternalProvider(): boolean {
    return this.type.provider === ProviderTypes.Internal;
  }
}
