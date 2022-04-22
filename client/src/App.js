import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom"
import Creator from './Creator';
import Editor from './Editor';

function App() {
  return (

    
    <Router>
      <Routes>
      {/* load main screen redirects to random document */}
      <Route path="/" element={<Creator/>} />
      {/* when on document with a id then enter the notepad*/}
      <Route path="/code/:id" element={<Editor/>}/>
      </Routes>
    </Router>
  )
}
export default App;
