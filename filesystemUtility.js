const fs = require("fs");

const defaultInputFilePath = "input/input.json";

function defaultOutputFilePath (env, datetime = null) {
  const dateObj = datetime ? new Date(datetime) : new Date();
  const isoShort = dateObj.toISOString().slice(0, 10); // "YYYY-MM-DD"
  return `output/${env}_policies_${isoShort}.json`;
}

function readJsonFile(filePath) {
  const fileContent = fs.existsSync(filePath)
    ? fs.readFileSync(filePath, "utf-8")
    : "{}";
    
  try {
    const json = JSON.parse(fileContent);
    return json;
  } catch (error) {
    throw new Error(`Failed to parse JSON file: ${error.message}`);
  }
}

function readJsonFileAsArray(filePath) {
  const fileContent = readJsonFile(filePath);
  if (!Array.isArray(fileContent)) {
    return [];
  }
  return fileContent;
}

function writeJsonFile(filePath, jsonArray) {
  fs.writeFileSync(filePath, JSON.stringify(jsonArray, null, 2), "utf-8");
}

function readInput(filePath) {
  return readJsonFile(filePath);
}

function writeOutput(filePath, policyIds) {
  const jsonArray = readJsonFileAsArray(filePath);
  jsonArray.push(...policyIds);
  writeJsonFile(filePath, jsonArray);
}

module.exports = {
  readInput,
  writeOutput,
  defaultInputFilePath,
  defaultOutputFilePath
};
