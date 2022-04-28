import React, { useState } from "react";
import "./Header.css";
import { FaRegCopy } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";

const Header = (props) => {
  const [copied, setCopied] = useState(false);

  const copyText = () => {
    navigator.clipboard.writeText(
      `https://codemates.ca/code/${props.documentId}`
    );
    console.log("copy");
  setCopied(true);
  };


  const unCopy = () => {
    setTimeout(() => {
      setCopied(false);
  }, 2000);

  return () => clearInterval(2000);
  }

  return (
    <>
      <div className="header">
        {/* Title */}
        <div className="title">
          <span style={{ color: "#25EC50" }}>{"{"} </span> &nbsp;Codemates&nbsp;{" "}
          <span style={{ color: "#25EC50" }}>{"}"}</span>
        </div>

        {/* Title */}
        <div className="share-container">
          <div className="share-text">Invite friends 👉 </div>

          <div className="share-sub-container">
            <div className="share">{props.documentId}</div>

            <div
              className="share-icon-container"
              onClick={() => copyText()}
              onMouseLeave={() => unCopy()}
            >
              {copied ? (
                <FaCheck className="checkmark" />
              ) : (
                <FaRegCopy className="share-icon" />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="divider" />
    </>
  );
};

export default Header;
