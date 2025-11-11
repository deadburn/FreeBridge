import React from "react";
import { Routes, Route, Router } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Vacancies from "../pages/Vacancies.jsx";
import ProfileRedirect from "../pages/ProfileRedirect.jsx";
import CompanyDashboard from "../pages/CompanyDashboard.jsx";
import FreelanceDashboard from "../pages/FreelanceDashboard.jsx";

export default function AppRouter() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/vacantes" element={<Vacancies />} />
        <Route path="/perfil" element={<ProfileRedirect />} />
        <Route path="/company-dashboard" element={<CompanyDashboard />} />
        <Route path="/freelance-dashboard" element={<FreelanceDashboard />} />
      </Routes>
    </>
  );
}
