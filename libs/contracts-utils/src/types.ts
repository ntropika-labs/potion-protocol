import type { NetworksType } from "hardhat-helpers";
import { Networks } from "hardhat-helpers";

export enum ProviderTypes {
  Internal = "internal",
  Ganache = "ganache",
  Hardhat = "hardhat",
  Remote = "remote",
}

export enum DeploymentNetwork {
  Develop = "develop",
}

export enum DeploymentFlags {
  Export = 1 << 1,
  Verify = 1 << 2,
  Upgradeable = 1 << 3,
  Mock = 1 << 4,
}

export type DeploymentOptions = DeploymentFlags;

export type Provider = ProviderTypes;
export type Network = NetworksType | DeploymentNetwork;
export type ConfigName = string;
export interface DeploymentType {
  provider: Provider;
  network: Network;
  config: ConfigName;
}

export function isProvider(value: string): value is Provider {
  return Object.values<string>(ProviderTypes).includes(value);
}

export function isNetwork(value: string): value is Network {
  return (
    Object.values<string>(DeploymentNetwork).includes(value) ||
    Object.values<string>(Networks).includes(value)
  );
}
