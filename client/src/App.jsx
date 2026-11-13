import { useState } from 'react'
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
import MovieCard from './components/MovieCard'

function App() {

  return (
    <AuthProvider>
      <div className='App'>
        <Navbar />
        <Header />
        <div id="container">
          <Routes>
            <Route path="/" exact element={<Home />}/>
            <Route path="/kirjautuminen" exact element={<LogIn />}/>
            <Route path="/rekisterointi" exact element= {<Register />} />
            <Route path="/movies/:id" exact element={<MovieCard />} />
            <Route path="/*" exact element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </AuthProvider>
  )
}

export default App
