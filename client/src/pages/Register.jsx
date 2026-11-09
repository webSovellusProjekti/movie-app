import React from 'react'
import {useState} from 'react'

export default function Register() {

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: ""
  });

  // Virheilmoitus
  const [error, setError] = useState("");

  // Onnistuminen
  const [success, setSuccess] = useState("");

  // Salasanojen näkyvyys
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Salasanan tarkistus
  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    return passwordRegex.test(password);
  };

  // Tallennetaan syötetyt tiedot
  const handleChange = (event) => {
    const {name, value} = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Lomakkeen lähetys
  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // Onko kaikki kentät täytetty?
    if (Object.values(formData).some(value => value.trim() === "")) {
      setError("Täytä kaikki kentät.");
      return;
    }

    // Tarkistetaan sähköpostin muoto
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Tarkista sähköpostiosoitteen muoto.");
      return;
    }

    // Tarkistetaan sähköpostien vastaavuus
    if (formData.email !== formData.confirmEmail) {
      setError("Sähköpostiosoitteet eivät täsmää.");
      return;
    }

    // Tarkistetaan salasanan vaatimukset
    if (!validatePassword(formData.password)) {
      setError("Salasana ei täytä kaikkia vaatimuksia");
      return;
    }

    // Tarkistetaan salasanojen vastaavuus
    if (formData.password !== formData.confirmPassword) {
      setError("Salasanat eivät täsmää.");
      return;
    }

    // Testi tarkistus
    setSuccess("Lomakkeen kaikki tiedot ovat kunnossa!")
    console.log("Registeration data:", formData);
  }

  return (
    <div className="register-container">
      <h2>Rekisteröidy</h2>

      <form onSubmit={handleSubmit}>

        <label>Käyttäjänimi</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Käyttäjänimi"
        />

        <label>Sähköposti</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Sähköpostiosoite"
        />

        <label>Kirjoita sähköposti uudelleen</label>
        <input
          type="email"
          name="confirmEmail"
          value={formData.confirmEmail}
          onChange={handleChange}
          placeholder="Sähköpostiosoite uudelleen"
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

        <label>Kirjoita salasana uudelleen</label>
        <div className="password-input-container">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Salasana uudelleen"
          />

          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? "Piilota" : "Näytä"}
          </button>
        </div>

        <div className="password-requirements">
          <p>Salasanan tulee sisältää:</p>
          <ul>
            <li>Vähintään 8 merkkiä</li>
            <li>Vähintään yksi iso kirjain (A-Z)</li>
            <li>Vähintään yksi pieni kirjain (a-z)</li>
            <li>Vähintään yksi numero (0-9)</li>
            <li>Vähintään yksi erikoismerkki (!?@#...)</li>
          </ul>
        </div>

        {/* Virheilmoitus */}
        {error && (
          <p className="error-message">{error}</p>
        )}

        {/* Onnistumisviesti */}
        {success && (
          <p className="success-message">{success}</p>
        )}

        <button type="submit">
          Valmis
        </button>
        
      </form>
    </div>

  )
}
