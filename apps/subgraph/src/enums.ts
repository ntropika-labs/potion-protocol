// Have to manually define this Enum since codegen schema does not contain Enums
// Because assemblyscript only supports i32 enums we need to mimic them using a namespace
// Another option can be using a TypedMap but it will change the usage and make it less similar to an enum

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Actions {
  export const POOL_LEFT_TEMPLATE = "POOL_LEFT_TEMPLATE";
  export const CURVE_CHANGE = "CURVE_CHANGE";
  export const CRITERIASET_CHANGE = "CRITERIASET_CHANGE";
  export const DEPOSIT = "DEPOSIT";
  export const WITHDRAW = "WITHDRAW";
  export const PREMIUM_RECEIVED = "PREMIUM_RECEIVED";
  export const CAPITAL_EXERCISED = "CAPITAL_EXERCISED";
}
export type Actions = string;
