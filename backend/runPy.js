const { exec } = require("child_process");
const fs = require("fs");

const runPy = (filePath) => {
  return new Promise((resolve, reject) => {
    exec(`python3 ${filePath}`, (error, stdout, stderr) => {
        fs.unlinkSync(filePath);
      error && reject({ error, stderr });
      stderr && reject(stderr);
      resolve(stdout);
    });
  });
};

module.exports = {
  runPy,
};
