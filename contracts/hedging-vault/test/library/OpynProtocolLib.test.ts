import chai, { expect } from "chai";
import { FakeContract, smock } from "@defi-wonderland/smock";
import { ethers, network } from "hardhat";

import { TestWrapperOpynProtocolLib, IOpynController, IOpynController__factory } from "../../typechain";

chai.use(smock.matchers);

/**
    @notice OpynProtocolLib unit tests    
    
    @author Roberto Cano <robercano>
 */
describe.only("OpynProtocolLib", function () {
    let randomAddress: string;
    let opynProtocolLib: TestWrapperOpynProtocolLib;
    let fakeOpynController: FakeContract<IOpynController>;

    before(async function () {
        if (network.name !== "hardhat") {
            this.skip();
        }

        const OpynProtocolLibFactory = await ethers.getContractFactory("TestWrapperOpynProtocolLib");
        opynProtocolLib = (await OpynProtocolLibFactory.deploy()) as TestWrapperOpynProtocolLib;

        fakeOpynController = await smock.fake<IOpynController>(IOpynController__factory.abi);

        randomAddress = (await ethers.getSigners())[5].address;
    });

    it("Should call Opyn controller", async function () {
        if (network.name !== "hardhat") {
            this.skip();
        }

        fakeOpynController.isSettlementAllowed.returns(false);
        fakeOpynController.isSettlementAllowed.whenCalledWith(randomAddress).returns(true);

        expect(
            await opynProtocolLib.isPotionRedeemable(
                fakeOpynController.address,
                "0x0000000000000000000000000000000000000000",
            ),
        ).to.be.false;
        expect(fakeOpynController.isSettlementAllowed).to.have.been.callCount(1);
        expect(fakeOpynController.isSettlementAllowed).to.have.been.calledWith(
            "0x0000000000000000000000000000000000000000",
        );

        expect(await opynProtocolLib.isPotionRedeemable(fakeOpynController.address, randomAddress)).to.be.true;
        expect(fakeOpynController.isSettlementAllowed).to.have.been.callCount(2);
        expect(fakeOpynController.isSettlementAllowed).to.have.been.calledWith(randomAddress);
    });
});
