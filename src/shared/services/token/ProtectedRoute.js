/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../store/useAuth';
import { getuserdetails,gettoken } from './token';
import { jwtDecode } from 'jwt-decode';


const ProtectedRoute = ({ children, allowedRoles }) => {
  const navigate = useNavigate();
  const { isLoggedIn, userdetails, logout } = useAuth();
  const userRole = userdetails() ? userdetails().Role : null;

  useEffect(() => {
    if (!isLoggedIn || (allowedRoles && !allowedRoles.includes(userRole))) {
      navigate('/');
    }
  }, [isLoggedIn, allowedRoles, userRole, navigate]);

  useEffect(() => {
    if (gettoken()) {
      try {
        // Decode token to get expiration time
        const decoded = jwtDecode(gettoken());
        const currentTime = Date.now() / 1000; // Current time in seconds

        if (decoded.exp < currentTime) {
          // If the token is already expired
          logout();
        } else {
          // Set a timer to log out when the token expires
          const timeUntilExpiry = (decoded.exp - currentTime) * 1000; // Convert seconds to milliseconds
          setTimeout(() => {
            logout();
          }, timeUntilExpiry);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        logout(); // Logout if the token is invalid
      }
    }
  }, [gettoken()]);

  return isLoggedIn ? children : null;
};

  

export default ProtectedRoute;
