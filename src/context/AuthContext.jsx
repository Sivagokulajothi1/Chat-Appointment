import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // restore session on reload (sessionStorage clears on browser close)
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const storedUser = sessionStorage.getItem("user");

    if (token) {
      setIsLoggedIn(true);
      if (storedUser) setUser(JSON.parse(storedUser));
    }
  }, []);

  // for login and signup (same)
  const setSession = (token, userData) => {
    if (token) sessionStorage.setItem("token", token);
    if (userData) sessionStorage.setItem("user", JSON.stringify(userData));
    setIsLoggedIn(true);
    setUser(userData || null);
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, setSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
