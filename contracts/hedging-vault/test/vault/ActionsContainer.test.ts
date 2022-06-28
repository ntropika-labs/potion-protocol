import { expect } from "chai";
import { ethers } from "hardhat";

import { TestWrapperActionsContainer } from "../../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("ActionsContainer", function () {
    let actionsContainer: TestWrapperActionsContainer;
    let actions: string[];

    before(async function () {
        const signers: SignerWithAddress[] = await ethers.getSigners();

        const ActionsContainerFactory = await ethers.getContractFactory("TestWrapperActionsContainer");
        actionsContainer = (await ActionsContainerFactory.deploy()) as TestWrapperActionsContainer;

        actions = [signers[0].address, signers[1].address, signers[2].address];
        await actionsContainer.initialize(actions);
    });

    it("Check getters", async function () {
        expect(await actionsContainer.getActionsLength()).to.be.equal(3);

        for (let i = 0; i < 3; i++) {
            expect(await actionsContainer.getAction(i)).to.be.equal(actions[i]);
        }
    });
});
