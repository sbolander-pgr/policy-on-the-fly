const fs = require("fs");

function readJsonFile(filePath) {
  const fileContent = fs.existsSync(filePath)
    ? fs.readFileSync(filePath, "utf-8")
    : "[]";
    
  try {
    const jsonArray = JSON.parse(fileContent);
    if (!Array.isArray(jsonArray)) {
      throw new Error("JSON file does not contain an array.");
    }
    return jsonArray;
  } catch (error) {
    throw new Error(`Failed to parse JSON file: ${error.message}`);
  }
}

function writeJsonFile(filePath, jsonArray) {
  fs.writeFileSync(filePath, JSON.stringify(jsonArray, null, 2), "utf-8");
}

function readInput(filePath) {
  return readJsonFile(filePath);
}

function writeOutput(filePath, policyIds) {
  const jsonArray = readJsonFile(filePath);
  jsonArray.push(...policyIds);
  writeJsonFile(filePath, jsonArray);
}

module.exports = {
  readInput,
  writeOutput,
};
