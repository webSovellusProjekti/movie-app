import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'

export default function LogIn() {

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  // Virheilmoitus
  const [error, setError] = useState("");

  // Onnistumisviesti
  const [success, setSuccess] = useState("");

  // Salasanan näkyvyys
  const [showPassword, setShowPassword] = useState(false);

  // Tallennetaan syötetyt tiedot
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Lomakkeen lähetys
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // Tarkistetaan, että kentät on täytetty
    if (!formData.username.trim() || !formData.password.trim()) {
      setError("Täytä kaikki kentät.");
      return;
    }

    try {
      // Lähetetään kirjautumistiedot backendille
      await login(formData.username, formData.password);

      setSuccess("Kirjautuminen onnistui!");
    } catch (err) {
      setError(err.message || "Kirjautuminen epäonnistui.");
  }
};

  return (
    <div className="register-container">

      <h2>Kirjaudu sisään</h2>

      <form onSubmit={handleSubmit}>
        <label>Käyttäjänimi</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Käyttäjänimi"
        />

        <label>Salasana</label>
        <div className="password-input-container">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Salasana"
          />

          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Piilota" : "Näytä"}
          </button>
        </div>

        {/* virheilmoitus */}
        {error && (
          <p className="error-message">{error}</p>
        )}

        {/* Onnistumisviesti */}
        {success && (
          <p className="success-message">{success}</p>
        )}

        <button type="submit">
          Kirjaudu
        </button>

        <p>
          Eikö sinulla ole vielä käyttäjätiliä? {' '}
          <Link to="/rekisterointi">
            Rekisteröidy tästä
          </Link>
        </p>

      </form>

    </div>
  )
}
