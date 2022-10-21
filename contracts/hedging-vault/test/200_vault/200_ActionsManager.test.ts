import { expect } from "chai";
import { ethers } from "hardhat";

import { TestWrapperActionsManager } from "../../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("ActionsManager", function () {
    let actionsContainer: TestWrapperActionsManager;
    let actions: string[];

    before(async function () {
        const signers: SignerWithAddress[] = await ethers.getSigners();

        const ActionsContainerFactory = await ethers.getContractFactory("TestWrapperActionsManager");
        actionsContainer = (await ActionsContainerFactory.deploy()) as TestWrapperActionsManager;

        actions = [signers[0].address, signers[1].address, signers[2].address];
        await actionsContainer.initialize(actions);
    });

    it("AM0001 - Getters", async function () {
        expect(await actionsContainer.getActionsLength()).to.be.equal(3);

        for (let i = 0; i < 3; i++) {
            expect(await actionsContainer.getAction(i)).to.be.equal(actions[i]);
        }
    });
});
