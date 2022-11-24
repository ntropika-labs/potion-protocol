import { accessSync } from "fs";
import { basename } from "path";
import { readFile, writeFile } from "fs/promises";
import _yargs from "yargs";

// istance yargs
const yargs = _yargs()

const canAccess = (path) => {
  try {
    accessSync(path);
    return true;
  } catch {
    return false;
  }
};

const getHardhatTarget = (path) => {
  const base = basename(path);
  return base.replace(/localhost/, 'hardhat.develop').replace(/\.json/, '');
}

async function main() {
  const args = await yargs
    .option("vaults", {
      alias: "v",
      description:
        "path to a JSON file with an array of paths to deployment configurations",
      default: "./vaults.json",
    })
    .help()
    .alias("help", "h").argv;
  // read the vault stacks files
  const sources = JSON.parse(await readFile(args.vaults, "utf8"));

  // keep only the paths that the user can read
  const accessibleSources = sources.filter(canAccess);

  // for every stack declared in the stacks file prepare entries
  const stacks = accessibleSources.map(async (path) => {
    // load the JSON file
    const source = JSON.parse(await readFile(path, "utf8"));
    const result = {};
    for (const [key, value] of Object.entries(source.contracts)) {
      result[key] = value.address;
    }
    result.hardhatDeploymentName = getHardhatTarget(path);
    return result;
  });

  await writeFile(
    "./multivault.json",
    JSON.stringify(await Promise.all(stacks))
  );
}
main();
