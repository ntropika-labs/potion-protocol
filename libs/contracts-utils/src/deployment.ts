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

import type { DeploymentType, Provider, Network, ConfigName } from "./types";
import {
  DeploymentFlags,
  DeploymentOptions,
  isProvider,
  isNetwork,
} from "./types";
import { verify } from "./utils/hardhat";

export interface DeploymentInitParams {
  type: DeploymentType;
  options: DeploymentOptions;
  deploymentsDir: string;
  indexDir: string;
}

export interface DeploymentObjectLegacy {
  timestamp: number;
  network: Network;
  contracts: {
    [contractName: string]: {
      address: string;
      blockNumber: number;
    };
  };
}

export interface DeploymentObject {
  timestamp: number;
  provider: Provider;
  network: Network;
  config: ConfigName;
  contracts: {
    [contractName: string]: {
      address: string;
      blockNumber: number;
    };
  };
  dependencies: {
    [dependencyName: string]: {
      address: string;
    };
  };
}

export interface DeploymentParams extends FactoryOptions {
  options?: DeploymentOptions;
  alias?: string; // The deployed contract will be exported in the JSON file with this alias
  contract?: string; // Path and name of the contract to be verified i.e.: contracts/Example.sol:ExampleContract
}

export interface DeployedContract {
  contract: Contract | MockContract<Contract>;
  name: string;
  receipt?: TransactionReceipt;
}

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

  constructor(params: DeploymentInitParams) {
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
    if (this._hasMockOption(options) && this._isHardhatNetwork()) {
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

  persist() {
    // Cycle the previous deployment info to keep a history of deployments.
    // When deploying to develop only the latest deployment is kept.
    if (this._isDevelopNetwork() === false) {
      this._cycleDeploymentFile();
    }

    const deployments = this._getDeploymentObjectTemplate();

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
    });

    const deploymentFile = this.getDeploymentsPath();
    const dirName = path.dirname(deploymentFile);

    fs.mkdirSync(dirName, { recursive: true });
    fs.writeFileSync(deploymentFile, JSON.stringify(deployments, null, 2));

    this._rebuildIndex();
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

  public getDeploymentsPath(timestamp: number | undefined = undefined): string {
    const deploymentsDir = this.getDeploymentsDir();
    const providerDir = `${this.type.provider}`;
    const deploymentsFileName = Deployments.GetDeploymentNameFromType(
      this.type
    );
    const deploymentExtension = ".json";

    let deploymentsPath = resolve(
      deploymentsDir,
      providerDir,
      deploymentsFileName
    );

    if (timestamp) {
      deploymentsPath = resolve(
        deploymentsPath,
        `${Deployments.DeploymentTypeSeparator}` + String(timestamp)
      );
    }

    return deploymentsPath + deploymentExtension;
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

  _rebuildIndex() {
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
          (fileName) => fileName.endsWith(".json") && !/\d/.test(fileName)
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
    return this.type.network === "develop";
  }

  private _isHardhatNetwork(): boolean {
    return this.type.provider === "hardhat";
  }
}
