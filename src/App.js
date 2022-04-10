import "./App.css";
import { oneDark } from "@codemirror/theme-one-dark";
import CodeMirror from "@uiw/react-codemirror";
import { java } from "@codemirror/lang-java";
import { javascript } from "@codemirror/lang-javascript";
import { useState } from "react";

function App() {
  const [code, setCode] = useState("console.log(hello)");

  return (
    <>

      <button onClick={()=> setCode("test")}> button</button>
      <CodeMirror
        value={code}
        height="100%"
        theme={oneDark}
        extensions={[java(), javascript({ jsx: true })]}
        onChange={(value, viewUpdate) => {
          console.log("value:", value);
        }}
      />
    </>
  );
}

export default App;
