import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useSelector((state) => state.auth);

  // 🔴 TEMP DEBUG LOGS
  console.log("--- PROTECTED ROUTE DEBUG ---");
  console.log("Loading State:", isLoading);
  console.log("Current User Object:", user);
  console.log("Is Authenticated:", !!user);

  if (isLoading) {
    return null; 
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}