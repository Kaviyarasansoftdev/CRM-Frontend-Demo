import { create } from 'zustand';
import { useNavigate } from 'react-router-dom';

const tokenname = "CRMAPPSECRET";

const useAuth = create((set) => ({
  isLoggedIn: !!localStorage.getItem(tokenname),

  login: (token) => {
    localStorage.setItem(tokenname, token);
    set({ isLoggedIn: true, token });
  },

  logout: () => {
    localStorage.removeItem(tokenname);
    set({ isLoggedIn: false, user: null });
    const navigate = useNavigate();
    navigate('/'); // Redirect to signin page
  },

  userdetails: () => {
    const token = localStorage.getItem(tokenname);
    if (token) {
      return JSON.parse(window.atob(token.split('.')[1]));
    } else {
      return null;
    }
  },
}));

export default useAuth;
