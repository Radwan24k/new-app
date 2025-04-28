import "./App.css";
import { Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import CSS

import Footer from "./components/footer";
import NavBar from "./components/navbar";

import Home from "./pages/home";
import About from "./pages/about";
import SignIn from "./pages/signIn";
import SignUp from "./pages/signUp";
import SignOut from "./pages/signOut";
import MyCards from "./pages/myCards";
import CardCreate from "./pages/cardCreate";
import CardUpdate from "./pages/cardUpdate";
import ProtectedRoute from "./components/common/protectedRoute";
import FavoritesPage from "./pages/favoristes";
import BusinessDetailsPage from "./pages/businessDetails";
import AdminDashboard from "./pages/adminDashboard";

function App() {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <ToastContainer // Add ToastContainer here
        position="top-right"
        autoClose={3000} // Auto close toasts after 3 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" // Or "dark" or "colored"
      />
      <header>
        <NavBar />
      </header>
      <main className="flex-fill">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/my-cards"
            element={
              <ProtectedRoute onlyBiz>
                <MyCards />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-card"
            element={
              <ProtectedRoute onlyBiz>
                <CardCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-card/:id"
            element={
              <ProtectedRoute onlyBiz>
                <CardUpdate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/business-details/:id"
            element={<BusinessDetailsPage />}
          />

          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            }
          />

          {/* Add route for Admin Dashboard (protected for admins) */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute onlyAdmin>
                {" "}
                {/* Use onlyAdmin prop */}
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-out" element={<SignOut />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
