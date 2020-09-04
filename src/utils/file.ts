const os = require("os");
const fs = require("fs");
const fileIt = require("file-it");

export async function storeHashedValues(userHashedValues: any) {
  fileIt.writeJsonFileSync(getSoftwareHashedValuesFile(), userHashedValues);
}

export function getStoredHashedValues() {
  return fileIt.readJsonFileSync(getSoftwareHashedValuesFile());
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

  if (autoCreate && !fs.existsSync(softwareDataDir)) {
      fs.mkdirSync(softwareDataDir);
  }

  return softwareDataDir;
}

export function getSoftwareHashedValuesFile() {
  return getFile("hashed_values.json");
}
