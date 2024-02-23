import styled from "@emotion/styled";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import apiService from "../service/apiService";
import { io } from "socket.io-client";

  // 1. We are subscribing to the logs of the project
  // 2. We are getting the logs from the server and updating the logs state
  // 3. We are setting the title of the document to Deployhub
  // 4. We are setting the state of the logs
  // 5. We are setting the state of the url
  // 6. We are setting the state of the activeSlug
  // 7. We are setting the state of the loading
  // 8. We are setting the state of the error
  // 9. We are setting the state of the slug
  // 10. We are setting the state of the repoLink



const SubmissionPage = () => {
  const [repoLink, setRepoLink] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeSlug, setActiveSlug] = useState("");
  const [url, setUrl] = useState("");
  const [logs, setLogs] = useState([]);

  const logContainerRef = useRef(null);




  const handleSocketIncommingMessage = useCallback((message) => {
    if (typeof message === "string") {
      setLogs((prev) => [...prev, message]);
    } else {
      const { log } = JSON.parse(message);
      setLogs((prev) => [...prev, log]);
    }
    logContainerRef.current.scrollTop = 0;
  }, []);

  useEffect(() => {
    document.title = "Deployhub";
  }, []);

  const handleChange = (event) => {
    setRepoLink(event.target.value);
  };

  const handleSubmit = () => {
    console.log(repoLink);
    const githubRepoRegex = /^https:\/\/github\.com\/[^/]+\/[^/]+$/;
    if (!githubRepoRegex.test(repoLink)) {
      setError("Invalid! GitHub repo link.");
    } else {
      setError("");
      setLoading(true);
      apiService("http://localhost:9000/project", "POST", {
        gitURL: repoLink,
        slug,
      })
        .then((data) => {
          const { projectSlug, url } = data.data;
          setActiveSlug(projectSlug);
          setUrl(url);
        })
        .catch((error) => {
          console.log(error);
          window.alert("Error in submitting the repo");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  let socket = useRef(null);

  useEffect(() => {
    if (!socket.current) {
      socket.current = io("http://localhost:9002");
    }
  }, []);

  useEffect(() => {
    if (!activeSlug) return;
    setLogs([]);
    socket.current.emit("subscribe", `logs:${activeSlug}`);
  }, [activeSlug]);

  useEffect(() => {
    socket.current.on("message", handleSocketIncommingMessage);
    return () => {
      socket.current.off("message", handleSocketIncommingMessage);
    };
  }, [handleSocketIncommingMessage]);

  
  const handleReset = () => {
    setRepoLink("");
    setSlug("");
    setError("");
    setLoading(false);
    setActiveSlug("");
    setUrl("");
    setLogs([]);
  };
  const Styled = useMemo(
    () => styled.div`
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-size: cover;

      background-position: center;
      .submit-view,
      .log-view {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
        gap: 12px;
        @media (max-width: 768px) {
          padding: 10px;
        }
      }
      .error-text {
        margin: 4px 2px;
        color: red;
        font-size: 12px;
        text-align: center;
      }
      .url-container {
        padding: 4px 8px;
        background: #646cff;
        color: white;
        border-radius: 4px;
      }
      .log-container {
        min-height: 200px;
        max-height: 400px;
        width: calc(100vw - 40px);
        background: #000;
        color: #fff;
        overflow-y: auto;
        padding: 10px;
        border-radius: 8px;
        text-align: left;
        font-size: 8px;
        display: flex;
        flex-direction: column;
        text-align: left;
      }
      .label {
        margin-bottom: 1px;
        align-items:center; 
      }
      .label-text {
        margin-top: 0;
        align-items : center
      }
      .new-submission {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
      }
      .url {
        text-align: center;
      }
      svg {
        max-width: 100vw;
        margin-bottom: 0px;
        z-index: -1;
        position: absolute;
        bottom: 0; /* Position at the bottom of the screen */
        left: 0; /* Ensure it's aligned to the left */
        width: 100%; /* Full width */ 
      }
    `,
    []
  );

  return (
    <Styled>
      {!activeSlug ? (
        <div className="submit-view">
          <h1 className="label">Your Code Launchpad</h1>
          <h3 className="label-text">Connect your GitHub repo to deploy</h3>
          <div>
            <Input
              type="text"
              value={repoLink}
              onChange={handleChange}
              placeholder="https://github.com/username/repo"
            />
            {error && <div className="error-text">{error}</div>}
          </div>
          
          <Input
            type="text"
            value={slug}
            onChange={(event) => {
              setSlug(event.target.value);
            }}
            placeholder="Slug (Optional)"
          />
          <Button
            onClick={loading ? () => {} : handleSubmit}
            text={loading ? "In Progress" : "Deploy"}
          />
        </div>
      ) : (
        <div className="log-view">
          {url && (
            <div className="url">
              Preview URL:{" "}
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="url-container"
              >
                {url}
              </a>
            </div>
          )}
          <div className="title">Showing logs for: {activeSlug}</div>
          <div className="log-container" ref={logContainerRef}>
            {logs.map((log, index) => (
              <div key={index} className="log-line">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
      {activeSlug && (
        <div className="new-submission">
          <Button text={"New Submission"} onClick={handleReset} />
        </div>
      )}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#0099ff" fill-opacity="11000" d="M0,128L48,112C96,96,192,64,288,85.3C384,107,480,181,576,181.3C672,181,768,107,864,64C960,21,1056,11,1152,21.3C1248,32,1344,64,1392,80L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
    </Styled>
    
    
  );
};

export default SubmissionPage;
