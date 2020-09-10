export function convertWinPathToUnix(val: any) {
  // use the "?" to prevent getting...
  // "TypeError: Cannot read property 'replace' of null"
  return val?.replace(/\\/g, "/");
}
