import React, { useState } from "react";
import { FaGithub } from "react-icons/fa";
import "./Header.css";

const Header = (props) => {
  const [copied, setCopied] = useState("Copy");

  const copyText = () => {
    navigator.clipboard.writeText(`http://localhost:3000/code/${props.documentId}`);
    setCopied("Copied ✅");
  };

  const resetCopy = () => {
    setCopied("Copy");
  };

  return (
    <div>
      <div className="header">
        {/* Title */}
        <div className="title">
          <span style={{color: "#25EC50"}}>{"{"} </span> &nbsp;Codemates&nbsp; <span style={{color: "#25EC50"}}>{"}"}</span>
        </div>

        {/* Title */}
        <div className="share-container">
          <div className="share-text">
            Invite friends 👉{" "}
          </div>

          <div
            className="share"
            onClick={() => copyText()}
            onMouseLeave={() => resetCopy()}
          >
            {props.documentId}
            <span className="tooltiptext">{copied}</span>
          </div>
        </div>

        <div className="github-container">
        <a className="github"href="https://github.com/ccronheimer/codemates-client" target="_blank" rel="noopener noreferrer">
            <FaGithub size={30}/>
        </a>
        </div>

      </div>

      <div className="divider"> </div>
    </div>
  );
};

export default Header;
