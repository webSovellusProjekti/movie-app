import React, { useState } from 'react'

export default function Review() {

    // Voi kirjoittaa input laatikkoon arvostelun
    const [formData, setFormData] = useState({
        review: ""
    });

    // Virheilmoitus
    const [error, setError] = useState();

    // Onnistumisviesti
    const [success, setSuccess] = useState();

    // Tallennetaan syötetty teksti
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Arvostelun julkaisu
    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        // Tarkistetaan, että on kirjoitettu jotain
        if (!formData.review.trim()) {
            setError("Tyhjää arvostelua ei voi julkaista.");
            return;
        }
    };

  return (
    <div className="review-card">
        <h3>Kirjoita arvostelu</h3>

        <form className="review-form" onSubmit={handleSubmit}>
            <input
                type="text"
                name="review"
                value={formData.review}
                onChange={handleChange}
                placeholder="Kirjoita arvostelu..."
            />

            {/* virheilmoitus */}
          {error && (
            <p className="error-message">{error}</p>
          )}

          {/* Onnistumisviesti */}
          {success && (
            <p className="success-message">{success}</p>
          )}

            {/* Julkinen vai yksityinen */}

            <button type="submit">
                Julkaise
            </button>
            
        </form>
    </div>
  )
}
