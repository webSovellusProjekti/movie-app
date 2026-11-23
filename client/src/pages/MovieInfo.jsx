import React from 'react'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { api } from '../services/api'; //api-funktion käyttämiseen


export default function MovieInfo() {

    //Saadaan id tunniste Url:osoitteesta
    const { id} = useParams();

    //Haetaan tiedot ja tallennetaan tiedot
    const [movie, setMovie] = useState(null);

    //Haetaan näyttelijöiden tiedot
    const [actors, setActors] = useState([]);
    
    useEffect(() => {

        async function fetchMovie(){
            //Kutsutaan api-funktiota ja pyydetään tietoja
            const data = await api(`/movies/${id}`);
            //Sijoitetaan tieto movies tilaan.
            setMovie(data.movie);

            //tallennetaan tietoihin elokuvan henkilötiedot ja näyttelijät ja jos ei löydy niin tyhjä taulukko
            setActors(data.movie.credits.cast ?? []);
        }
        //Käynnistetään haku, kun sivu latautuu
        fetchMovie();

    }, [id]);

    //Jos funktio toimi niin tulee seuraava teksti
    if (!movie) {
        return <p>Ladataan elokuvan tietoja...</p>;
    }

    
  return (
    <div>
        <h3>{movie.title}</h3>

        <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
        />

        <h4>Elokuvan kuvaus</h4>
        <p>{movie.overview}</p>

    <div>
        
        {/* Julkaisuvuosi */}
        <p>{movie.release_date?.substring(0, 4)}</p>
    </div>

    <div>
        <h4>Näyttelijät</h4>
        <h4>{movie.actors}</h4>
        {/* Otetaan näyttelijät 1-10 ja laitetaan mappiin */}
        {actors.slice(0, 10).map((actor) => ( 
            // Asetetaan jokaiselle riville yksi näyttelijä
            <li key={actor.id}>
                {/* Näytetään näyttelijän nimi ja hänen esittämänsä hahmo */}
                {actor.name} – {actor.character} 
            </li>
        ))}
    </div>
    
    </div>
  )
}
