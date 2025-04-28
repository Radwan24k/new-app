// src/pages/adminDashboard.jsx
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify"; // Import toast
import PageHeader from "../components/common/pageHeader";
import { useAuth } from "../context/auth.context";
import usersService from "../services/usersService";
import { FaTrash, FaUserCheck, FaUserTimes } from "react-icons/fa";

function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Keep error state for initial load error display
  const [filter, setFilter] = useState("");

  // Fetch users on component mount
  useEffect(() => {
    if (user?.isAdmin) {
      async function fetchUsers() {
        try {
          const { data } = await usersService.getAllUsers();
          setUsers(data);
        } catch (err) {
          console.error("Error fetching users:", err);
          setError(err.response?.data || "Failed to fetch users.");
        } finally {
          setLoading(false);
        }
      }
      fetchUsers();
    } else {
      setLoading(false); // Not admin, stop loading
    }
  }, [user]);

  // Handle user deletion
  const handleDeleteUser = async (userIdToDelete) => {
    if (userIdToDelete === user._id) {
      toast.warn("Admin users cannot delete themselves."); // Use toast.warn
      return;
    }
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      try {
        await usersService.deleteUserById(userIdToDelete);
        setUsers(users.filter((u) => u._id !== userIdToDelete));
        toast.success("User deleted successfully."); // Success toast
      } catch (err) {
        console.error("Error deleting user:", err);
        toast.error("Failed to delete user."); // Error toast
      }
    }
  };

  // Handle toggling business status
  const handleToggleBusinessStatus = async (userIdToUpdate, currentStatus) => {
    if (userIdToUpdate === user._id) {
      toast.warn("Admin users cannot change their own business status."); // Use toast.warn
      return;
    }
    const newStatus = !currentStatus;
    if (
      window.confirm(
        `Change user to ${newStatus ? "Business" : "Regular"} user?`
      )
    ) {
      try {
        await usersService.updateUserBusinessStatus(userIdToUpdate, newStatus);
        setUsers(
          users.map((u) =>
            u._id === userIdToUpdate ? { ...u, isBusiness: newStatus } : u
          )
        );
        toast.success(
          `User status changed to ${newStatus ? "Business" : "Regular"}.`
        ); // Success toast
      } catch (err) {
        console.error("Error updating user status:", err);
        toast.error("Failed to update user status."); // Error toast
      }
    }
  };

  // Redirect if not admin or not logged in
  if (!loading && !user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (loading) return <div>Loading user data...</div>;

  // Display initial fetch error using a div, as toast is for transient messages
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  // Filter users based on input
  const filteredUsers = users.filter(
    (u) =>
      u.name?.first?.toLowerCase().includes(filter.toLowerCase()) ||
      u.name?.last?.toLowerCase().includes(filter.toLowerCase()) ||
      u.email?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="container">
      <PageHeader title="Admin Dashboard" description="User Management" />

      {/* Search Input */}
      <div className="row mb-3">
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Search users by name or email..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Business User?</th>
              <th>Admin?</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => (
                <tr key={u._id}>
                  <td>{`${u.name.first} ${u.name.last}`}</td>
                  <td>{u.email}</td>
                  <td>{u.isBusiness ? "Yes" : "No"}</td>
                  <td>{u.isAdmin ? "Yes" : "No"}</td>
                  <td>
                    {/* Toggle Business Status Button */}
                    <button
                      className={`btn btn-sm me-1 ${
                        u.isBusiness ? "btn-warning" : "btn-success"
                      }`}
                      onClick={() =>
                        handleToggleBusinessStatus(u._id, u.isBusiness)
                      }
                      title={
                        u.isBusiness
                          ? "Make Regular User"
                          : "Make Business User"
                      }
                      disabled={u.isAdmin} // Disable for admins
                    >
                      {u.isBusiness ? <FaUserTimes /> : <FaUserCheck />}
                    </button>

                    {/* Delete Button */}
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteUser(u._id)}
                      title="Delete User"
                      disabled={u.isAdmin} // Disable for admins
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No users found{filter ? " matching your search" : ""}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
