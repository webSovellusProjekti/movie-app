import React from 'react'
import {useState, useEffect} from 'react'
import MovieCard from '../components/MovieCard'

export default function Home() {
  //Tuodaan elokuvien tiedot, yksi kerrallaan
  const [searchTerm, setSearchTerm] = useState('')

  //Tyhjä hakurivi
  const [movies, setMovies] = useState([])

  //Haetaan apikey kautta elokuvia TMDB:stä
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  //Haetaan elokuvien tiedot TMDB:stä
  async function fetchMovies() {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`
    );
    //Lähetetään tiedot json-muodossa
    const data = await response.json();
    //Muutetaan tiedot olioiksi
    setMovies(data.results);
  }

  async function searchMovies() {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchTerm}`
    );
    const data = await response.json();
    setMovies(data.results);
  }
  //Katsotaan elokuvien lisätiedot

  // const[showMovies,setShowMovies] = useState(false)
  async function showMovies(){
    if(showMovies===false){
      setShowMovies(true)
    }
    else {
      setShowMovies(false)
    }
  }
  <button onClick={showMovies}>Näytä lisätiedot</button>


  //Tallennetaan tiedot movies tilaan
  useEffect(() => {
    fetchMovies();
    }, []); 


  return (
    <div className="search-container">
      <h2>Elokuvat</h2>
      <h5>Voit hakea elokuvia nimellä, näyttelijällä tai ohjaajalla</h5>

      <input
        type="text"
        name="search"
        placeholder="Hae elokuvia"

        // Tallennetaan hakusana searchTerm tilaan
        onChange={(e) => setSearchTerm(e.target.value)}/> 

        <button onClick={searchMovies}>Hae</button>
        {/* <button onClick={showMovies}>Näytä lisätiedot</button> */}

        <div className="movies-container">
        
          {/* Haetaan elokuvien tiedot */}  
          {movies.map((movie) => (  
            <MovieCard key={movie.id} 
            movie={movie} />
          ))}

        </div>

    </div>

  )
}
