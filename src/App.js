import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom"
import { v4 as uuidV4 } from "uuid"
import Editor from './Editor';

function App() {
  return (
    <Router>
      <Routes>
      {/* load main screen redirects to random document */}
      <Route path="/" element={<Navigate to={`/documents/${uuidV4()}`}/>} />
      {/* when on document with a id then enter the notepad*/}
      <Route path="/documents/:id" element={<Editor/>}/>
      </Routes>
    </Router>
  )
}
export default App;
