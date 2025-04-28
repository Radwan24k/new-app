// src/pages/businessDetails.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getCardById } from "../services/cardsService";
import PageHeader from "../components/common/pageHeader";
import { FaPhone, FaEnvelope, FaGlobe } from "react-icons/fa"; // Icons

function BusinessDetailsPage() {
  const { id: cardId } = useParams();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCardDetails() {
      try {
        const { data } = await getCardById(cardId);
        setCard(data);
      } catch (err) {
        console.error("Error fetching card details:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCardDetails();
  }, [cardId]);

  if (loading) return <div>Loading business details...</div>;
  if (error)
    return (
      <div>Error loading details: {error.response?.data || error.message}</div>
    );
  if (!card) return <div>Business card not found.</div>;

  // Construct address string
  const addressString = `${card.address.street} ${card.address.houseNumber}, ${card.address.city}, ${card.address.country} ${card.address.zip}`;
  // Google Maps URL (simple version)
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    addressString
  )}&output=embed`;

  return (
    <div className="container">
      <PageHeader title={card.title} description={card.subtitle} />

      <div className="row">
        {/* Left Column: Image and Map */}
        <div className="col-md-6 mb-3 mb-md-0">
          <img
            src={card.image?.url || "https://via.placeholder.com/600x400"}
            alt={card.image?.alt || card.title}
            className="img-fluid rounded mb-3"
            style={{ maxHeight: "400px", width: "100%", objectFit: "cover" }}
          />
          {/* Simple Embedded Map */}
          <h5>Location</h5>
          <div
            className="map-container"
            style={{ height: "300px", width: "100%" }}
          >
            <iframe
              title="Business Location"
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src={mapUrl}
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="col-md-6">
          <h4>{card.title}</h4>
          <p className="lead">{card.subtitle}</p>
          <hr />
          <h5>Description</h5>
          <p>{card.description}</p>
          <hr />
          <h5>Contact Details</h5>
          <p>
            <FaPhone className="me-2" />
            <a href={`tel:${card.phone}`}>{card.phone}</a>
          </p>
          <p>
            <FaEnvelope className="me-2" />
            <a href={`mailto:${card.email}`}>{card.email}</a>
          </p>
          {card.web && (
            <p>
              <FaGlobe className="me-2" />
              <a
                href={
                  card.web.startsWith("http") ? card.web : `http://${card.web}`
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                {card.web}
              </a>
            </p>
          )}
          <hr />
          <h5>Address</h5>
          <p>{addressString}</p>
          <p>
            <strong>Card Number:</strong> {card.bizNumber}
          </p>
          <hr />
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default BusinessDetailsPage;
