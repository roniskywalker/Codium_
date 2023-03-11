const express = require('express');
const cors = require('cors');

const { createCppFile } = require('./createCppFile');
const { runCpp } = require('./runCpp');

const app = express();

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get("/", (req, res)=>{
    return res.json({Hello:"world"});
})

app.post("/run", async (req, res)=>{

    const {language = "cpp", code} = req.body;

    if(code === undefined){
        return res.status(400).json({success:false, error:"empty code"});
    }
    try{
    const filePath = await createCppFile(language, code);
        
    const output = await runCpp(filePath);

    return res.json({filePath, output});
    } catch(error){
        return res.status(500).json({error});
    }
})

app.listen(5000, ()=>{
    console.log("listening on port 5000");
})