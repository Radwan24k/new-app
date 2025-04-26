// import { Link } from "react-router";

// function BusinessCard({
//   card: { _id, bizName, bizDescription, bizAddress, bizPhone, bizImage },
// }) {
//   return (
//     <div className="col col-sm-6 col-md-4 col-xl-3 my-2">
//       <div className="card">
//         <img src={bizImage} className="card-img-top" alt={bizName} />
//         <div className="card-body">
//           <h5 className="card-title">{bizName}</h5>
//           <p className="card-text">{bizDescription}</p>

//           <ul className="list-group list-group-flush">
//             <li className="list-group-item">{bizAddress}</li>
//             <li className="list-group-item">{bizPhone}</li>
//           </ul>

//           <Link to={`/my-cards/edit/${_id}`}>Edit</Link>
//           <Link className="mx-3" to={`/my-cards/delete/${_id}`}>
//             Delete
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { Link } from "react-router";
import cardsService from "../services/cardsService";

function BusinessCard({
  card: { _id, title, subtitle, description, phone, image, address },
  showActions = true,
  onRemoveFavorite,
}) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleToggleFavorite = async () => {
    try {
      await cardsService.toggleFavorite(_id);
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  return (
    <div className="col col-sm-6 col-md-4 col-xl-3 my-2">
      <div className="card">
        <img src={image.url} className="card-img-top" alt={image.alt} />
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{subtitle}</p>
          <p className="card-text">{description}</p>

          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              {address.city}, {address.street}
            </li>
            <li className="list-group-item">{phone}</li>
          </ul>

          <div className="mt-2">
            <button
              className={`btn btn-sm ${
                isFavorite ? "btn-danger" : "btn-outline-danger"
              }`}
              onClick={handleToggleFavorite}
            >
              {isFavorite ? "Unfavorite" : "Favorite"}
            </button>
            {onRemoveFavorite && (
              <button
                className="btn btn-sm btn-outline-secondary ms-2"
                onClick={onRemoveFavorite}
              >
                Remove
              </button>
            )}
          </div>

          {showActions && (
            <div className="mt-2">
              <Link to={`/my-cards/edit/${_id}`}>Edit</Link>
              <Link className="mx-3" to={`/my-cards/delete/${_id}`}>
                Delete
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BusinessCard;
