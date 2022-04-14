import React, { useEffect } from "react";
import { oneDark } from "@codemirror/theme-one-dark";
import CodeMirror from "@uiw/react-codemirror";
import { java } from "@codemirror/lang-java";
import { javascript } from "@codemirror/lang-javascript";
import { useState } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

const Editor = () => {
  const { id: documentId } = useParams();
  const [code, setCode] = useState("console.log(hello)");
  const [socket, setSocket] = useState();

  // server is on port
  useEffect(() => {
    const s = io("http://localhost:3001/");
    setSocket(s);

    //socket.on('receive-changes', handler);
    return () => {
      s.disconnect();
    };
  }, []);

  // loads up the document
  useEffect(() => {
    if (socket == null) return;

    // join document
    socket.emit("get-document", documentId);
  }, [socket, documentId]);


  useEffect(() => {
    if (socket == null) return

    const handler = delta => {
      //quill.updateContents(delta)
      setCode(delta);
      console.log(delta);
    }
    socket.on("receive-changes", handler)

    return () => {
      socket.off("receive-changes", handler)
    }
  }, [socket, code])



  return (
    <>
      <button onClick={() => setCode("test")}> button</button>
      <CodeMirror
        value={code}
        height="100%"
        theme={oneDark}
        extensions={[java(), javascript({ jsx: true })]}
        onChange={(value, viewUpdate) => {
          if (socket !== null) {
            socket.emit("send-changes", value);
          }
        }}
      />
    </>
  );
};

export default Editor;
