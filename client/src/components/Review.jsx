import React, { useState } from 'react'
import { api } from '../services/api'

export default function Review({ movieId }) {

    // Voi kirjoittaa input laatikkoon arvostelun
    const [formData, setFormData] = useState({
        review: ""
    });

    // Virheilmoitus
    const [error, setError] = useState();

    // Onnistumisviesti
    const [success, setSuccess] = useState();

    // Tallennuksen tila
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Tallennetaan syötetty teksti
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value
        });

        setError("");
        setSuccess("");
    };

    // Tarkistetaan arvostelun sisältö
    const validateReview = (review) => {

        // Tyhjä arvostelu
        if (!review.trim()) {
            return "Tyhjää arvostelua ei voi julkaista.";
        }

        if (review.length > 5000) {
            return "Arvostelu voi sisältää enintään 5000 merkkiä."
        }

        // HTML-tagit ja mahdolliset koodimerkinnät
        if (/<[^>]*>/.test(review)) {
            return "Arvostelu ei voi sisältää HTML-tageja tai koodimerkintöjä.";
        }

        // URL-osoitteet
        const urlPattern = /(https?:\/\/|www\.)/i;

        if (urlPattern.test(review)) {
            return "Arvostelu ei voi sisältää linkkejä."
        }

        return null;
    }

    // Arvostelun julkaisu
    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        const validateError = validateReview(formData.review);

        if (validateError) {
            setError(validateError);
            return;
        }

        // Elokuvan ID tarkistetaan ennen lähettämistä
        if (!movieId) {
            setError("Elokuvan tietoja ei löytynyt.");
            return;
        }

        // Backend yhteys
        try {
            setIsSubmitting(true);

            // Lähetetään arvostelu backendille
            await api(`/movies/${movieId}/reviews`,{
                method: 'POST',
                body: JSON.stringify({
                    review: formData.review.trim()
                })
            });

            // Tyhjennetään tekstikenttä onnistuneen julkaisun jälkeen
            setFormData({
                review: ""
            });

            setSuccess("Arvostelu julkaistiin onnistuneesti");
        } catch (err) {
            setError(err.message || "Arvostelun julkaiseminen epäonnistui.");

        } finally {
            setIsSubmitting(false);
        }
    };

    // Estetään kuvien liittäminen tekstikenttään
    const handlePaste = (event) => {
        const clipboardItems = event.clipboardData.items;

        for (const item of clipboardItems) {
            if (item.type.startsWith("image/")) {
                event.preventDefault();
                setError("Kuvien liittäminen arvosteluun ei ole sallittua.");
                return;
            }
        }
    }

  return (
    <div className="review-card">
        <h3>Kirjoita arvostelu</h3>

        <form className="review-form" onSubmit={handleSubmit}>
            <textarea
                name="review"
                value={formData.review}
                onChange={handleChange}
                onPaste={handlePaste}
                placeholder="Kirjoita arvostelu..."
                rows={5}
                maxLength={5000}
                disabled={isSubmitting}
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

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Julkaistaan..." : "Julkaise"}
            </button>
        </form>
    </div>
  )
}
