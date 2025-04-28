import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom"; // Import Navigate
import PageHeader from "../components/common/pageHeader";
import BusinessCard from "../components/businessCard";
// Import specific functions and auth context
import { getAllCards, likeUnlikeCard } from "../services/cardsService";
import { useAuth } from "../context/auth.context";

function FavoritesPage() {
  const [favoriteCards, setFavoriteCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // Get current user

  useEffect(() => {
    // Redirect if user is not logged in
    if (!user) {
      setLoading(false);
      return; // Stop execution if not logged in
    }

    async function fetchAndFilterFavorites() {
      try {
        const { data: allCards } = await getAllCards();
        // Filter cards where the likes array includes the current user's ID
        const userFavorites = allCards.filter((card) =>
          card.likes.includes(user._id)
        );
        setFavoriteCards(userFavorites);
      } catch (err) {
        console.error("Error fetching or filtering cards:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchAndFilterFavorites();
  }, [user]); // Rerun effect if user changes

  // This handler might be redundant if relying on the BusinessCard's internal like toggle
  // const handleRemoveFavorite = async (cardId) => {
  //   try {
  //     await likeUnlikeCard(cardId);
  //     setFavoriteCards((prevFavorites) =>
  //       prevFavorites.filter((card) => card._id !== cardId)
  //     );
  //   } catch (err) {
  //     console.error("Error removing favorite:", err);
  //   }
  // };

  // Redirect if user is not logged in
  if (!user && !loading) {
    return <Navigate to="/sign-in" replace />;
  }

  if (loading) return <div>Loading your favorite cards...</div>;
  if (error) return <div>Error loading favorites: {error.message}</div>;

  return (
    <div className="container">
      <PageHeader
        title="Favorites"
        description="Your favorite business cards"
      />

      <div className="row gy-4">
        {" "}
        {/* Added gy-4 for vertical spacing */}
        {favoriteCards.length === 0 ? (
          <div className="col-12">You haven't liked any cards yet.</div>
        ) : (
          favoriteCards.map((card) => (
            // Use the same responsive grid layout
            <div key={card._id} className="col-md-6 col-lg-4">
              <BusinessCard
                card={card}
                // Removed onRemoveFavorite prop, relying on internal toggle
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default FavoritesPage;
