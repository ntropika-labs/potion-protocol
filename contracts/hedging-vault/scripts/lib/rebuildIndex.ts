import { resolve } from "path";
import { Deployments } from "contracts-utils";

Deployments.rebuildIndex(resolve(__dirname, "../../deployments"), resolve(__dirname, "../../src"), true);
