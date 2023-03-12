import './App.css';
import React, {useState} from 'react';
import axios from 'axios';

function App() {

  const [code, setCode] = useState(" ");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("cpp");

  const handleSubmit = async () => {
    const payload = {
      language,
      code
    };
    try{
    const {data} = await axios.post("http://localhost:5000/run", payload);
    
    setOutput(data.output);

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
        value = {language}
        onChange={(e)=>{
            setLanguage(e.target.value);
          }
        }
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
      <p>{output}</p>
    </div>
  );
}

export default App;
