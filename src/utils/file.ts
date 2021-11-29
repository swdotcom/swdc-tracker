const os = require("os");
const fs = require("fs");
import { isTestMode } from "./env_helper";

export async function storeHashedValues(userHashedValues: any) {
  try {
    const content: string = JSON.stringify(userHashedValues);
    fs.writeFileSync(getSoftwareHashedValuesFile(), content, { encoding: 'utf8' });
  } catch (e: any) {
    console.error(`Unable to write hashed values: ${e.message}`);
  }
}

export function getStoredHashedValues() {
  const filePath = getSoftwareHashedValuesFile();
  let content: string = fs.readFileSync(filePath, { encoding: 'utf8' });
  try {
    return JSON.parse(content);
  } catch (e: any) {
    console.error(`Unable to read file info: ${e.message}`);
    storeHashedValues({});
    try {
      return JSON.parse(content);
    } catch (e: any) {
      console.error(`Unable to read file info: ${e.message}`);
    }
  }
  return null;
}

export function getFile(name: string) {
  let file_path = getSoftwareDir();
  if (isWindows()) {
      return `${file_path}\\${name}`;
  }

  return `${file_path}/${name}`;
}

export function isWindows() {
  return process.platform.indexOf("win32") !== -1;
}

export function getSoftwareDir(autoCreate = true) {
  const homedir = os.homedir();
  let softwareDataDir = homedir;
  if (isWindows()) {
      softwareDataDir += "\\.software";
  } else {
      softwareDataDir += "/.software";
  }

  if (isTestMode()) {
    softwareDataDir = `${softwareDataDir}-test`;
  }

  if (autoCreate && !fs.existsSync(softwareDataDir)) {
      fs.mkdirSync(softwareDataDir);
  }

  return softwareDataDir;
}

export function getSoftwareHashedValuesFile() {
  return getFile("hashed_values.json");
}
