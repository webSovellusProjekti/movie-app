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
import{ Routes,Route } from 'react-router-dom' //sivun polkua varten
import { AuthProvider } from './context/AuthProvider' //autentikointi ja auktorisointia varten


function App() {

  return (
    <AuthProvider>
      <Navbar />
      <Header />
      <div id="container">
        <Routes>
          <Route path="/" exact element={<Home />}/>
          <Route path="/rekisterointi" exact element={<Register />} />
          <Route path="/kirjautuminen" exact element= {<LogIn />} />
          <Route path="/*" exact element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </AuthProvider>
  )
}

export default App
