import { Navigate, useLocation } from "react-router";
import { useAuth } from "../../context/auth.context";

// Add onlyAdmin prop with a default value of false
function ProtectedRoute({ children, onlyBiz = false, onlyAdmin = false }) {
  const { pathname } = useLocation();
  const { user } = useAuth();

  // Check if user exists
  if (!user) {
    return <Navigate to="/sign-in" state={{ from: pathname }} />;
  }

  // Check if route requires business user and user is not business
  if (onlyBiz && !user.isBusiness) {
    // Redirect non-business users trying to access business-only routes
    return <Navigate to="/" state={{ from: pathname }} />; // Or to a specific 'access denied' page
  }

  // Check if route requires admin user and user is not admin
  if (onlyAdmin && !user.isAdmin) {
    // Redirect non-admin users trying to access admin-only routes
    return <Navigate to="/" state={{ from: pathname }} />; // Or to a specific 'access denied' page
  }

  // If all checks pass, render the children components
  return children;
}

export default ProtectedRoute;
