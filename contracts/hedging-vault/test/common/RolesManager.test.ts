import { expect } from "chai";
import { ethers } from "hardhat";

import { TestWrapperRolesManager } from "../../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("RolesManager", function () {
    let adminAccount: SignerWithAddress;
    let strategistAccount: SignerWithAddress;
    let operatorAccount: SignerWithAddress;
    let adminAccount2: SignerWithAddress;
    let strategistAccount2: SignerWithAddress;
    let operatorAccount2: SignerWithAddress;
    let unpriviledgedAccount: SignerWithAddress;
    let rolesManager: TestWrapperRolesManager;

    const zeroAddress = "0x0000000000000000000000000000000000000000";

    before(async function () {
        adminAccount = (await ethers.getSigners())[0];
        strategistAccount = (await ethers.getSigners())[1];
        operatorAccount = (await ethers.getSigners())[2];

        adminAccount2 = (await ethers.getSigners())[3];
        strategistAccount2 = (await ethers.getSigners())[4];
        operatorAccount2 = (await ethers.getSigners())[5];

        unpriviledgedAccount = (await ethers.getSigners())[6];

        const RolesManagerFactory = await ethers.getContractFactory("TestWrapperRolesManager");
        rolesManager = (await RolesManagerFactory.deploy()) as TestWrapperRolesManager;

        await rolesManager.initialize(adminAccount.address, strategistAccount.address, operatorAccount.address);
    });

    it("Check roles addresses", async function () {
        expect(await rolesManager.getAdmin()).to.equal(adminAccount.address);
        expect(await rolesManager.getStrategist()).to.equal(strategistAccount.address);
        expect(await rolesManager.getOperator()).to.equal(operatorAccount.address);
    });
    it("Change roles by Admin", async function () {
        await expect(rolesManager.changeStrategist(strategistAccount2.address))
            .to.emit(rolesManager, "StrategistChanged")
            .withArgs(strategistAccount.address, strategistAccount2.address);
        await expect(rolesManager.changeOperator(operatorAccount2.address))
            .to.emit(rolesManager, "OperatorChanged")
            .withArgs(operatorAccount.address, operatorAccount2.address);

        // Change Admin last, so we use the previous admin in all operations
        await expect(rolesManager.changeAdmin(adminAccount2.address))
            .to.emit(rolesManager, "AdminChanged")
            .withArgs(adminAccount.address, adminAccount2.address);

        // Check that the new admin can change the roles back
        await expect(rolesManager.connect(adminAccount2).changeStrategist(strategistAccount.address))
            .to.emit(rolesManager, "StrategistChanged")
            .withArgs(strategistAccount2.address, strategistAccount.address);
        await expect(rolesManager.connect(adminAccount2).changeOperator(operatorAccount.address))
            .to.emit(rolesManager, "OperatorChanged")
            .withArgs(operatorAccount2.address, operatorAccount.address);
        await expect(rolesManager.connect(adminAccount2).changeAdmin(adminAccount.address))
            .to.emit(rolesManager, "AdminChanged")
            .withArgs(adminAccount2.address, adminAccount.address);
    });
    it("Change roles to the zero address", async function () {
        await expect(
            rolesManager.connect(unpriviledgedAccount).changeAdmin(unpriviledgedAccount.address),
        ).to.revertedWith("Only the Admin can call this function");
        await expect(
            rolesManager.connect(unpriviledgedAccount).changeStrategist(unpriviledgedAccount.address),
        ).to.revertedWith("Only the Admin can call this function");
        await expect(
            rolesManager.connect(unpriviledgedAccount).changeOperator(unpriviledgedAccount.address),
        ).to.revertedWith("Only the Admin can call this function");
    });
    it("Change roles by unpriviledged", async function () {
        await expect(rolesManager.changeAdmin(zeroAddress)).to.revertedWith(
            "New Admin address cannot be the null address",
        );
        await expect(rolesManager.changeStrategist(zeroAddress)).to.revertedWith(
            "New Strategist address cannot be the null address",
        );
        await expect(rolesManager.changeOperator(zeroAddress)).to.revertedWith(
            "New Operator address cannot be the null address",
        );
    });
});
