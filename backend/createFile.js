const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const codesDir = path.join(__dirname, "codes");

if (!fs.existsSync(codesDir)) {
  fs.mkdirSync(codesDir, { recursive: true });
}

const createFile = async (language, code) => {
  const jobId = uuid();
  const fileName = `${jobId}.${language}`;
  const filePath = path.join(codesDir, fileName);
  await fs.writeFileSync(filePath, code);
  return filePath;
};

module.exports = {
  createFile,
};
