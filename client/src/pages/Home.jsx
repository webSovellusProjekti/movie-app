import React from 'react'
import {useState} from 'react'

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')

  
  return (
    <div className="search-container">
      <h2>Elokuvat</h2>
      <h5>Voit hakea elokuvia nimellä, näyttelijällä tai ohjaajalla</h5>

      <input
        type="text"
        name="search"
        placeholder="Hae elokuvia"
      />
      <button type="submit">
        Hae
        </button>

    </div>

  )
}
