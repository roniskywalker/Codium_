import './App.css';
import React, {useState} from 'react';
import axios from 'axios';

function App() {

  const [code, setCode] = useState(" ");
  const [output, setOutput] = useState("");

  const handleSubmit = async () => {
    const payload = {
      language: "cpp",
      code
    };
    try{
    const {data} = await axios.post("http://localhost:5000/run", payload);
    
    setOutput(data.output);
    } catch(error){
      console.log(error);
    }
  }

  return (
    <div className="App">
      <h1>Koden_</h1>
      <textarea rows="30" cols="100" value ={code} onChange= {(e)=>{
        setCode(e.target.value)
      }}></textarea>
      <button onClick={handleSubmit}>Submit</button>
      <p>{output}</p>
    </div>
  );
}

export default App;
