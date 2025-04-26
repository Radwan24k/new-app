// import { Link } from "react-router";
// import { useState } from "react";
// import useMyCards from "../hooks/useMyCards";
// import PageHeader from "../components/common/pageHeader";
// import BusinessCard from "../components/businessCard";
// import { useAuth } from "../context/auth.context";
// import { Navigate } from "react-router";

// function MyCards() {
//   const [input, setInput] = useState("");

//   const cards = useMyCards();

//   const { user } = useAuth();

//   return (
//     <div className="container">
//       <PageHeader title="My Cards" />

//       <div className="row my-3">
//         <div className="col">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Search..."
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//           />
//         </div>
//       </div>

//       <div className="row">
//         <div className="col">
//           <Link to="/create-card">Create a New Card</Link>
//         </div>
//       </div>

{
  /* <div className="row">
        {!cards.length ? (
          <div className="col">no cards</div>
        ) : (
          cards
            .filter((card) =>
              card.bizName.toLowerCase().includes(input.toLowerCase())
            )
            .map((card) => {
              return <BusinessCard key={card._id} card={card} />;
            })
        )}
      </div> */
}

//       <div className="row">
//         {!cards.length ? (
//           <div className="col">No cards</div>
//         ) : (
//           cards
//             .filter(
//               (card) =>
//                 card.bizName?.toLowerCase().includes(input.toLowerCase()) // Use optional chaining
//             )
//             .map((card) => {
//               return <BusinessCard key={card._id} card={card} />;
//             })
//         )}
//       </div>
//     </div>
//   );
// }

// export default MyCards;

import { Link } from "react-router-dom";
import { useState } from "react";
import useMyCards from "../hooks/useMyCards";
import PageHeader from "../components/common/pageHeader";
import BusinessCard from "../components/businessCard";

function MyCards() {
  const [input, setInput] = useState("");
  const { cards, loading, error } = useMyCards();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading cards: {error.message}</div>;
  }

  return (
    <div className="container">
      <PageHeader title="My Cards" description="Your business cards" />

      <div className="row my-3">
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
      </div>

      <div className="row">
        <div className="col">
          <Link to="/create-card">Create a New Card</Link>
        </div>
      </div>

      <div className="row">
        {cards.length === 0 ? (
          <div className="col">No cards</div>
        ) : (
          cards
            .filter(
              (card) =>
                card.title?.toLowerCase().includes(input.toLowerCase()) ||
                card.subtitle?.toLowerCase().includes(input.toLowerCase())
            )
            .map((card) => {
              return <BusinessCard key={card._id} card={card} />;
            })
        )}
      </div>
    </div>
  );
}

export default MyCards;
