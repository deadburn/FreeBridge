import React from "react";
import { Routes, Route, Router } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Vacancies from "../pages/Vacancies.jsx";
import Profile from "../pages/Profile.jsx";
import CompanyDashboard from "../pages/CompanyDashboard.jsx";

export default function AppRouter() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/vacantes" element={<Vacancies />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/company-dashboard" element={<CompanyDashboard />} />
      </Routes>
    </>
  );
}
