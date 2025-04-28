import { useState, useEffect } from "react";
import PageHeader from "../components/common/pageHeader";
import BusinessCard from "../components/businessCard";
import { getAllCards } from "../services/cardsService";

function Home() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  useEffect(() => {
    async function fetchCards() {
      try {
        const response = await getAllCards();
        setCards(response.data || []);
      } catch (err) {
        console.error("Error fetching cards:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCards();
  }, []);

  // Filter cards based on search query
  const filteredCards = cards.filter(
    (card) =>
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading cards: {error.message}</div>;
  }

  return (
    <div className="container">
      <PageHeader
        title="Business Directory"
        description="Welcome! Find and connect with businesses."
      />

      {/* Search Input */}
      <div className="row mb-4">
        <div className="col-md-8 offset-md-2">
          {" "}
          {/* Center the search bar */}
          <input
            type="text"
            className="form-control"
            placeholder="Search businesses by title, subtitle, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Conditionally render subheading or 'no results' message */}
      {filteredCards.length > 0 && (
        <h2 className="text-center my-4">Featured Businesses</h2>
      )}

      <div className="row gy-4">
        {filteredCards.length === 0 ? (
          <div className="col text-center">
            {searchQuery
              ? "No business cards match your search."
              : "No business cards found."}
          </div>
        ) : (
          filteredCards.map((card) => (
            <div key={card._id} className="col-md-6 col-lg-4">
              <BusinessCard card={card} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
