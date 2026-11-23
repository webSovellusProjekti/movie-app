import React from 'react'
import { useState } from 'react'
import { api } from '../services/api' //api-funktion käyttämiseen

export default function NewGroup() {

    //nimeen
    const [name, setName] = useState('')

    //Kuvaukseen
    const [description, setDescription] = useState('')

    //Asetetaan julkiseksi automaattisesti
    const [visibility, setVisibility] = useState('public')

    //Virheilmoitus
    const [error, setError]= useState("");

    //Onnistuminen
    const [success, setSuccess]= useState("");

    const handleGroup = async (event) => {
        event.preventDefault();

        try {
            //Lähetetään pyyntö backendille
            await api ('/groups', {
                method: 'POST', //Luodaan uusi ryhmä
                body: JSON.stringify ({ //Muuttaa ryhmän tiedot json muotoon.
                name: name,
                description: description,
                visibility: visibility,
                })
            });

            setSuccess('Ryhmä luotu onnistuneesti!')
            setError('')
            setName('')
            setDescription('')

        //Tyhjennetään lomake
        } catch (error){
            console.log('Ryhmän luominen epäonnistui', error)
            setError('Ryhmän luominen epäonnistui.')
            setSuccess('')
        }
    };
    
    return (
    <div className = "Greate-container">
        <h3>Uusi ryhmä</h3>

        <form onSubmit={handleGroup}>

        <p>Ryhmän nimi</p>
        <input
            value={name}
            onChange = {(e) => setName(e.target.value)}
        />
        <p>Kuvaus (vapaaehtoinen)</p>
        <input
            type=""
            value={description}
            onChange={(e) => setDescription(e.target.value)}           
        />
        <div className ="visbility-container">
        <p>Valitse</p>

        {/* Painikkeet julkisuudesta */}
        <button type= "button" onClick = {() => setVisibility('public')}>
            Julkinen
        </button>

        <button type= "button" onClick = {() => setVisibility('private')}>
            Yksityinen
        </button>

        </div>

        <button type= "submit">
            Tallenna
        </button>

        {/* käyttäjälle inffo tallentumisesta */}
        {error && <p>{error}</p>}
        {success && <p>{success}</p>}  

        </form>
    </div>
    
  )
}
