import { createContext, useContext, useState, useEffect } from 'react';
import { Users as DefaultUsers } from '../data/users';

const AuthContext = createContext(null);
const SESSION_TIMEOUT = 8.5 * 60 * 60 * 1000; // 8.5 hours

// Helper to manage our mock "database" in localStorage
const getLocalUsers = () => {
  const local = localStorage.getItem('mock_users_db');
  if (!local) {
    // Seed with your local users file
    localStorage.setItem('mock_users_db', JSON.stringify(DefaultUsers));
    return DefaultUsers;
  }
  return JSON.parse(local);
};

const saveLocalUsers = (users) => {
  localStorage.setItem('mock_users_db', JSON.stringify(users));
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session on mount
  useEffect(() => {
    const sessionUser = localStorage.getItem('mock_current_user');
    const loginTime = localStorage.getItem('loginTime');

    if (sessionUser && loginTime) {
      const isExpired = Date.now() - parseInt(loginTime, 10) > SESSION_TIMEOUT;
      if (isExpired) {
        logout();
      } else {
        setUser(JSON.parse(sessionUser));
      }
    }
    setLoading(false);
  }, []);

  // Background countdown timer enforcement
  useEffect(() => {
    if (!user) return;

    const loginTime = parseInt(localStorage.getItem('loginTime') || '0', 10);
    const timeLeft = SESSION_TIMEOUT - (Date.now() - loginTime);

    if (timeLeft <= 0) {
      logout();
      return;
    }

    const timer = setTimeout(() => {
      logout();
      alert("Your mock 8.5-hour session has expired.");
    }, timeLeft);

    return () => clearTimeout(timer);
  }, [user]);

  // 1. Simulate Email/Password Registration
  const registerWithEmail = async (email, password, fullName, phone) => {
    const db = getLocalUsers();
    
    const userExists = db.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (userExists) {
      throw new Error("A user with this email already exists.");
    }

    const newUser = {
      id: `usr_${Math.random().toString(36).substr(2, 9)}`,
      email,
      password, // Stored for mock login verification
      user_metadata: {
        full_name: fullName,
        phone_number: phone,
      },
      created_at: new Date().toISOString()
    };

    db.push(newUser);
    saveLocalUsers(db);

    // Auto-login the registered user
    return completeLogin(newUser);
  };

  // 2. Simulate Email/Password Login
  const loginWithEmail = async (email, password) => {
    const db = getLocalUsers();
    const foundUser = db.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!foundUser) {
      throw new Error("Invalid email or password.");
    }

    return completeLogin(foundUser);
  };

  // 3. Simulate Google OAuth Login
  const loginWithGoogle = async () => {
    // Generate a mock Google user
    const mockGoogleUser = {
      id: "usr_google_mock_123",
      email: "google.tester@example.com",
      user_metadata: {
        full_name: "Google Tester",
        phone_number: "+155555555"
      },
      created_at: new Date().toISOString()
    };

    return completeLogin(mockGoogleUser);
  };

  // Helper to handle login state mutations
  const completeLogin = (loggedInUser) => {
    // Strip the password before putting it in active state / session storage
    const { password, ...safeUser } = loggedInUser;
    
    localStorage.setItem('loginTime', Date.now().toString());
    localStorage.setItem('mock_current_user', JSON.stringify(safeUser));
    
    setUser(safeUser);
    return safeUser;
  };

  // 4. Logout
  const logout = async () => {
    localStorage.removeItem('loginTime');
    localStorage.removeItem('mock_current_user');
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    registerWithEmail,
    loginWithEmail,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};