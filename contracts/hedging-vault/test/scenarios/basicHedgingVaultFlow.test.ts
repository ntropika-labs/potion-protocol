import { expect } from "chai";
import { ethers, network } from "hardhat";

import { getDeploymentConfig, deployTestingEnv, MockOptions } from "../utils/deployTestingEnv";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { InvestmentVault } from "../../typechain";

/**
    @notice Hedging Vault basic flow unit tests    
    
    @author Roberto Cano <robercano>
 */
describe.only("HedgingVault", function () {
    let ownerAccount: SignerWithAddress;
    let unpriviledgedAccount: SignerWithAddress;
    let investmentVault: InvestmentVault;

    before(async function () {
        ownerAccount = (await ethers.getSigners())[0];
        unpriviledgedAccount = (await ethers.getSigners())[1];

        const deploymentConfig = getDeploymentConfig(network.name);
        const mockOptions: MockOptions = {
            mockUSDC: true,
            mockUnderlyingAsset: true,
            mockUniswapV3SwapRouter: true,
            mockPotionLiquidityPoolManager: true,
        };
        ({ investmentVault } = await deployTestingEnv(deploymentConfig, mockOptions));
    });

    it("Default Values", async function () {
        expect(await investmentVault.getAdmin()).to.equal(ownerAccount.address);
    });
});
