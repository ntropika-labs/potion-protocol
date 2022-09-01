import { Deployment } from "../../../deployments/deploymentConfig";
import { PostDeployAction, PostDeployActionsResults } from "../postDeploy";

export class WhitelistUnderlying implements PostDeployAction {
    constructor(public underlyingAddress: string) {}

    async executePostDeployAction(
        depl: Deployment,
        dataAlreadyDeployed: PostDeployActionsResults,
        printProgress: boolean,
    ): Promise<void> {
        printProgress && console.log(`Whitelisting underlying: ${this.underlyingAddress}`);

        const whitelist = await depl.whitelist();
        const trx = await whitelist.whitelistProduct(
            this.underlyingAddress,
            depl.collateralTokenAddress,
            depl.collateralTokenAddress,
            true,
        );
        await trx.wait();
    }
}
