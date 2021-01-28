import { Router } from "@reach/router";
import React from "react";
import "./App.css";
import Login from "./components/Login";
import User from "./components/User";

function App() {
  return (
    <Router>
      <Login path="/" />
      <User path="/user/:uid" />
    </Router>
  );
}

export default App;
