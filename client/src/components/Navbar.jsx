import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'
import './Navbar.css'

//Navigointipalkki sivun yläreunassa
export default function Navbar() {

  // Haetaan käyttäjän kirjautumistila ja uloskirjautumistoiminto
  const {user, logout, deleteAccount} = useAuth();

  // Hallitaan dropdown-valikon näkyvyyttä
  const [menuOpen, setMenuOpen] = useState(false);

  // Käyttäjän uloskirjautuminen
  const handleLogout = async () => {
    try {
      await logout();
      setMenuOpen(false);
    } catch (err) {
      console.error('Uloskirjautuminen epäonnistui', err);
    }
  };


  // Käyttäjätilin poistaminen vahvistuksen jälkeen
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Haluatko varmasti poistaa tämän käyttäjätilin?'
    );

    if (!confirmed) return;

    try {
      await deleteAccount();
      setMenuOpen(false);
      window.location.href = '/';
    } catch (err) {
      console.error('Käyttäjätilin poistaminen epäonnistui:', err);
      alert('Käyttäjätilin poistaminen epäonnistui. Yritä uudelleen.');
    }
  };


  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        
        {/* Linkki etusivulle, aina näkyvissä */}
        <Link className="nav-link" to="/">
          Elokuvat
        </Link>

        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent" 
          aria-controls="navbarSupportedContent"
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav navbar-auth mb-2 mb-lg-0">

            {user ? (
              <>
              {/* Näytetään kirjautuneelle käyttäjälle */}
              <li className="nav-item">
                <Link className="nav-link" to ="/ryhmat">
                Omat ryhmät
                </Link>
              </li>
              
              <li className = "nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle"
                  type="button"
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-expanded={menuOpen}
                >
                  Oma tili
                </button>

                {menuOpen && (
                  <ul className = "dropdown-menu show">

                    {/* Jos halutaan ryhmät näkyviin sivulle palkkiin 
                    <li>
                      <Link
                        className ="dropdown-item"
                        to="/groups"
                        onClick={() =>setMenuOpen(false)}
                      >
                      Omat ryhmät
                      </Link>
                    </li> */}

                    <li>
                      <button
                        className="dropdown-item"
                        onClick={handleLogout}
                      >
                        Kirjaudu ulos
                      </button>
                    </li>

                    <li>
                      <button
                        className = "dropdown-item text-danger"
                        onClick={handleDeleteAccount}
                      >
                        Poista käyttäjätili
                      </button>
                    </li>

                  </ul>
                )}

              </li>
              </>
            ) : (
              // Näytetään kirjautumattomalle käyttäjälle
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/Kirjautuminen">
                    Kirjaudu
                  </Link>
                </li>
              </>
            )}

          </ul>
        </div>
      </div>
    </nav>
  )
}
