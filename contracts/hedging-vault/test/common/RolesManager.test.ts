import { expect } from "chai";
import { ethers } from "hardhat";

import { TestWrapperRolesManager } from "../../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { AccessControlMissingRole, Roles } from "hedging-vault-sdk";

/**
    @notice RolesManager unit tests    
    
    @author Roberto Cano <robercano>
 */
describe("RolesManager", function () {
    let adminAccount: SignerWithAddress;
    let strategistAccount: SignerWithAddress;
    let operatorAccount: SignerWithAddress;
    let vaultAccount: SignerWithAddress;
    let investorAccount: SignerWithAddress;
    let adminAccount2: SignerWithAddress;
    let strategistAccount2: SignerWithAddress;
    let operatorAccount2: SignerWithAddress;
    let vaultAccount2: SignerWithAddress;
    let investorAccount2: SignerWithAddress;
    let unpriviledgedAccount: SignerWithAddress;
    let rolesManager: TestWrapperRolesManager;

    async function changeRole(
        role: Roles,
        oldAccount: SignerWithAddress | undefined,
        newAccount: SignerWithAddress,
        admin: SignerWithAddress,
    ) {
        const roleCount = await rolesManager.getRoleMemberCount(role);

        await expect(rolesManager.connect(admin).grantRole(role, newAccount.address))
            .to.emit(rolesManager, "RoleGranted")
            .withArgs(role, newAccount.address, admin.address);

        await expect(await rolesManager.getRoleMemberCount(role)).to.equal(roleCount.add(1));

        if (oldAccount) {
            await expect(rolesManager.connect(admin).revokeRole(role, oldAccount.address))
                .to.emit(rolesManager, "RoleRevoked")
                .withArgs(role, oldAccount.address, admin.address);

            await expect(await rolesManager.getRoleMemberCount(role)).to.equal(roleCount);
        }
    }

    before(async function () {
        adminAccount = (await ethers.getSigners())[0];
        strategistAccount = (await ethers.getSigners())[1];
        operatorAccount = (await ethers.getSigners())[2];
        vaultAccount = (await ethers.getSigners())[3];
        investorAccount = (await ethers.getSigners())[4];

        adminAccount2 = (await ethers.getSigners())[5];
        strategistAccount2 = (await ethers.getSigners())[6];
        operatorAccount2 = (await ethers.getSigners())[7];
        vaultAccount2 = (await ethers.getSigners())[8];
        investorAccount2 = (await ethers.getSigners())[9];

        unpriviledgedAccount = (await ethers.getSigners())[10];

        const RolesManagerFactory = await ethers.getContractFactory("TestWrapperRolesManager");
        rolesManager = (await RolesManagerFactory.deploy()) as TestWrapperRolesManager;

        await rolesManager.initialize(adminAccount.address, operatorAccount.address);
    });

    it("Check roles addresses", async function () {
        expect(await rolesManager.getRoleMemberCount(Roles.Admin)).to.equal(1);
        expect(await rolesManager.getRoleMember(Roles.Admin, 0)).to.equal(adminAccount.address);
        expect(await rolesManager.getRoleMemberCount(Roles.Operator)).to.equal(1);
        expect(await rolesManager.getRoleMember(Roles.Operator, 0)).to.equal(operatorAccount.address);
        expect(await rolesManager.getRoleMemberCount(Roles.Vault)).to.equal(0);
        expect(await rolesManager.getRoleMemberCount(Roles.Investor)).to.equal(0);
        expect(await rolesManager.getRoleMemberCount(Roles.Strategist)).to.equal(0);
    });
    it("Change roles by Admin", async function () {
        await changeRole(Roles.Operator, operatorAccount, operatorAccount2, adminAccount);
        await changeRole(Roles.Vault, undefined, vaultAccount2, adminAccount);
        await changeRole(Roles.Investor, undefined, investorAccount2, adminAccount);
        await changeRole(Roles.Strategist, undefined, strategistAccount2, adminAccount);
        await changeRole(Roles.Admin, adminAccount, adminAccount2, adminAccount);

        // Check that the new admin can change the roles back
        await changeRole(Roles.Operator, operatorAccount2, operatorAccount, adminAccount2);
        await changeRole(Roles.Vault, vaultAccount2, vaultAccount, adminAccount2);
        await changeRole(Roles.Investor, investorAccount2, investorAccount, adminAccount2);
        await changeRole(Roles.Strategist, strategistAccount2, strategistAccount, adminAccount2);
        await changeRole(Roles.Admin, adminAccount2, adminAccount, adminAccount2);
    });
    it("Change roles by unpriviledged", async function () {
        await expect(
            rolesManager.connect(unpriviledgedAccount).grantRole(Roles.Admin, unpriviledgedAccount.address),
        ).to.revertedWith(AccessControlMissingRole(Roles.Admin, unpriviledgedAccount.address));
        await expect(
            rolesManager.connect(unpriviledgedAccount).grantRole(Roles.Operator, unpriviledgedAccount.address),
        ).to.revertedWith(AccessControlMissingRole(Roles.Admin, unpriviledgedAccount.address));
        await expect(
            rolesManager.connect(unpriviledgedAccount).grantRole(Roles.Strategist, unpriviledgedAccount.address),
        ).to.revertedWith(AccessControlMissingRole(Roles.Admin, unpriviledgedAccount.address));
        await expect(
            rolesManager.connect(unpriviledgedAccount).grantRole(Roles.Vault, unpriviledgedAccount.address),
        ).to.revertedWith(AccessControlMissingRole(Roles.Admin, unpriviledgedAccount.address));
        await expect(
            rolesManager.connect(unpriviledgedAccount).grantRole(Roles.Investor, unpriviledgedAccount.address),
        ).to.revertedWith(AccessControlMissingRole(Roles.Admin, unpriviledgedAccount.address));
    });
});
