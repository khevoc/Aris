import { BrowserRouter, Routes, Route } from "react-router-dom"
import React, { useState } from 'react'
import Gallery from './components/Gallery'
import CrocodileExperience from "./pages/CrocodileExperience"
import Demo from "./components/Mockup"
import './styles/App.css'

export default function App() {
  const [theme] = useState('dark')

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Gallery />} />
        <Route path="/croco-experience" element={<CrocodileExperience />} />
        <Route path="/mockup" element={<Demo />} />
      </Routes>
    </BrowserRouter>
  )
}