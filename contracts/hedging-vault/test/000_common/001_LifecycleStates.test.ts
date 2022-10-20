import { expect } from "chai";
import { ethers } from "hardhat";

import { TestWrapperLifecycleStates } from "../../typechain";
import { LifecycleStates } from "hedging-vault-sdk";
/**
    @notice LifecycleStates unit tests    
    
    @author Roberto Cano <robercano>
 */
describe("LifecycleStates", function () {
    let lifecycleStates: TestWrapperLifecycleStates;

    before(async function () {
        const LifecycleStatesFactory = await ethers.getContractFactory("TestWrapperLifecycleStates");
        lifecycleStates = (await LifecycleStatesFactory.deploy()) as TestWrapperLifecycleStates;

        await lifecycleStates.initialize();
    });

    it("LS0001 - Default Value", async function () {
        expect(await lifecycleStates.getLifecycleState()).to.be.equal(LifecycleStates.Unlocked);
    });
    it("LS0002 - Change state", async function () {
        // Unlocked->Committed
        await expect(lifecycleStates.setLifecycleState(LifecycleStates.Committed))
            .to.emit(lifecycleStates, "LifecycleStateChanged")
            .withArgs(LifecycleStates.Unlocked, LifecycleStates.Committed);
        expect(await lifecycleStates.getLifecycleState()).to.be.equal(LifecycleStates.Committed);

        // Committed->Locked
        await expect(lifecycleStates.setLifecycleState(LifecycleStates.Locked))
            .to.emit(lifecycleStates, "LifecycleStateChanged")
            .withArgs(LifecycleStates.Committed, LifecycleStates.Locked);
        expect(await lifecycleStates.getLifecycleState()).to.be.equal(LifecycleStates.Locked);

        // Locked->Unlocked
        await expect(lifecycleStates.setLifecycleState(LifecycleStates.Unlocked))
            .to.emit(lifecycleStates, "LifecycleStateChanged")
            .withArgs(LifecycleStates.Locked, LifecycleStates.Unlocked);
        expect(await lifecycleStates.getLifecycleState()).to.be.equal(LifecycleStates.Unlocked);

        // Unlocked->Locked
        await expect(lifecycleStates.setLifecycleState(LifecycleStates.Locked))
            .to.emit(lifecycleStates, "LifecycleStateChanged")
            .withArgs(LifecycleStates.Unlocked, LifecycleStates.Locked);
        expect(await lifecycleStates.getLifecycleState()).to.be.equal(LifecycleStates.Locked);
    });
});
