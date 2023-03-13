import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import stubs from "./defaultStubs";
import moment from "moment";

function App() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);

  useEffect(() => {
    setCode(stubs[language]);
  }, [language]);

  useEffect(() => {
    const defaultLanguage = localStorage.getItem("default-language") || "cpp";
    setLanguage(defaultLanguage);
  }, []);

  let pollInterval;

  const handleSubmit = async () => {
    const payload = {
      language,
      code,
    };
    try {
      setOutput("");
      setStatus(null);
      setJobId(null);
      setJobDetails(null);
      const { data } = await axios.post("http://localhost:5000/run", payload);
      if (data.jobId) {
        setJobId(data.jobId);
        setStatus("submitted");

        pollInterval = setInterval(async () => {
          const { data: statusRes } = await axios.get(
            `http://localhost:5000/status`,
            {
              params: {
                id: data.jobId,
              },
            }
          );
          const { success, job, error } = statusRes;
          console.log(statusRes);
          if (success) {
            const { status: jobStatus, output: jobOutput } = job;
            setStatus(jobStatus);
            setJobDetails(job);
            if (jobStatus === "pending") return;
            setOutput(jobOutput);
            clearInterval(pollInterval);
          } else {
            console.error(error);
            setOutput(error);
            setStatus("Bad request");
            clearInterval(pollInterval);
          }
        }, 1000);
      } else {
        setOutput("Retry again.");
      }
    } catch ({ response }) {
      if (response) {
        const errorMsg = response.data.error.stderr;
        setOutput(errorMsg);
      } else {
        setOutput("Connection problem");
      }
    }
  };

  const setDefaultLanguage = () => {
    localStorage.setItem("default-language", language);
    console.log(`${language} set as default language`);
  };

  const renderTimeDetails = () => {
    if (!jobDetails) {
      return "";
    }
    let { submittedAt, startedAt, completedAt } = jobDetails;
    let result = "";
    submittedAt = moment(submittedAt).toString();
    result += `Job Submitted At: ${submittedAt}  `;
    if (!startedAt || !completedAt) return result;
    const start = moment(startedAt);
    const end = moment(completedAt);
    const diff = end.diff(start, "seconds", true);
    result += `Execution Time: ${diff}s`;
    return result;
    // return JSON.stringify(jobDetails);
  };

  return (
    <div className="App">
      <h1>Koden_</h1>
      <div>
        <label>Language: </label>
        <select
          value={language}
          onChange={(e) => {
            let response = window.confirm(
              "Swithching your language will effect your code"
            );
            if (response) {
              setLanguage(e.target.value);
            }
          }}
        >
          <option value="cpp">C++</option>
          <option value="py">Python</option>
          <option value="js">JavaScript</option>
        </select>
      </div>
      <div>
        <button onClick={setDefaultLanguage}>Set default</button>
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
      <p>{jobId ? `Job ID: ${jobId}` : ""}</p>
      <p>{status}</p>
      <p>{renderTimeDetails()}</p>
      <label>Output: </label>
      <p>{output}</p>
    </div>
  );
}

export default App;
