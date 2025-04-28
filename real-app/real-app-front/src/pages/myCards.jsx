import { Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react"; // Import useEffect
import { toast } from "react-toastify"; // Import toast
import useMyCards from "../hooks/useMyCards";
import PageHeader from "../components/common/pageHeader";
import BusinessCard from "../components/businessCard";
import { useAuth } from "../context/auth.context"; // Import useAuth

function MyCards() {
  const [input, setInput] = useState("");
  // Assuming useMyCards returns refetch, adjust if needed
  const { cards, loading, error, refetch } = useMyCards();
  const { user } = useAuth(); // Get user info

  // Show toast on error
  useEffect(() => {
    if (error) {
      toast.error(
        `Error loading your cards: ${error.message || "Unknown error"}`
      );
      // Optionally clear the error after showing toast if the hook doesn't do it
    }
  }, [error]); // Run only when error changes

  // Redirect if user is not logged in or not a business user
  if (!user || !user.isBusiness) {
    // You might want to redirect to home or sign-in, or show an access denied message
    return <Navigate to="/sign-in" replace />;
  }

  if (loading) {
    return <div>Loading your cards...</div>;
  }

  // Don't render the error message directly if toast is handling it
  // if (error) {
  //   return <div>Error loading your cards: {error.message}</div>;
  // }

  const filteredCards =
    cards?.filter(
      // Add optional chaining for cards
      (card) =>
        card.title?.toLowerCase().includes(input.toLowerCase()) ||
        card.subtitle?.toLowerCase().includes(input.toLowerCase())
    ) || []; // Default to empty array if cards is null/undefined

  return (
    <div className="container">
      <PageHeader title="My Cards" description="Manage your business cards" />

      <div className="row my-3 align-items-center">
        <div className="col-md-8 col-lg-9 mb-2 mb-md-0">
          {" "}
          {/* Adjust column width */}
          <input
            type="text"
            className="form-control"
            placeholder="Search your cards by title or subtitle..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div className="col-md-4 col-lg-3 text-md-end">
          {" "}
          {/* Adjust column width and alignment */}
          <Link to="/create-card" className="btn btn-primary w-100">
            {" "}
            {/* Make button full width on small screens */}+ Create New Card
          </Link>
        </div>
      </div>

      <div className="row gy-4">
        {" "}
        {/* Added gy-4 for vertical spacing */}
        {/* Display error message if loading failed and no cards are available */}
        {error && !loading && (!cards || cards.length === 0) && (
          <div className="col-12 text-danger">
            Failed to load cards. Please try again later.
          </div>
        )}
        {/* Handle loading finished but no cards */}
        {!loading && !error && filteredCards.length === 0 && (
          <div className="col-12">
            {cards?.length === 0 // Check original cards length
              ? "You haven't created any cards yet."
              : "No cards match your search."}
          </div>
        )}
        {/* Render cards if available */}
        {!loading &&
          filteredCards.length > 0 &&
          filteredCards.map((card) => (
            // Use the same responsive grid layout as Home
            <div key={card._id} className="col-md-6 col-lg-4">
              {/* Pass refetch or similar function if card deletion/update needs to trigger reload */}
              <BusinessCard card={card} />
            </div>
          ))}
      </div>
    </div>
  );
}

export default MyCards;
