import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  // If not logged in, redirect them to the /login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, let them pass through to the page
  return children;
}