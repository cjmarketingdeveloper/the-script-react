// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { login, reset } from '../reduxAuth/authSlice';
import Spinner from '../components/global/Spinner';
import '../styles/auth.css';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isError) {
      toast.error(message || "Invalid credentials.");
      dispatch(reset());
    }
    if (isSuccess || user) {
      navigate('/');
      dispatch(reset());
    }
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill out all fields.");
      return;
    }

    // Mock DB expects verification payloads
    dispatch(login({ email: email.trim(), password }));
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="auth-page-wrapper px-3 d-flex align-items-center justify-content-center">
    {/* style={{ 
      backgroundImage: `url("assets/login.svg")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh'
    }}> */}
      <div className="container" style={{ maxWidth: '660px' }}>
        {/* <div className="card auth-split-card shadow-lg"> */}
          <div className="row g-0">
            
            {/* Visual Vector Column */}
            {/* <div className="col-md-6 d-none d-md-flex auth-vector-panel">
              <img 
                src="assets/login.svg" 
                alt="Secure Login System" 
                className="auth-vector-image" 
              />
            </div> */}

            {/* Form Fields Column */}
            <div className="col-md-12 p-4 p-sm-5 d-flex flex-column justify-content-center">
              <div className="mb-4 text-center text-md-start">
                <img src="/assets/logos/logo-black.png" alt="The Script" width={160} className="mb-3" />
                <h3 className="auth-form-title">Welcome Back</h3>
                <p className="text-muted small">Please access your dashboard account panel details below.</p>
              </div>

              <form onSubmit={handleLoginSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-secondary small">Email Address <span className="text-danger">*</span></label>
                  <input 
                    type="text" 
                    className="form-control form-control-lg fs-6" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="name@example.com"
                    required 
                  />
                </div>
                
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label fw-semibold text-secondary small mb-0">Password <span className="text-danger">*</span></label>
                    <Link to="/forgot-password" style={{ color: '#2563EB' }} className="small text-decoration-none fw-semibold">
                      Forgot password?
                    </Link>
                  </div>
                  <input 
                    type="password" 
                    className="form-control form-control-lg fs-6" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Enter account password"
                    required 
                  />
                </div>

                <button type="submit" className="btn btn-script btn-lg w-100 mb-3 shadow-sm">
                  Log In
                </button>
              </form>

              <p className="text-center small text-muted mb-0 mt-2">
                Don't have an account? <Link to="/register" style={{ color: '#2563EB' }} className="text-decoration-none fw-semibold">Register here</Link>
              </p>
            </div>

          </div>
        {/* </div> */}
      </div>
    </div>
  );
}