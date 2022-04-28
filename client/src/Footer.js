import React from "react";
import "./Footer.css";
import { FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="container-footer">
      <p className="footer-text">
        Developed by <br />
        Cameron Cronheimer 🇨🇦 2022
      </p>
      <a href="https://github.com/ccronheimer/codemates" target="_blank" rel="noreferrer">
      <FaGithub size={32} className="github"/>
      </a>
     
    </div>
  );
};

export default Footer;
