import React, { useEffect } from "react";
import { oneDark } from "@codemirror/theme-one-dark";
import CodeMirror from "@uiw/react-codemirror";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { cpp } from "@codemirror/lang-cpp";
import { html } from "@codemirror/lang-html";
import { rust } from "@codemirror/lang-rust";

// import { javascript } from "@codemirror/lang-javascript";
// import { cpp } from "@codemirror/lang-cpp";
// import { json } from "@codemirror/lang-json"
// import { html } from "@codemirror/lang-html";
import { useState } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import CodeFinder from "./apis/CodeFinder";
import "./Editor.css";
import Header from "./Header";
import Footer from "./Footer";

const Editor = () => {
  const { id: documentId } = useParams();
  const [code, setCode] = useState();
  const [socket, setSocket] = useState();
  const [savedCode, setSavedCode] = useState();
  const [isSaved, setIsSaved] = useState(true);
  const [language, setLanguage] = useState();
  const [selected, setSelected] = useState();

  const [users, setUsers] = useState();

  /*
    Connect to socket server
  */
  useEffect(() => {
    const s = io("http://localhost:3001/");
    setSocket(s);
    //  console.log(Array.from(io.s.s.keys()))

    s.on("clients", (num) => {
      setUsers(num);
    });

    setLanguage(java());
    return () => {
      s.disconnect();
    };
  }, []);

  /*
    GET: get our document and have our socket join it
  */
  useEffect(() => {
    if (socket == null) return;

    const fetchData = async () => {
      try {
        const response = await CodeFinder.get(`/${documentId}`);
        setCode(response.data.data.code.code);
        setSavedCode(response.data.data.code.code);

        // join document
        socket.emit("get-document", documentId);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [socket, documentId]);

  /* 
    SAVE: if there is a change in code then we set a timer to update changes
  */
  useEffect(() => {
    const handleSave = async () => {
      try {
        const response = await CodeFinder.put(`/${documentId}`, {
          code: code,
        });
        setSavedCode(response.data.data.code.code);
        setIsSaved(true);
      } catch (error) {
        console.log(error);
      }
    };
    const interval = setInterval(() => {
      if (code !== savedCode) {
        handleSave();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [code, savedCode, documentId]);

  /*
    Receive changes handler for our socket
  */

  useEffect(() => {
    if (socket == null) return;

    const handler = (code) => {
      setCode(code);
    };

    socket.on("receive-changes", handler);

    const shandler = (syntax) => {
      console.log(syntax);
      if (syntax === "python") {
        setLanguage(python());
        setSelected("python");
      }
      if (syntax === "java") {
        setLanguage(java());
        setSelected("java");
      }
      if (syntax === "javascript") {
        setLanguage(javascript());
        setSelected("javascript");
      }
      if (syntax === "cpp") {
        setLanguage(cpp());
        setSelected("cpp");
      }
      if (syntax === "html") {
        setLanguage(html());
        setSelected("html");
      }
      if (syntax === "rust") {
        setLanguage(rust());
        setSelected("rust");
      }
    };

    socket.on("receive-syntax", shandler);

    return () => {
      socket.off("receive-changes", handler);
    };
  }, [socket, code]);

  // for some reason setting state from select value would bug out
  const setLanguageHandler = (e) => {
    if (e === "python") {
      setLanguage(python());
      setSelected("python");
      socket.emit("send-syntax", "python");
    }
    if (e === "java") {
      setLanguage(java());
      setSelected("java");
      socket.emit("send-syntax", "java");
    }
    if (e === "javascript") {
      setLanguage(javascript());
      setSelected("javascript");
      socket.emit("send-syntax", "javascript");
    }
    if (e === "cpp") {
      setLanguage(cpp());
      setSelected("cpp");
      socket.emit("send-syntax", "cpp");
    }
    if (e === "html") {
      setLanguage(html());
      setSelected("html");
      socket.emit("send-syntax", "html");
    }
    if (e === "rust") {
      setLanguage(rust());
      setSelected("rust");
      socket.emit("send-syntax", "rust");
    }
  };
  return (
    <div>
      <Header documentId={documentId} />

      <div className="container">
        <div className="editor-container">
          <div className="editor-header">
            <div className="save-container">
              {isSaved ? (
                <div className="save">Saved</div>
              ) : (
                <div className="loader"></div>
              )}
            </div>

            {/* Select field */}
            <select
              value={selected}
              className="selector"
              type="select"
              onChange={(e) => setLanguageHandler(e.target.value)}
            >
              <option value="java">Java</option>
              <option value="python">Python</option>
              <option value="javascript">Javascript</option>
              <option value="cpp">C++</option>
              <option value="html">Html</option>
              <option value="rust">Rust</option>
            </select>

            <div className="users">{users} connected</div>
          </div>

          <div className="editor">
            <CodeMirror
              value={code}
              height="60vh"
              width="60vw"
              theme={oneDark}
              extensions={language}
              onChange={(value, viewUpdate) => {
                if (socket !== null) {
                  socket.emit("send-changes", value);
                  setCode(value);

                  /* prevents from loading on start */
                  if (savedCode) {
                    setIsSaved(false);
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Editor;
