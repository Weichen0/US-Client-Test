import React, { createContext, useContext, useEffect, useState } from 'react';

// Create an AuthContext
const AuthContext = createContext();

// AuthProvider component to wrap your app and manage authentication state
export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || null);
  const [userProfile, setUserProfile] = useState(null);


  const login = (token) => {
    setAccessToken(token);
    localStorage.setItem('accessToken', token);
  };

  const logout = () => {
    setAccessToken(null);
    localStorage.removeItem('accessToken');
    setUserProfile(null); // Clear user profile on logout

  };

  useEffect(() => {
    // Fetch user profile if accessToken exists
    const fetchUserProfile = async () => {
      if (accessToken) {
        try {
          const response = await fetch('http://localhost:8080/user/current', {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUserProfile(userData);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    fetchUserProfile();
  }, [accessToken]);


  return (
    <AuthContext.Provider value={{ accessToken, userProfile, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
