import React from 'react'

import "./App.css";
export default function Login({handleBenutzername, handlePasswort, handleRegistrierung, handleAnmeldung}) {
  return (
    <div className="popup-login">
      <input type="text" className="textfeld" placeholder="E-Mail-Adresse" onChange={(e)=> handleBenutzername(e)}/>
      <input type="text" className="textfeld" placeholder="Passwort" onChange={(e)=> handlePasswort(e)}/>
      <button className="anmeldung-registrierung" onClick= {handleAnmeldung}> Anmelden</button>
      <button className="anmeldung-registrierung" onClick= {handleRegistrierung}>Registrieren</button>
    </div>
  )
}

