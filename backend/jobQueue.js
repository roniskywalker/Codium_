const Queue = require("bull");

const Job = require("./models/Job");
const { runCpp } = require("./runCpp");
const { runPy } = require("./runPy");
const { runJs } = require("./runJs");
const jobQueue = new Queue("job-runner-queue");

const NUM_WORKERS = 5;

jobQueue.process(NUM_WORKERS, async ({ data }) => {
  const jobId = data.id;

  const job = await Job.findById(jobId);
  if (job === undefined) {
    throw Error("Job not found");
  }
  try {
    let output;
    job["startedAt"] = new Date();

    if (job.language === "cpp") {
      output = await runCpp(job.filePath);
    } else if (job.language === "py") {
      output = await runPy(job.filePath);
    } else if (job.language === "js") {
      output = await runJs(job.filePath);
    }
    job["completedAt"] = new Date();
    job["status"] = "success";
    job["output"] = output;

    await job.save();

    return true;
    // return res.json({filePath, output});
  } catch (error) {
    job["completedAt"] = new Date();
    job["status"] = "error";
    job["output"] = JSON.stringify(error);

    await job.save();
    throw Error(JSON.stringify(err));
    // return res.status(500).json({error});
  }
});

jobQueue.on("failed", (error) => {
  console.log(error.data.id, error.failedReason);
});

const addJobToQueue = async (jobId) => {
  jobQueue.add({ id: jobId });
};

module.exports = {
  addJobToQueue,
};
