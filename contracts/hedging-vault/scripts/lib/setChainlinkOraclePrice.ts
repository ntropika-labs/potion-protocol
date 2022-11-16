import { resolve } from "path";
import { ethers } from "hardhat";
import { Deployments, DeploymentFlags } from "contracts-utils";
import { MockChainlinkAggregatorV3 } from "../../typechain";
import { parseUnits } from "@ethersproject/units";

export async function setChainlinkOraclePrice(config: string, asset: string, USDPerAsset: number): Promise<void> {
    const deploymentType = Deployments.getDeploymentTypeFromName(config);

    Deployments.initialize({
        type: deploymentType,
        options: DeploymentFlags.None,
        deploymentsDir: resolve(__dirname, "../../deployments"),
        indexDir: resolve(__dirname, "../../src"),
    });

    const deployments = Deployments.retrieveDeployments();
    if (deployments === undefined) {
        throw new Error("Deployments not found");
    }

    const contractName = `ChainlinkAggregator${asset}`;

    const contractInfo = deployments.contracts[contractName];
    if (contractInfo === undefined) {
        throw new Error(`Contract ${contractName} not found`);
    }

    const contractAddress = contractInfo.address;

    const chainlinkAggregator = (await ethers.getContractAt(
        "MockChainlinkAggregatorV3",
        contractAddress,
    )) as MockChainlinkAggregatorV3;

    const decimals = await chainlinkAggregator.decimals();
    const inversePrice = 1.0 / USDPerAsset;
    const priceBN = parseUnits(inversePrice.toFixed(decimals), decimals);

    console.log(
        `Setting price for ${asset} to ${USDPerAsset} USD/asset (${priceBN.toString()} asset/USD, 8 decimals) on ${contractName} at ${contractAddress}`,
    );

    await chainlinkAggregator.setAnswer(priceBN);
}
