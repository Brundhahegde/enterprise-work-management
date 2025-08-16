import { useSelector } from 'react-redux';

const useAuth = () => {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  return { token, user, isAuthenticated: !!token };
};

export default useAuth;
