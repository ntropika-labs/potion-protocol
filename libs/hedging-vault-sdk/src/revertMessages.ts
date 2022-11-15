import { Roles } from "./types";

export function AccessControlMissingRole(role: Roles, account: string): string {
    return "AccessControl: account " + account.toLowerCase() + " is missing role " + role;
}
