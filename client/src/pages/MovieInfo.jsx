import React from 'react'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react';

const apiKey = import.meta.env.VITE_TMDB_API_KEY;


export default function MovieInfo() {

    //Saadaan id tunniste Url:osoitteesta
    const { id} = useParams();

    //Haetaan tiedot ja tallennetaan tiedot
    const [movie, setMovie] = useState(null);

    //Haetaan näyttelijöiden tiedot
    const [actors, setActors] = useState([]);
    
    useEffect(() => {
        async function fetchMovie(){
            const response = await fetch(
                `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`
            );

            const data= await response.json();

            setMovie(data);

            //Haetaan näyttelijätiedot
            const creditsResponse = await fetch(
                `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`
            );

            const creditsData = await creditsResponse.json();

            setActors(creditsData.cast);
        }
        //Käynnistetään haku, kun sivu latautuu
        fetchMovie();
    }, [id]);

    if (!movie) {
        return <p>Ladataan elokuvan tietoja...</p>;
    }

    
  return (
    <div>
        <h3>{movie.title}</h3>
        <h4>{movie.actors}</h4>

        <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
        />

        <h4>Elokuvan kuvaus</h4>
        <p>{movie.overview}</p>

        <h4>Näyttelijät</h4>

    <div>
        {actors.slice(0, 10).map((actor) => (
            <li key={actor.id}>
                {actor.name} – {actor.character}
            </li>
        ))}
    </div>
    
    </div>
  )
}
