import React from "react";
import Button from "./Button";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
// import '@fonts/volkhov/volkhov.css';


function Welcome() {
  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate("/submission");
  };
  const Styled = styled.div`
    .title {
      color: #fff;
      
      font-size: 2.5em;
    }
.highlighted {
  font-weight: bold;
  font-style: italic;
  color: white; /* Initial color */
  animation: color-blink 2s infinite alternate; /* Color blinking animation */
}

@keyframes color-blink {
  0% {
    color: white; /* Initial color */
  }
  50% {
    color: #646cff; /* Blue color */
  }
  100% {
    color: white; /* Back to white color */
  }
}

    }
    .welcome-text {
      color: #666;
      font-size: 16px;
      line-height: 1.5;
      margin: 20px 0;
      padding: 0 100px;
    }
    .btn-container {
      display: flex;
      justify-content: center;
    }
  `;

  return (
    <Styled>
      
      <div className="title">Welcome to <span className="highlighted">Deployhub</span> - Your Deployment Companion!</div>
      
      <div className="welcome-text">
        Deployhub is a platform designed to streamline the deployment process for your applications. Deployhub simplifies the process by providing a composable architecture and seamless integration with Git repositories. Say goodbye to deployment headaches and hello to effortless deployments with Deployhub!
      </div>

      <div className="btn-container">
        <Button onClick={handleButtonClick} text={"Get Started"} />
      </div>
    </Styled>
  );
}

export default Welcome;
