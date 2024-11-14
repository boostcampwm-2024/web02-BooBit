import { useAuth } from './authContext';

export const useAuthActions = () => {
  const { dispatch } = useAuth();

  const login = () => {
    dispatch({ type: 'LOGIN' });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return { login, logout };
};
