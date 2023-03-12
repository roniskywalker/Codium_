const { exec } = require('child_process');

const runPy = (filePath) =>{

    return new Promise((resolve, reject) => {
    exec(
      `python3 ${filePath}`,
      (error, stdout, stderr) => {
        error && reject({ error, stderr });
        stderr && reject(stderr);
        resolve(stdout);
      }
    );
  });
}

module.exports= {
    runPy
};