import { BrowserRouter, Routes, Route } from "react-router-dom"
import React, { useState } from 'react'
import Gallery from './components/Gallery'
import ScrollToTop from "./components/ScrollToTop";
import AssistButton from "./components/AssistButton";
import Footer from "./components/Footer";

import CrocodileExperience from "./pages/CrocodileExperience"
import NightVision from "./components/CatScene"

import MaintenanceModal from "./components/MaintenanceModal";

import './styles/App.css'

export default function App() {
  const [theme] = useState('dark')

  return (
    <BrowserRouter>
    <ScrollToTop />
    <AssistButton />
      <Routes>
        <Route path="/" element={<Gallery />} />
        <Route path="/croco-experience" element={<CrocodileExperience />} />
        <Route path="/night-vision" element={<NightVision />} />
        <Route path="/store" element={<MaintenanceModal />} />
      </Routes>
      <Footer />
    </BrowserRouter>
    
  )
}