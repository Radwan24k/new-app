import { Link, NavLink } from "react-router-dom"; // Corrected import
import Logo from "./logo";
import { useAuth } from "../context/auth.context";

function NavBar() {
  const { user } = useAuth(); // user contains _id, isBusiness, isAdmin or is null

  return (
    <nav
      className="navbar navbar-expand-md navbar bg-light shadow-sm"
      aria-label="Fourth navbar example"
    >
      <div className="container">
        <Link className="navbar-brand" to="/">
          <Logo />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarsExample04"
          aria-controls="navbarsExample04"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarsExample04">
          {/* Left side links */}
          <ul className="navbar-nav me-auto mb-2 mb-md-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/about">
                About
              </NavLink>
            </li>

            {/* Links for logged-in users */}
            {user && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/favorites">
                  Favorites
                </NavLink>
              </li>
            )}

            {/* Links for business users (includes admins) */}
            {user?.isBusiness && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/my-cards">
                  My Cards
                </NavLink>
              </li>
            )}

            {/* Links for admin users */}
            {user?.isAdmin && (
              <li className="nav-item">
                {/* Add NavLink to Admin Dashboard */}
                <NavLink className="nav-link" to="/admin-dashboard">
                  Admin Dashboard
                </NavLink>
              </li>
            )}
          </ul>

          {/* Right side links */}
          <ul className="navbar-nav ms-auto mb-2 mb-md-0">
            {user ? (
              // Logged In User
              <li className="nav-item">
                <NavLink className="nav-link" to="/sign-out">
                  Sign Out
                </NavLink>
              </li>
            ) : (
              // Logged Out User
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/sign-in">
                    Sign In
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/sign-up">
                    Sign Up
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
