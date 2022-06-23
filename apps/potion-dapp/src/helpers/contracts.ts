import { Deployments } from "potion-contracts";

import { ethereumNetwork } from "./";

//@ts-expect-error iterator is not defined
export const contractsAddresses = Deployments[ethereumNetwork].contracts;
