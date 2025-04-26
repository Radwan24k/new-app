import { useState, useEffect } from "react";
import PageHeader from "../components/common/pageHeader";
import BusinessCard from "../components/businessCard";
import cardsService from "../services/cardsService";

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const response = await cardsService.getFavorites();
        setFavorites(response.data || []);
      } catch (err) {
        console.error("Error fetching favorites:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (cardId) => {
    try {
      await cardsService.toggleFavorite(cardId);
      setFavorites((prevFavorites) =>
        prevFavorites.filter((card) => card._id !== cardId)
      );
    } catch (err) {
      console.error("Error removing favorite:", err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading favorites: {error.message}</div>;

  return (
    <div className="container">
      <PageHeader
        title="Favorites"
        description="Your favorite business cards"
      />

      <div className="row">
        {favorites.length === 0 ? (
          <div className="col">No favorite cards</div>
        ) : (
          favorites.map((card) => (
            <BusinessCard
              key={card._id}
              card={card}
              showActions={false}
              onRemoveFavorite={() => handleRemoveFavorite(card._id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default FavoritesPage;
