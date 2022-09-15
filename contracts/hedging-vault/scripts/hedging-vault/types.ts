import { utils } from "ethers";

export enum LifecycleStates {
    Unlocked = 0,
    Committed = 1,
    Locked = 2,
}

export const AdminRole = "0x0000000000000000000000000000000000000000000000000000000000000000";
export const OperatorRole = utils.solidityKeccak256(["string"], ["ADMIN_ROLE"]);
export const StrategistRole = utils.solidityKeccak256(["string"], ["ADMIN_ROLE"]);
export const VaultRole = utils.solidityKeccak256(["string"], ["ADMIN_ROLE"]);
export const InvestorRole = utils.solidityKeccak256(["string"], ["ADMIN_ROLE"]);
