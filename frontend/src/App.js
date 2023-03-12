import './App.css';
import React, {useState} from 'react';
import axios from 'axios';

function App() {

  const [code, setCode] = useState(" ");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [status, setStatus] = useState("");

  const handleSubmit = async () => {
    const payload = {
      language,
      code
    };
    try{

      setStatus("");
      setOutput("");
      
    const {data} = await axios.post("http://localhost:5000/run", payload);
    
    console.log(data);
    // setOutput(data.jobId);

    let intervalId;


    intervalId = setInterval( async () => {
      const {data: dataRes} = await axios.get("http://localhost:5000/status", {params:{id: data.jobId}});
      const {success, job, error} = dataRes;
      console.log(dataRes);

      if(success){
        const {status:jobStatus, output:jobOutput} = job;
        setStatus(jobOutput);
        if (jobStatus==="pending") return;
        setOutput(jobOutput);
        clearInterval(intervalId);
      }else{
        setStatus("Error");
        console.error(error);
        clearInterval(intervalId);
        setOutput(error)
      }

      console.log(dataRes);
    },1000);

    } catch({response}){
    if(response){
      const errorMsg = response.data.error.stderr;
      setOutput(errorMsg);
    }
    else{
      setOutput("Connection problem");
    }
    }
  }

  return (
    <div className="App">
      <h1>Koden_</h1>
      <div>
        <label>Language: </label>
        <select
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);
          }}
        >
          <option value="cpp">C++</option>
          <option value="py">Python</option>
          <option value="js">JavaScript</option>
        </select>
      </div>
      <textarea
        rows="30"
        cols="100"
        value={code}
        onChange={(e) => {
          setCode(e.target.value);
        }}
      ></textarea>
      <button onClick={handleSubmit}>Submit</button>
      <label>Output: </label>
      <p>{status}</p>
      <p>{output}</p>
    </div>
  );
}

export default App;
