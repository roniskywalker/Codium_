const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/test")
  .then(() => console.log("Connected with mongoose"));

const { createFile } = require("./createFile");

const { addJobToQueue } = require("./jobQueue");
const Job = require("./models/Job");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/run", async (req, res) => {
  const { language = "py", code } = req.body;

  // console.log(language, "Length:", code.length);

  if (code === undefined) {
    return res.status(400).json({ success: false, error: "empty code" });
  }
  const filePath = await createFile(language, code);
  const job = await new Job({ language, filePath }).save();
  const jobId = job["_id"];
  addJobToQueue(jobId);
  res.status(201).json({ jobId });
});

app.get("/status", async (req, res) => {
  const jobId = req.query.id;

  if (jobId === undefined) {
    return res
      .status(400)
      .json({ success: false, error: "Missing id query param" });
  }

  const job = await Job.findById(jobId);
  if (job === undefined) {
    return res.status(400).json({ success: false, error: "Invalid job Id" });
  }

  return res.status(200).json({ success: true, job });
});

app.listen(5000, () => {
  console.log("listening on port 5000");
});
