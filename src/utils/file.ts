const os = require("os");
const fs = require("fs");
import { isTestMode } from "./env_helper";

export async function storeHashedValues(userHashedValues: any) {
  storeJsonData(userHashedValues);
}

export function getStoredHashedValues() {
  const filePath = getSoftwareHashedValuesFile();
  let content: string = fs.readFileSync(filePath, { encoding: 'utf8' });
  try {
    return JSON.parse(content);
  } catch (e: any) {
    console.error(`Unable to read file info: ${e.message}`);
    storeHashedValues({});
    content = fs.readFileSync(filePath, { encoding: 'utf8' });
    try {
      return JSON.parse(content);
    } catch (e: any) {
      console.error(`Unable to read file info: ${e.message}`);
    }
  }
  return {};
}

export function getFile(name: string, default_data: any = null) {
  const file_path = getSoftwareDir();
  const file = isWindows() ? `${file_path}\\${name}` : `${file_path}/${name}`;
  if (!fs.existsSync(file) && default_data) {
    // create the file since we have default data and it currently doesn't exist
    storeJsonData(default_data);
  }
  return file;
}

function storeJsonData(data: any) {
  try {
    const content: string = JSON.stringify(data);
    fs.writeFileSync(getSoftwareHashedValuesFile(), content, { encoding: 'utf8' });
  } catch (e: any) {
    console.error(`Unable to write file data: ${e.message}`);
  }
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
  return getFile("hashed_values.json", {});
}
