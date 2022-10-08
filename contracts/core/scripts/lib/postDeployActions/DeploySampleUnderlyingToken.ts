import { ethers } from "hardhat";
import { Deployment } from "../../../deployments/deploymentConfig";
import { PostDeployActionsResults } from "../postDeploy";
import { DeploymentFlags, Deployments } from "contracts-utils";

export class DeploySampleUnderlyingToken {
    public constructor(public tokenSymbol = "UNDRLYNG") {}

    // Deploys and whitelists an underlying token. Returns token address
    async executePostDeployAction(
        depl: Deployment,
        dataAlreadyDeployed: PostDeployActionsResults,
        printProgress: boolean,
    ): Promise<void> {
        const isFirstToken = depl.sampleUnderlyingTokenAddress === undefined;

        printProgress &&
            process.stdout.write(`Deploying & whitelisting sample underlying token (${this.tokenSymbol})... `);
        const token = await Deployments.deploy(
            "SampleUnderlyingToken",
            [this.tokenSymbol],
            isFirstToken ? { options: DeploymentFlags.Export } : { options: DeploymentFlags.None },
        );
        printProgress && console.log(`deployed at ${token.address}`);

        const whitelist = await depl.whitelist();
        const trx = await whitelist.whitelistProduct(
            token.address,
            depl.collateralTokenAddress,
            depl.collateralTokenAddress,
            true,
        );
        await trx.wait(); // Wait for mining to avoid duplicate nonces

        const symbol = await token.symbol();

        // Mint some tokens
        const signers = await ethers.getSigners();
        for (const signer of signers) {
            printProgress && process.stdout.write(`Minting ${signer.address} ${symbol} tokens... `);
            const trx = await token.mint(signer.address, ethers.utils.parseEther("1000000"));
            await trx.wait();
            printProgress && console.log("minted");
        }

        if (isFirstToken) {
            // This is our first sample underlying token, so we persist it in the Deployment
            // Subsequent underlying tokens can be created, but their existence & data must be inferred from event logs
            depl.sampleUnderlyingTokenAddress = token.address;
        }
    }
}
