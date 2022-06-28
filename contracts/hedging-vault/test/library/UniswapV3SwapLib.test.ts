import chai, { expect } from "chai";
import { FakeContract, smock } from "@defi-wonderland/smock";
import { ethers } from "hardhat";

import { TestWrapperUniswapV3SwapLib, ISwapRouter, ISwapRouter__factory } from "../../typechain";

import { PercentageUtils } from "../utils/PercentageUtils";

chai.use(smock.matchers);

/**
    @notice UniswapV3SwapLib unit tests    
    
    @author Roberto Cano <robercano>
 */
describe("UniswapV3SwapLib", function () {
    let tokenA: string;
    let tokenB: string;
    let uniswapV3SwapLib: TestWrapperUniswapV3SwapLib;
    let fakeUniswapRouter: FakeContract<ISwapRouter>;

    before(async function () {
        const UniswapV3SwapLibFactory = await ethers.getContractFactory("TestWrapperUniswapV3SwapLib");
        uniswapV3SwapLib = (await UniswapV3SwapLibFactory.deploy()) as TestWrapperUniswapV3SwapLib;

        fakeUniswapRouter = await smock.fake<ISwapRouter>(ISwapRouter__factory.abi);

        tokenA = (await ethers.getSigners())[5].address;
        tokenB = (await ethers.getSigners())[6].address;
    });

    it("Swap input", async function () {
        fakeUniswapRouter.exactInput.returns(1987);

        const poolFee = 3000000;
        const swapInputParameter = {
            inputToken: "0x0000000000000000000000000000000000000000",
            exactAmountIn: 356,
            expectedAmountOut: 1984,
            slippage: 2000000,
            maxDuration: 1000000,
            swapPath: ethers.utils.solidityPack(["address", "uint256", "address"], [tokenA, poolFee, tokenB]),
        };

        const currentBlock = await ethers.provider.getBlock("latest");
        const currentBlockTimestamp = currentBlock.timestamp;

        // Use `callStatic` here so we can check the return value. No storage changes are expected anyway
        expect(await uniswapV3SwapLib.callStatic.swapInput(fakeUniswapRouter.address, swapInputParameter)).to.be.equal(
            1987,
        );

        expect(fakeUniswapRouter.exactInput).to.have.been.calledOnce;

        const amountOutMinimum = PercentageUtils.substractPercentage(
            swapInputParameter.expectedAmountOut,
            swapInputParameter.slippage,
        );

        const exactInputParameters: any = fakeUniswapRouter.exactInput.getCall(0).args[0];
        expect(exactInputParameters.path).to.be.equal(swapInputParameter.swapPath);
        expect(exactInputParameters.recipient).to.be.equal(uniswapV3SwapLib.address);
        expect(exactInputParameters.deadline).to.be.equal(currentBlockTimestamp + swapInputParameter.maxDuration);
        expect(exactInputParameters.amountIn).to.be.equal(swapInputParameter.exactAmountIn);
        expect(exactInputParameters.amountOutMinimum).to.be.equal(amountOutMinimum);
    });

    it("Swap output", async function () {
        fakeUniswapRouter.exactOutput.returns(2003);

        const poolFee = 3000000;
        const swapOutputParameter = {
            inputToken: "0x0000000000000000000000000000000000000000",
            exactAmountOut: 1984,
            expectedAmountIn: 356,
            slippage: 2000000,
            maxDuration: 1000000,
            swapPath: ethers.utils.solidityPack(["address", "uint256", "address"], [tokenA, poolFee, tokenB]),
        };

        const currentBlock = await ethers.provider.getBlock("latest");
        const currentBlockTimestamp = currentBlock.timestamp;

        // Use `callStatic` here so we can check the return value. No storage changes are expected anyway
        expect(
            await uniswapV3SwapLib.callStatic.swapOutput(fakeUniswapRouter.address, swapOutputParameter),
        ).to.be.equal(2003);

        expect(fakeUniswapRouter.exactOutput).to.have.been.calledOnce;

        const amountInMaximum = PercentageUtils.addPercentage(
            swapOutputParameter.expectedAmountIn,
            swapOutputParameter.slippage,
        );

        const exactInputParameters: any = fakeUniswapRouter.exactOutput.getCall(0).args[0];
        expect(exactInputParameters.path).to.be.equal(swapOutputParameter.swapPath);
        expect(exactInputParameters.recipient).to.be.equal(uniswapV3SwapLib.address);
        expect(exactInputParameters.deadline).to.be.equal(currentBlockTimestamp + swapOutputParameter.maxDuration);
        expect(exactInputParameters.amountOut).to.be.equal(swapOutputParameter.exactAmountOut);
        expect(exactInputParameters.amountInMaximum).to.be.equal(amountInMaximum);
    });
});
