import { useSelector, useDispatch } from 'react-redux';
import { setCredentials, logout } from '../store/authSlice';
import axios from '../utils/axios';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, token } = useSelector((state) => state.auth);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/api/v1/auth/login', { email, password });
      dispatch(setCredentials(data));
      return data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (email, password) => {
    try {
      const { data } = await axios.post('/api/v1/auth/register', { email, password });
      dispatch(setCredentials(data));
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  return {
    user,
    isAuthenticated,
    token,
    login,
    register,
    logout: logoutUser,
  };
}; 