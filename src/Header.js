import React, { useState } from "react";
import "./Header.css";

const Header = (props) => {
  const [copied, setCopied] = useState("Copy");

  const copyText = () => {
    navigator.clipboard.writeText(props.documentId);
    setCopied("Copied ✅");
  };

  const resetCopy = () => {
    setCopied("Copy");
  };

  return (
    <div>
      <div className="header">
        {/* Title */}
        <div className="title">Codemates</div>

        {/* Title */}
        <div className="share-container">
          <div className="share-text">
            Share this code to invite friends 👉{" "}
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

        <a className="github" href="/">
          GitHub
        </a>

      </div>

      <div className="divider"> </div>

    </div>
  );
};

export default Header;
