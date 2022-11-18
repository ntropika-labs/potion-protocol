import { ethers } from "hardhat";
import { resolve } from "path";
import { config as dotenvConfig } from "dotenv";
import { Deployments, DeploymentFlags, getDeploymentType } from "contracts-utils";

dotenvConfig({ path: resolve(__dirname, "./.env") });

async function init() {
    const deploymentType = getDeploymentType();

    await Deployments.initialize({
        type: deploymentType,
        options: DeploymentFlags.Export | DeploymentFlags.Verify,
        deploymentsDir: resolve(__dirname, "../deployments"),
        indexDir: resolve(__dirname, "../../src"),
    });

    const deployer = (await ethers.provider.listAccounts())[0];

    console.log(`---------------------------------------------------`);
    console.log(` Independent Deployment Preparation Script`);
    console.log(`---------------------------------------------------`);
    console.log(`- Provider: ${deploymentType.provider}`);
    console.log(`- Network: ${deploymentType.network}`);
    console.log(`- Config: ${deploymentType.config}`);
    console.log(`- Deployer: ${deployer}`);
    console.log(`---------------------------------------------------\n`);
}

async function main() {
    await init();

    const tokens: string[] = [
        "0x798e9C98e24faBcCf04cF6d31381B1CFC75CBe14",
        "0x9649071fb3875b68C88c60b172e2F6ADa5717634",
        "0xBB2bc2c224139512a7525a83955567FD2C3a0c1F",
        "0x45902f8c0a64A19ff849DAD5277Af72F68C746D6",
    ];
    const aggregators: string[] = [
        "0x0715A7794a1dc8e42615F059dD6e406A6594651A",
        "0x007A22900a3B98143368Bd5906f8E17e9867581b",
        "0x1C2252aeeD50e0c9B64bDfF2735Ee3C932F5C408",
        "0x572dDec9087154dC5dfBB1546Bb62713147e0Ab0",
    ];
    const mintAmount = "100000000";

    const uniswapRouter = await Deployments.deploy("MockRouterWithOracle", [tokens, aggregators], {
        alias: "UniswapV3Router",
    });

    console.log(`\nUniswap Router deployed at ${uniswapRouter.address}\n`);

    for (let i = 0; i < tokens.length; i++) {
        console.log(`- Minting ${mintAmount} of token ${tokens[i]} to Uniswap Router...`);
        const token = await ethers.getContractAt("MockERC20PresetMinterPauser", tokens[i]);

        const decimals = await token.decimals();

        token.mint(uniswapRouter.address, ethers.utils.parseUnits(mintAmount, decimals));
    }

    Deployments.persist(true);

    console.log(`\nDONE!\n`);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
