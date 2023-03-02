import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Chatpage from "./pages/Chatpage";
import "./App.css";

function App() {
  return (
    <div className="App">
    <BrowserRouter>
      <Routes>
        <Route path="/"  element={<Homepage />} exact />
        <Route path="/chats"  element={<Chatpage />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
