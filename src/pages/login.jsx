import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { login, reset } from '../reduxAuth/authSlice';
import Spinner from '../components/global/Spinner';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 1. Select the auth states from your Redux store
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // 2. Handle Redux state updates cleanly
  useEffect(() => {
    if (isError) {
      setError(message || "Invalid credentials.");
      toast.error(message || "Invalid credentials.");
      dispatch(reset()); // 🟢 Safely clear error flags now that we've handled them
    }

    if (isSuccess || user) {
      navigate('/');
      dispatch(reset()); // 🟢 Safely clear success flags now that we are redirecting
    }
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  // 3. Dispatch the login action to your mock database
  const handleLoginSubmit = async () => {
    setError('');
    
    if (!email || !password) {
      setError("Please fill out all fields.");
      return;
    }

    // Your mock slice explicitly uses: u.phonenumber === loginPayload.phonenumber
    // When logging in, enter the raw 10 digit number (e.g., 0821111111) in the input field!
    const userData = {
      phonenumber: email.trim(), 
      password: password
    };

    dispatch(login(userData));
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundImage: "url('/assets/hero/mag1.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', overflowY: 'auto' }}>
      <div className="container">
        <div className="row justify-content-center m-0">
          <div className="col-12 col-sm-8 col-md-6 col-lg-4">
            
            <div className="p-4 p-sm-5 border rounded-3 shadow bg-white bg-opacity-95" style={{ backdropFilter: 'blur(5px)' }}>
              <h3 className="mb-4 text-center fw-bold text-dark">Sign In</h3>
              
              {error && <div className="alert alert-danger p-2 small text-center">{error}</div>}

              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary">Phone Number</label>
                <input 
                  type="text" 
                  className="form-control form-control-lg" 
                  placeholder="e.g. 0821111111"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
              
              <div className="mb-4">
                <label className="form-label fw-semibold text-secondary">Password</label>
                <input 
                  type="password" 
                  className="form-control form-control-lg" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>

              <div className="mb-4 text-end">
                <Link to="/forgot-password" className="small text-decoration-none fw-semibold text-primary">
                  Forgot password?
                </Link>
              </div>
              
              <button 
                type="button" 
                onClick={handleLoginSubmit} 
                className="btn btn-primary btn-lg w-100 shadow-sm fw-semibold mb-3"
              >
                Log In
              </button>

              <p className="text-center small text-muted mb-0">
                Don't have an account? <Link to="/register" className="text-decoration-none">Register here</Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}