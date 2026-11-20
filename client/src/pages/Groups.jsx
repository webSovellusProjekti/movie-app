import React from 'react'
import { useState, useEffect } from 'react'
import { api } from '../services/api' 

export default function Groups() {

    //Luodaan ryhmät johon ryhmät tallennetaan
    const [groups, setGroups] = useState([])

    //Suoritetaan ensimmäisenä sivun lataamisesta
    useEffect(() => {
        async function fetchGroups() {
            try{
                const data = await api('/groups')
                setGroups(data.groups)
            }
            catch(error){
                console.error('Ryhmien haku epäonnistui:',error)
            }
        }
        fetchGroups()
    }, [])

  return (
    <div>
        <h1>Omat ryhmät</h1>
        {/* Käydään kaikki ryhmät läpi ja näytetään yksi kerrallaan */}
        {groups.map((group) => (
            <div key={group.id}>
            <h2>{group.name}</h2>
            <p>{group.description}</p>
            </div>
        ))}
    </div>
  )
}
