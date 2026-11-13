import React from 'react'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react';

const apiKey = import.meta.env.VITE_TMDB_API_KEY;


export default function MovieInfo() {

    //Saadaan id tunniste Url:osoitteesta
    const { id} = useParams();

    //Haetaan tiedot ja tallennetaan tiedot
    const [movie, setMovie] = useState(null);
    
    useEffect(() => {
        async function fetchMovie(){
            const response = await fetch(
                `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`
            );
            
            console.log("TMDB status:", response.status);

            const data= await response.json();

            console.log("TMDB data:", data);
            //Tallennetaan tiedot muuttujaan
            setMovie(data);
        }
        //Käynnistetään haku, kun sivu latautuu
        fetchMovie();
    }, [id]);

    
  return (
    <div>
        <h3>Elokuvien tietoja ladataan...</h3>
        {/* <img src={MovieInfo.poster}
        alt={MovieInfo.title}/>
        <h3>{MovieInfo.title}</h3>
        <p>{MovieInfo.year}</p>
        <p>{MovieInfo.rating}</p> */}
        </div>
  )
}
