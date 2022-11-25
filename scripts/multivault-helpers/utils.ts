import { accessSync } from "fs";

const canAccess = (path: string) => {
  try {
    accessSync(path);
    return true;
  } catch {
    return false;
  }
};

export { canAccess };
