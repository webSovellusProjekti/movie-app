import React from 'react'
import {useState, useEffect } from 'react'
import MovieCard from '../components/MovieCard'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api' //api-funktion käyttämiseen

export default function Home() {
  //Tuodaan elokuvien tiedot, yksi kerrallaan
  const [searchTerm, setSearchTerm] = useState('')

  //Tyhjä hakurivi
  const [movies, setMovies] = useState([])

  //Tarkisteaan tilamuuttujan arvo ja vaihdetaan se päinvastaiseksi
  const [showMovies, setShowMovies] = useState(false);

  //Sivun vaihto (12 elokuvaa per sivu)
  const [currentPage, setCurrentPage] = useState(1)
  const moviesPerPage = 12

  const indexOfLastMovie = currentPage * moviesPerPage
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage

  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie)

  const totalPages = Math.ceil(movies.length / moviesPerPage)

  //Navigoi lisätiedot eri sivulle
  const navigate = useNavigate();

  //Haetaan elokuvien tiedot Backendin kautta
  async function fetchMovies() {
    try {
    //Kutsutaan api-funktiota ja pyydetään tietoja
    const data = await api('/movies/popular');
    //Sijoitetaan tieto movies tilaan. (epäonnistuessa ??[] = Jos data.movies on null/undefined, asetetaan tilalle tyhjä taulukko [])
    setMovies(data.movies ?? [])
    }
    //Virhetilanteessa tulee tyhjä taulukko
    catch {
      setMovies([])
    }
  }

  //Hakusana toiminto backendin kautta
  async function searchMovies() {
    //Katsotaan onko hakukenttä tyhjä/välilyöntejä
    if (!searchTerm.trim()) {
      //Jos hakusanaa ei ole niin tuleew suositut elokuvat näkyviin
      fetchMovies()
      //laitetaan sivunumerointi
      setCurrentPage(1)
      return
    }
    try {
      //Lähetetään hakusana backendille. EncodeURIComponent muuntaa hakusanan URL-osoitteeseen sopivaan muotoon
      const data = await api(`/movies/search?q=${encodeURIComponent(searchTerm.trim())}`)
      //tallennetaan tiedot movies tilaan
      setMovies(data.movies ?? [])
    }
    //Virhetilanteessa tulee tyhjä taulukko
    catch{
      setMovies([])
    }
    //Palauteaan sivunumerointi ekalle sivulle.
    setCurrentPage(1)
  }

  //Vaihdetaan elokuvien lisätietojen näyttäminen on/off
  async function toggleMovies(){
    if(showMovies===false){
      setShowMovies(true)
    }
    else {
      setShowMovies(false)
    }
  }

  //Tallennetaan tiedot movies tilaan
  useEffect(() => {
    fetchMovies();
    }, []); 


  return (
    <div className="search-container">
      <h2>Elokuvat</h2>
      <h5>Voit hakea elokuvia nimellä, näyttelijällä tai ohjaajalla</h5>

      {/* enter painikkeen toimivuus */}
      <form onSubmit={(e) => {
        e.preventDefault();
        searchMovies();
      }}>
        <input
          type="text"
          name="search"
          placeholder="Hae elokuvia"

          // Tallennetaan hakusana searchTerm tilaan
          onChange={(e) => setSearchTerm(e.target.value)}/> 

          <button type="submit">Hae</button>
      </form>

        <div className="movies-container">
        
          {/* Haetaan elokuvien tiedot */}  
          {currentMovies.map((movie) => (  
            <MovieCard key={movie.id} 
            movie={movie} />
          ))}

        </div>

        <div className="pages">

          <button
            onClick={() => {
              setCurrentPage(currentPage - 1)
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              })
            }}
            disabled={currentPage === 1}
          >
            Edellinen
          </button>

          <span>
            Sivu {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => {
              setCurrentPage(currentPage + 1)
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              })
            }}
            disabled={currentPage === totalPages}
          >
            Seuraava
          </button>

        </div>

    </div>

  )
}
