import { Deployment } from "../../../deployments/deploymentConfig";
import { PostDeployAction, PostDeployActionsResults } from "../postDeploy";
import { Deployments } from "contracts-utils";

export interface PricerConfig {
    assetName: string;
    assetAddress: string;
    relayerAddress: string;
    chainlinkAggregatorAddress: string;
}

export class DeployChainlinkPricer implements PostDeployAction {
    constructor(public config: PricerConfig) {}

    async executePostDeployAction(
        depl: Deployment,
        dataAlreadyDeployed: PostDeployActionsResults,
        printProgress: boolean,
    ): Promise<void> {
        printProgress &&
            console.log(`Deploying pricer for asset ${this.config.assetName} at address ${this.config.assetAddress}`);

        const oracle = await depl.oracle();

        const pricer = await Deployments.deploy(
            "ChainLinkPricer",
            [
                this.config.relayerAddress,
                this.config.assetAddress,
                this.config.chainlinkAggregatorAddress,
                oracle.address,
            ],
            {
                alias: "ChainLinkPricer" + this.config.assetName,
            },
        );

        const tx = await oracle.setAssetPricer(this.config.assetAddress, pricer.address);
        await tx.wait();
    }
}
