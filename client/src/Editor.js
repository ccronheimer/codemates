import React, { useEffect } from "react";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/monokai.css";

// python, java, c#, c++, javascript, swift
import "codemirror/mode/clike/clike";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/python/python";
import "codemirror/mode/swift/swift";

import "codemirror/keymap/sublime";
import CodeMirror from "codemirror";

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
  const [selected, setSelected] = useState();
  const [editor, setEditor] = useState();

  const [users, setUsers] = useState();
  /*
    Connect to socket server
  */
  useEffect(() => {

    const s = io({ path: "/socket.io" })   
    // const s = io("http://localhost:3001/", {
    //   transports: ["websocket"],
    // });

    setSocket(s);

    /* EDITOR INIT */
    const cm = CodeMirror.fromTextArea(document.getElementById("codemirror"), {
      value: "hello",
      lineNumbers: true,
      keyMap: "sublime",
      theme: "monokai",
      mode: "python",
    });

    setEditor(cm);

    // code mirror changes
    cm.on("change", (instance, changes) => {
      const { origin } = changes;

      // if the change is use then emit
      if (origin !== "setValue") {
        s.emit("CODE_CHANGED", instance.getValue());
        setCode(instance.getValue()); // for saving

        // a save is underway
        setIsSaved(false);
      }
    });

    // number of users in our room
    s.on("clients", (num) => {
      setUsers(num);
    });

    s.on("syntax-change", (syntax) => {
      cm.setOption("mode", syntax);
      setSelected(syntax);
      // cm.setValue(syntax);
    });

    // changes code on socket change
    s.on("receive-changes", (code) => {
      cm.setValue(code);
      setCode(code);

      // a save is underway
      setIsSaved(false);
    });

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

        // set editor init value to the saved code
        editor.getDoc().setValue(response.data.data.code.code);
        // join document
        socket.emit("get-document", documentId);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [socket, documentId, editor]);

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
              onChange={(e) => {
                socket.emit("change-syntax", e.target.value);
                editor.setOption("mode", e.target.value);
                setSelected(e.target.value);
              }}
            >
              <option value="python">Python</option>
              <option value="text/x-java">Java</option>
              <option value="javascript">Javascript</option>
              <option value="text/x-csharp">C#</option>
              <option value="text/x-c++src">C++</option>
              <option value="swift">Swift</option>
            </select>

            <div className="users">{users} connected</div>
          </div>

          <textarea className="editor" id="codemirror" />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Editor;
