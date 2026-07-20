import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from '../components/global/Spinner'; // Adjust path if necessary

export default function AuthScreens() {
  // 1. Grab auth state from Redux
  const { user, isLoading } = useSelector((state) => state.auth);

  // 2. If Redux is still loading the session from localStorage, show a loader
  if (isLoading) {
    return <Spinner />; 
  }

  // 3. If there is no logged-in user in Redux, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 4. If they are authenticated, render the nested routes
  return <Outlet />;
}