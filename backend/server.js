const express = require('express');
const cors = require('cors');

const { createFile } = require('./createFile');

const { runCpp } = require('./runCpp');
const { runPy } = require('./runPy');
const { runJs } = require('./runJs');

const app = express();

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.post("/run", async (req, res)=>{

    const {language = "cpp", code} = req.body;

    if(code === undefined){
        return res.status(400).json({success:false, error:"empty code"});
    }

    try{
    const filePath = await createFile(language, code);

    let output;
    
    if(language==="cpp"){
        output = await runCpp(filePath);
    }
    else if(language==="py"){
        output = await runPy(filePath);
    }
    else if(language==="js"){
        output = await runJs(filePath);
    }

    return res.json({filePath, output});
    } catch(error){

    return res.status(500).json({error});
    }
})

app.listen(5000, ()=>{
    console.log("listening on port 5000");
})