import { Address, Bytes } from "@graphprotocol/graph-ts";
import { RolesManagerUpgradeable } from "../generated/InvestmentVault/RolesManagerUpgradeable";

function getVaultRole(role: Bytes, bindAddress: Address): string {
  const roleManager = RolesManagerUpgradeable.bind(bindAddress);

  if (role == roleManager.ADMIN_ROLE()) {
    return "admin";
  } else if (role == roleManager.STRATEGIST_ROLE()) {
    return "strategist";
  } else if (role == roleManager.OPERATOR_ROLE()) {
    return "operator";
  }

  return "";
}

export { getVaultRole };
