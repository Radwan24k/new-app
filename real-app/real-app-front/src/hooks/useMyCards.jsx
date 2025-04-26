// import { useState, useEffect } from "react";

// import cardsService from "../services/cardsService";

// function useMyCards() {
//   const [cards, setCards] = useState([]);

//   useEffect(() => {
//     async function getCards() {
//       const cards = await cardsService.getAll();
//       setCards(cards.data);
//     }

//     getCards();
//   }, []);

//   return cards;
// }

// export default useMyCards;

import { useState, useEffect } from "react";
import cardsService from "../services/cardsService";

function useMyCards() {
  const [cards, setCards] = useState([]); // Default to an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCards() {
      try {
        const response = await cardsService.getMyCards();
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
