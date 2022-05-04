import { parseUnits } from "@ethersproject/units";
import { Contract } from "ethers";
import { deploy, initDeployment } from "./utils/deployment";

/**
 * Deploy SimpleERC20
 */
async function main() {
    await initDeployment();

    const SimpleERC20: Contract = await deploy("SimpleERC20", [parseUnits("1000000", "ether")]);
    console.log(`SimpleERC20 deployed at ${SimpleERC20.address}`);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
