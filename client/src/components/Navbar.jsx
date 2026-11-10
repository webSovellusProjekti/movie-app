import React from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

//Navigointipalkki sivun yläreunassa
export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        {/* Korvataan linkki osaan "/", jotta navigointuu etusivulle */}
        {/* <a className="navbar-brand" href="/">Elokuvasovellus</a> */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link className="nav-link" to="/">Elokuvasovellus</Link>
          </li>
          {/* <li className="nav-item">
            <Link className="nav-link" to="/Kirjautuminen">Kirjautuminen</Link>
          </li> */}
          <li className="nav-item">
            <Link className="nav-link" to="/Kirjautuminen">Kirjaudu</Link>
          </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
