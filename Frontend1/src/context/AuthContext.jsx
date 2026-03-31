import { createContext, useState, useContext, useEffect } from "react";
import { loginUser, logoutUser, getMe } from "../services/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // NEW: Global loading state

  // NEW: Check login status on page refresh/mount
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const res = await getMe();
        setUser(res.data.user);
        setIsAuthenticated(true);
      } catch (error) {
        // If cookie is missing/invalid, ensure logout state
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false); // Stop loading once check is complete
      }
    };

    checkUserSession();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await loginUser({ email, password });
      const userData = res.data?.user || { email, role: "customer" };
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed. Please try again.";
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};