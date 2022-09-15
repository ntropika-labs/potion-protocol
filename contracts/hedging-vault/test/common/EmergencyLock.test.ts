import { expect } from "chai";
import { ethers } from "hardhat";

import { TestWrapperEmergencyLock } from "../../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { AccessControlMissingRole, Roles } from "hedging-vault-sdk";

/**
    @notice EmergencyLock unit tests    
    
    @author Roberto Cano <robercano>
 */
describe("EmergencyLock", function () {
    let ownerAccount: SignerWithAddress;
    let unpriviledgedAccount: SignerWithAddress;
    let emergencyLock: TestWrapperEmergencyLock;

    before(async function () {
        ownerAccount = (await ethers.getSigners())[0];
        unpriviledgedAccount = (await ethers.getSigners())[1];

        const EmergencyLockFactory = await ethers.getContractFactory("TestWrapperEmergencyLock");
        emergencyLock = (await EmergencyLockFactory.deploy()) as TestWrapperEmergencyLock;

        await emergencyLock.initialize(ownerAccount.address, ownerAccount.address, ownerAccount.address);
    });

    it("Default Value", async function () {
        expect(await emergencyLock.paused()).to.be.false;
    });
    it("Pause/Unpause", async function () {
        // Pause the contract
        await expect(emergencyLock.pause()).to.emit(emergencyLock, "Paused");
        expect(await emergencyLock.paused()).to.be.true;

        // Unpause the contract
        await expect(emergencyLock.unpause()).to.emit(emergencyLock, "Unpaused");
        expect(await emergencyLock.paused()).to.be.false;
    });
    it("Not Admin", async function () {
        // Only admin can pause/unpause the contract
        await expect(emergencyLock.connect(unpriviledgedAccount).pause()).to.be.revertedWith(
            AccessControlMissingRole(Roles.Admin, unpriviledgedAccount.address),
        );

        await expect(emergencyLock.connect(unpriviledgedAccount).unpause()).to.be.revertedWith(
            AccessControlMissingRole(Roles.Admin, unpriviledgedAccount.address),
        );
    });
});
