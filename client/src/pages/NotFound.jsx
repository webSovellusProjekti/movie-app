import React from 'react'
import { Link } from 'react-router-dom';
import './NotFound.css'

export default function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Sivua ei löytynyt</h2>

        <Link to="/" className="not-found-button">
          Takaisin etusivulle
        </Link>
      </div>
    </main>
  )
}
