import { accessSync } from "fs";
import { readFile, writeFile } from "fs/promises";

const canAccess = (path) => {
  try {
    accessSync(path);
    return true;
  } catch {
    return false;
  }
};

async function main() {
  // read the vault stacks files
  const sources = JSON.parse(await readFile("./vaults.json", "utf8"));

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
    return result;
  });

  await writeFile(
    "./multivault.json",
    JSON.stringify(await Promise.all(stacks))
  );
}
main();
