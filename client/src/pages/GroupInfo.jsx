import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function GroupInfo() {
    
    const { id } = useParams();

    const [groups, setGroups] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
 
        async function GroupsInfo(){
            try {
             //Kutsutaan api-funktiota ja pyydetään tietoja backendiltä
             const data = await api(`/groups/${id}`);
             //Sijoitetaan tieto group tilaan.
             setGroups(data.group);
        
            } catch (error) {
                console.error('Ryhmän tietojen haku epäonnistui:', error);
            }
        }
         //Käynnistetään haku, kun sivu latautuu
        GroupsInfo();
 
    }, [id]);

    if (!groups) {
        return <p>Ladataan ryhmän tietoja...</p>;
    }

    // Ryhmään liittyminen
    const JoinGroup = async () => {
        try {
            await api(`/groups/${id}/join`, {
            method: 'POST'
            });

            // Päivitetään ryhmän tiedot
            const data = await api(`/groups/${id}`);
            setGroups(data.group);

        } catch (error) {
        console.error('Ryhmään liittyminen epäonnistui:', error);
        alert(error.message);
        }
    };

    // Ryhmästä poistuminen
    const LeaveGroup = async () => {
        try {
            await api(`/groups/${id}/leave`, {
            method: 'DELETE'
            });

        // Palataan ryhmien listaukseen
        navigate('/ryhmat');

        } catch (error) {
        console.error('Ryhmän poistuminen epäonnistui:', error);
        alert(error.message);
        }
    };
   
  return (
    <div>
        <div className="group-page">

        <div className= "group-container">
        <h3>{groups.name}</h3>
        <p>
            {/* Näytetään julkisuus ja jäsenet */}
            {groups.visibility === 'public' ? 'Julkinen ryhmä' : 'Yksityinen ryhmä'}
            {' · '}
            {groups.member_count} jäsentä
        </p>
        <label>Kuvaus</label>
        <p>{groups.description}</p>

        <button onClick={JoinGroup}>
            Liity ryhmään
        </button>

        <button onClick={LeaveGroup}>
            Poistu ryhmästä
        </button>

        <button onClick={() => navigate('/ryhmat')}>
            Takaisin 
        </button>

        </div>

        <div>
        <div className= "list-container">
            <h3>Suosikkilista</h3>
            
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

        </div>
        </div>
        </div>   

    </div>
  )
}
