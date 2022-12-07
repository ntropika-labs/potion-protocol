import { basename } from "path";
import { readFile, writeFile } from "fs/promises";
import yargs from "yargs";

import { canAccess } from "./utils";
import type { VaultSource } from "./types";

const getHardhatTarget = (path: string) => {
  const base = basename(path);
  return base.replace(/localhost/, "hardhat.develop").replace(/\.json/, "");
};

const readSource = async (path: string) => {
  const f = JSON.parse(await readFile(path, "utf8"));
  return f as VaultSource;
};

async function main() {
  const args = await yargs
    .option("vaults", {
      alias: "v",
      description:
        "path to a JSON file with an array of paths to deployment configurations",
      default: "./vaults.json",
    })
    .option("common-contracts", {
      alias: "c",
      description:
        "path to a JSON file containing contracts that are shared with each stack",
      default: "",
    })
    .help()
    .alias("help", "h").argv;
  // read the vault stacks files
  const sources = JSON.parse(await readFile(args.vaults, "utf8")) as string[];

  // keep only the paths that the user can read
  const accessibleSources = sources.filter(canAccess);

  let commonSource = { contracts: {} } as VaultSource;
  if (args["common-contracts"] !== "" && canAccess(args["common-contracts"])) {
    commonSource = await readSource(args["common-contracts"]);
  }

  // for every stack declared in the stacks file prepare entries
  const stacks = accessibleSources.map(async (path: string) => {
    // load the JSON file
    const source = await readSource(path);
    const result = new Map<string, string>();
    for (const [key, value] of Object.entries(source.contracts)) {
      result.set(key, value.address);
    }
    for (const [key, value] of Object.entries(commonSource.contracts)) {
      result.set(key, value.address);
    }
    result.set("hardhatDeploymentName", getHardhatTarget(path));
    return Object.fromEntries(result);
  });

  await writeFile(
    "../../apps/potion-dapp/multivault.json",
    JSON.stringify(await Promise.all(stacks))
  );
}
main();
