import { useState, useEffect } from "react";
// Import getMyCards as a named export
import { getMyCards } from "../services/cardsService";

function useMyCards() {
  const [cards, setCards] = useState([]); // Default to an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCards() {
      try {
        // Use the imported getMyCards function directly
        const response = await getMyCards();
        console.log("Fetched cards:", response.data); // Debugging
        setCards(response.data || []); // Ensure `cards` is always an array
      } catch (err) {
        console.error("Error fetching cards:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCards();
  }, []);

  return { cards, loading, error };
}

export default useMyCards;
