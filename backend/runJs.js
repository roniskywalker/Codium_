const { exec } = require('child_process');

const runJs = (filePath) =>{

    return new Promise((resolve, reject) => {
    exec(
      `node ${filePath}`,
      (error, stdout, stderr) => {
        error && reject({ error, stderr });
        stderr && reject(stderr);
        resolve(stdout);
      }
    );
  });
}

module.exports= {
    runJs
};