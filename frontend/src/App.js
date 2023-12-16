import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Form/Register.js";
import LandingPage from "./components/Landing/LandingPage.js";
import HeaderDashboard from "./components/HeaderDashboard/HeaderDashboard.js";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route element={<PrivateRoute />}>
          <Route element={<HeaderDashboard />} path="/dashboard" />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
