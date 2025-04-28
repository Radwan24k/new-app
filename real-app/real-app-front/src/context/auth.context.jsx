import { createContext, useContext, useState } from "react";
// Import the default export from usersService
import usersService from "../services/usersService";

export const authContext = createContext(null); // Initialize with null
authContext.displayName = "Auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Use usersService.getUser
    const currentUser = usersService.getUser();
    console.log("Initial user state:", currentUser); // Debugging
    return currentUser;
  });

  // Use usersService.getUser
  const refreshUser = () => setUser(usersService.getUser());

  const login = async (credentials) => {
    // Use usersService.login
    await usersService.login(credentials);
    refreshUser(); // Update user state after successful login
  };

  const logout = () => {
    // Use usersService.logout
    usersService.logout();
    refreshUser(); // Update user state (will become null)
  };

  return (
    <authContext.Provider
      value={{
        user, // The decoded user object (_id, isBusiness, isAdmin)
        login,
        logout,
        // Pass usersService.createUser directly
        createUser: usersService.createUser,
      }}
    >
      {children}
    </authContext.Provider>
  );
}

export function useAuth() {
  return useContext(authContext);
}
