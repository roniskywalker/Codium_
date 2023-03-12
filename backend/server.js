const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

mongoose
  .connect("mongodb://127.0.0.1:27017/test")
  .then(() => console.log("Connected with mongoose"));

const { createFile } = require('./createFile');

const { runCpp } = require('./runCpp');
const { runPy } = require('./runPy');
const { runJs } = require('./runJs');
const Job = require('./models/Job');

const app = express();

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ hello: "world" });
});

app.get("/status", async (req, res) => {
    const jobId =req.query.id;
    console.log("status requested", jobId);

    if(jobId == undefined){
        return res.status(400).json({success: false, error:"Missing id query param"});
    }
    try{
    const job = await Job.findById(jobId);

    if (job ===undefined){
        return res.status(404).json({success:false, error: "Invalid job Id"});
    }

    return res.status(200).json({success: true, job});
    } catch(err){
        return res.status(400).json({success:false, error: JSON.stringify(err)});
    }

});

app.post("/run", async (req, res)=>{

    const {language = "cpp", code} = req.body;

    if(code === undefined){
        return res.status(400).json({success:false, error:"empty code"});
    }

    let job;
    try{
    const filePath = await createFile(language, code);

    job = await new Job({language, filePath}).save();
    const jobId = job["_id"];

    res.status(200).json({success: true, jobId});
    console.log(job);

    let output;
    
    job["startedAt"]= new Date();

    if(language==="cpp"){
        output = await runCpp(filePath);
    }
    else if(language==="py"){
        output = await runPy(filePath);
    }
    else if(language==="js"){
        output = await runJs(filePath);
    }

    job["completedAt"]= new Date();
    job["status"] = "success";
    job["output"] = output;

    await job.save();

    console.log(job);
    // return res.json({filePath, output});
    } 
    catch(error){
    
    job["completedAt"] = new Date;
    job["status"] =  "error";
    job["output"] = JSON.stringify(error);

    await job.save();
    console.log(job);
    return res.status(500).json({error});
    }
})

app.listen(5000, ()=>{
    console.log("listening on port 5000");
})