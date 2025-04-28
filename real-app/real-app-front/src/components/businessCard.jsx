import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";
// Import icons
import { FaHeart, FaPhone, FaEdit, FaTrash } from "react-icons/fa";
// Import the like/unlike function
import { likeUnlikeCard, deleteCardById } from "../services/cardsService";
import { useState, useEffect } from "react";

function BusinessCard({ card }) {
  const { user } = useAuth(); // Get current user info (_id, isBusiness, isAdmin)
  const navigate = useNavigate();

  // State to track if the current user likes this card
  const [isLiked, setIsLiked] = useState(false);

  // Check initial like status when component mounts or user/card changes
  useEffect(() => {
    if (user && card.likes.includes(user._id)) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  }, [user, card.likes]);

  const handleLikeToggle = async (e) => {
    e.stopPropagation(); // Prevent card click navigation
    if (!user) {
      // Optional: Redirect to login or show message if not logged in
      console.log("User must be logged in to like cards.");
      return;
    }
    try {
      await likeUnlikeCard(card._id);
      setIsLiked(!isLiked); // Toggle local state immediately
      // Optionally: could refetch card data or update a global state if needed elsewhere
    } catch (err) {
      console.error("Error toggling like:", err);
      // Revert state if API call fails
      setIsLiked(isLiked);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation(); // Prevent card click navigation
    // Add confirmation dialog
    if (
      window.confirm(`Are you sure you want to delete card \"${card.title}\"?`)
    ) {
      try {
        await deleteCardById(card._id);
        // Ideally, notify parent component to remove card from list
        // For now, we can just navigate away or refresh
        window.location.reload(); // Simple refresh for now
      } catch (err) {
        console.error("Error deleting card:", err);
        // Handle error display
      }
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation(); // Prevent card click navigation
    navigate(`/edit-card/${card._id}`);
  };

  const handleCardClick = () => {
    // Navigate to the business details page
    navigate(`/business-details/${card._id}`); // Assuming this route exists
  };

  // Determine if the current user can edit/delete this card
  const canEditDelete = user && (user.isAdmin || user._id === card.user_id);

  return (
    // Removed column classes, parent component (Home.jsx) now handles grid layout
    <div
      className="card h-100"
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      {" "}
      {/* Added h-100 for equal height */}
      <img
        src={card.image?.url || "https://via.placeholder.com/300x200"} // Default image
        className="card-img-top"
        alt={card.image?.alt || card.title} // Use title as fallback alt
        style={{ height: "200px", objectFit: "cover" }} // Fixed image height
      />
      <div className="card-body d-flex flex-column">
        {" "}
        {/* Flex column for footer alignment */}
        <h5 className="card-title">{card.title}</h5>
        <p className="card-text">{card.subtitle}</p>
        <hr />
        <p className="card-text mb-1">
          <strong>Phone:</strong> {card.phone}
        </p>
        <p className="card-text mb-1">
          <strong>Address:</strong>{" "}
          {`${card.address.street} ${card.address.houseNumber}, ${card.address.city}`}
        </p>
        <p className="card-text">
          <strong>Card Number:</strong> {card.bizNumber}
        </p>
        {/* Action icons in the footer */}
        <div className="mt-auto d-flex justify-content-between align-items-center border-top pt-2">
          {" "}
          {/* mt-auto pushes to bottom */}
          <div>
            {canEditDelete && (
              <>
                <button
                  onClick={handleDelete}
                  className="btn btn-light btn-sm me-1 p-1"
                >
                  <FaTrash title="Delete Card" />
                </button>
                <button
                  onClick={handleEdit}
                  className="btn btn-light btn-sm me-1 p-1"
                >
                  <FaEdit title="Edit Card" />
                </button>
              </>
            )}
            {/* Phone icon - could be a link */}
            <a
              href={`tel:${card.phone}`}
              onClick={(e) => e.stopPropagation()}
              className="btn btn-light btn-sm p-1"
            >
              <FaPhone title="Call Business" />
            </a>
          </div>
          <div>
            {/* Like icon */}
            {user && ( // Only show like button if user is logged in
              <button
                onClick={handleLikeToggle}
                className="btn btn-light btn-sm p-1"
              >
                <FaHeart
                  color={isLiked ? "red" : "grey"}
                  title={isLiked ? "Unlike Card" : "Like Card"}
                />
                {/* Optionally display like count: card.likes.length */}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusinessCard;
