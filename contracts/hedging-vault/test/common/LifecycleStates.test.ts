import { expect } from "chai";
import { ethers } from "hardhat";

import { TestWrapperLifecycleStates } from "../../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("LifecycleStates", function () {
    enum LifecycleStates {
        Unlocked = 0,
        Committed = 1,
        Locked = 2,
    }

    let ownerAccount: SignerWithAddress;
    let unpriviledgedAccount: SignerWithAddress;
    let lifecycleStates: TestWrapperLifecycleStates;

    before(async function () {
        ownerAccount = (await ethers.getSigners())[0];
        unpriviledgedAccount = (await ethers.getSigners())[1];

        const LifecycleStatesFactory = await ethers.getContractFactory("TestWrapperLifecycleStates");
        lifecycleStates = (await LifecycleStatesFactory.deploy()) as TestWrapperLifecycleStates;

        await lifecycleStates.initialize();
    });

    it("Default Value", async function () {
        expect(await lifecycleStates.getLifecycleState()).to.be.equal(LifecycleStates.Unlocked);
    });
    it("Change state", async function () {
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
