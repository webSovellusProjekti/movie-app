import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import Home from './pages/Home'
import LogIn from './pages/LogIn'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import Navbar from './components/Navbar'
import Header from './components/Header'
import Footer from './components/Footer'
import{ Routes,Route } from 'react-router-dom' 
//sivun polkua varten

function App() {

  return (
    <>
      <Navbar />
      <Header />
      <div id="container">
        <Routes>
          <Route path="/" exact element={<Home />}/>
          <Route path="/Kirjautuminen" exact element={<LogIn />}/>
          <Route path="/Rekisterointi" exact element= {<Register />} />
          <Route path="/*" exact element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </>
  )
}

export default App
