import React from 'react'
import { Link } from 'react-router-dom'
import './MovieCard.css'

export default function MovieCard({movie}) {
        //Katsotaan elokuvanm url osite ja jos ei löydy niin arvoksi null
        const posterUrl = movie.poster_path 
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
        : null;

  return (
    //Elokuvakortille oma linkki, josta näkee elokuvan tiedot
    <Link to = {'/movies/${movie.id}'}
        className= "movie-card">
            {posterUrl &&(
                <img src={posterUrl} 
                alt={movie.title}/>
            )}
        <h3>{movie.title}</h3>
        <p>{movie.release_date?.slice(0,4)}</p>
    </Link>
);
};
