import { expect } from "chai";
import { ethers } from "hardhat";

import { TestWrapperActionsManager } from "../../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";

describe("ActionsManager", function () {
    let actionsContainer: TestWrapperActionsManager;
    let actions: string[];
    let principalPercentages: BigNumber[];

    before(async function () {
        const signers: SignerWithAddress[] = await ethers.getSigners();

        const ActionsContainerFactory = await ethers.getContractFactory("TestWrapperActionsManager");
        actionsContainer = (await ActionsContainerFactory.deploy()) as TestWrapperActionsManager;

        actions = [signers[0].address, signers[1].address, signers[2].address];
        principalPercentages = [BigNumber.from(1000000), BigNumber.from(2000000), BigNumber.from(30000000)];
        await actionsContainer.initialize(actions, principalPercentages);
    });

    it("Check getters", async function () {
        expect(await actionsContainer.getActionsLength()).to.be.equal(3);

        for (let i = 0; i < 3; i++) {
            expect(await actionsContainer.getAction(i)).to.be.equal(actions[i]);
        }

        const percentages = await actionsContainer.getPrincipalPercentages();
        expect(percentages.length).to.be.equal(3);

        for (let i = 0; i < 3; i++) {
            expect(percentages[i]).to.be.equal(principalPercentages[i]);

            expect(await actionsContainer.getPrincipalPercentage(i)).to.be.equal(principalPercentages[i]);
        }
    });
});
