import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/appRouter.jsx";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <AppRouter />
      </div>
    </BrowserRouter>
  );
}

export default App;
