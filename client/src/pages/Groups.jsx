import React from 'react'
import { useState, useEffect } from 'react'
import { api } from '../services/api' 
import NewGroup from '../components/NewGroup'

export default function Groups() {

    //Haetaan ryhmät tietokannasta
    const [groups, setGroups] = useState([])

    //Haetaan tietoja
    const [searchTerm, setSearchTerm] = useState('');

        // Näytettävät ryhmät
    const [filteredGroups, setFilteredGroups] = useState([])

    //Suoritetaan ensimmäisenä sivun lataamisesta
    async function fetchGroups() {
            try{
                const data = await api('/groups')
                setGroups(data.groups)
                setFilteredGroups(data.groups)
            }
            catch(error){
                console.error('Ryhmien haku epäonnistui:',error)
            }
        }
    // Haetaan ryhmät sivun latautuessa
    useEffect(() => {
        fetchGroups()
    }, [])
    
    // Suodatetaan ryhmät hakusanan perusteella
    function handleSearch(event) {
        event.preventDefault()

        const results = groups.filter((group) =>
            group.name.toLowerCase().includes(searchTerm.toLowerCase())
        )

        setFilteredGroups(results)
    }

  return (
    <div>
        
        <div className = "groups-container">
        <h1>Ryhmät</h1>
        
            {/* enter painikkeen toimivuus */}
            <form onSubmit={(e) => {
                e.preventDefault();
                handleSearch(e);
            }}>
                <input
                    type="text"
                    name="search"
                    placeholder="Hae ryhmiä"

                    value={searchTerm}
                    // Tallennetaan hakusana searchTerm tilaan
                    onChange={(e) => setSearchTerm(e.target.value)}/> 

                    <button type="submit">Hae</button>
            </form>

        </div>
            
            <div className = "searchGroups-container">
            {/* Käydään kaikki ryhmät läpi ja näytetään yksi kerrallaan */}
                {filteredGroups.map((group) => (
                    <div key={group.id}>
                    <h4>{group.name}</h4>
                    <p>{group.description}</p>
                    </div>
                ))}
            </div>

        {/* Ohjautuu NewGroup komponenttiin */}
        <NewGroup/>

    </div>
  )
}
