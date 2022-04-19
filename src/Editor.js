import React, { useEffect } from "react";
import { oneDark } from "@codemirror/theme-one-dark";
import CodeMirror from "@uiw/react-codemirror";
import { java } from "@codemirror/lang-java";
import { javascript } from "@codemirror/lang-javascript";
import { useState } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import CodeFinder from "./apis/CodeFinder";
import "./Editor.css";

const Editor = () => {
  const { id: documentId } = useParams();
  const [code, setCode] = useState();
  const [socket, setSocket] = useState();
  const [savedCode, setSavedCode] = useState();

  /*
    Connect to socket server
  */
  useEffect(() => {
    const s = io("http://localhost:3001/");
    setSocket(s);
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
      } catch (error) {
        console.log(error);
      }
    };
    const interval = setInterval(() => {
      if (code !== savedCode) {
        handleSave();
      }
    }, 3000);
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

    return () => {
      socket.off("receive-changes", handler);
    };
  }, [socket, code]);

  return (
    <div>
      <div className="header">
      <h1>Codemates</h1>
       </div>

       <p className="share">Share this code 👉 {documentId}</p>
      
      <div className="container">
        <div className="editor">
          
          <CodeMirror
            value={code}
            height="400px"
            width="800px"
            theme={oneDark}
            extensions={[java(), javascript({ jsx: true })]}
            onChange={(value, viewUpdate) => {
              if (socket !== null) {
                socket.emit("send-changes", value);
                setCode(value);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Editor;
