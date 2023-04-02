const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputsDir = path.join(__dirname, "outputs");

if (!fs.existsSync(outputsDir)) {
  fs.mkdirSync(outputsDir, { recursive: true });
}

const runCpp = (filePath) => {
  const jobId = path.basename(filePath).split(".")[0];
  const outputPath = path.join(outputsDir, `${jobId}.out`);

  return new Promise((resolve, reject) => {
    exec(
      `g++ ${filePath} -o ${outputPath} && cd ${outputsDir} && ./${jobId}.out`,
      (error, stdout, stderr) => {
        error && reject({ error, stderr });
        stderr && reject(stderr);
        resolve(stdout);
        fs.unlinkSync(filePath);
        //fs.unlinkSync(outputPath);
      }
    );
  });
};

module.exports = {
  runCpp,
};
