// import PageHeader from "../components/common/pageHeader";

// function Home() {
//   return (
//     <div className="container">
//       <PageHeader title="Home" description="The only business card you need" />
//     </div>
//   );
// }

// export default Home;

import { useState, useEffect } from "react";
import PageHeader from "../components/common/pageHeader";
import BusinessCard from "../components/businessCard";
import cardsService from "../services/cardsService";

function Home() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCards() {
      try {
        const response = await cardsService.getAll(); // Fetch all cards
        setCards(response.data || []); // Ensure cards is always an array
      } catch (err) {
        console.error("Error fetching cards:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCards();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading cards: {error.message}</div>;
  }

  return (
    <div className="container">
      <PageHeader
        title="Home"
        description="Browse all business cards created by our users"
      />

      <div className="row">
        {cards.length === 0 ? (
          <div className="col">No cards available</div>
        ) : (
          cards.map((card) => (
            <BusinessCard key={card._id} card={card} showActions={false} />
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
