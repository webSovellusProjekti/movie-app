import React from 'react'
import {useState} from 'react'
import { api } from '../services/api'

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

  // Lomaketta ollaan lähettämässä
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  const handleSubmit = async (event) => {
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

    // Lähetetään tiedot backendille
    try {
      setIsSubmitting(true);

      await api('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });

      setSuccess("Rekisteröityminen onnistui!");

      // Tyhjennetään lomake onnistumisen jälkeen
      setFormData({
        username: "",
        email: "",
        confirmEmail: "",
        password: "",
        confirmPassword: ""
      });

    } catch (err) {
      setError(err.message || "Rekisteröityminen epäonnistui.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Rekisteröidy</h2>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>

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
              <p className="password-requirements-title">
                Salasanan tulee sisältää vähintään:
              </p>
              <ul>
                  <li className={formData.password.length >= 8 ? "valid" : ""}>
                      8 merkkiä
                  </li>
                  <li className={/[A-Z]/.test(formData.password) ? "valid" : ""}>
                      Yksi iso kirjain (A-Z)
                  </li>
                  <li className={/[a-z]/.test(formData.password) ? "valid" : ""}>
                      Yksi pieni kirjain (a-z)
                  </li>
                  <li className={/[0-9]/.test(formData.password) ? "valid" : ""}>
                      Yksi numero (0-9)
                  </li>
                  <li className={/[^A-Za-z0-9]/.test(formData.password) ? "valid" : ""}>
                      Yksi erikoismerkki (!?@#...)
                  </li>
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

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Rekisteröidään..." : "Valmis"}
          </button>
          
        </form>
      </div>
    </div>

  )
}
