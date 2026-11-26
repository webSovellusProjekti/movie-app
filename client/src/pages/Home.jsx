import React from 'react'
import { useState, useEffect } from 'react'
import MovieCard from '../components/MovieCard'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api' //api-funktion käyttämiseen

export default function Home() {
  //Tuodaan elokuvien tiedot, yksi kerrallaan
  const [searchTerm, setSearchTerm] = useState('')

  //Tyhjä hakurivi
  const [movies, setMovies] = useState([])

  //näyttelijähaku
  const [searchType, setSearchType] = useState('q')

  //Tarkisteaan tilamuuttujan arvo ja vaihdetaan se päinvastaiseksi
  const [showMovies, setShowMovies] = useState(false);

  //Sivun vaihto (12 elokuvaa per sivu)
  const [currentPage, setCurrentPage] = useState(1)
  const moviesPerPage = 20

  const indexOfLastMovie = currentPage * moviesPerPage
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage

  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie)

  const totalPages = Math.ceil(movies.length / moviesPerPage)

  //Navigoi lisätiedot eri sivulle
  const navigate = useNavigate();

  //Haetaan elokuvien tiedot Backendin kautta
  async function fetchMovies() {
    try {
    //Kutsutaan api-funktiota ja pyydetään tietoja. Api funktiolla kootaan toiminnalisuudet yhteen paikkaan ja tässä pyydetään tietoja frontendille backendiltä.
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
      //Jos hakusanaa ei ole niin tulee suositut elokuvat näkyviin
      fetchMovies()
      //laitetaan sivunumerointi
      setCurrentPage(1)
      return
    }
    try {      
        const search = encodeURIComponent(searchTerm.trim())

        // Haetaan elokuvat elokuvan nimellä ja näyttelijän nimellä
        const [titleData, actorData] = await Promise.all([
            api(`/movies/search?q=${search}`),
            api(`/movies/search?actor=${search}`)
        ])
        
        // Yhdistetään molempien hakujen tulokset
        const combinedMovies = [
            ...(titleData.movies ?? []),
            ...(actorData.movies ?? [])
        ]

        // Poistetaan mahdolliset päällekkäiset elokuvat ID:n perusteella
        const uniqueMovies = [
            ...new Map(combinedMovies.map(movie => [movie.id, movie])).values()
        ]

        setMovies(uniqueMovies)
        setCurrentPage(1)

    } catch (error) { //Virhetilanteessa tulee tyhjä taulukko
        console.error('Elokuvien haku epäonnistui:', error)
  }
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
