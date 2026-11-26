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
             //Sijoitetaan tieto movies tilaan.
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
   
  return (
    <div>
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

        <button onClick={() => 
            console.log('Liittymispyyntö ryhmään:', id)}>
            Liity ryhmään
        </button>

        <button onClick={() => 
            console.log('Poistumispyyntö ryhmään:', id)}>
            Poistu ryhmästä
        </button>

        <button onClick={() => 
            console.log('Lisätään elokuvia ryhmään:', id)}>
            Lisää suosikki elokuvia
        </button>

        <button onClick={() => navigate('/ryhmat')}>
            Takaisin 
        </button>

        </div>

    </div>
  )
}
