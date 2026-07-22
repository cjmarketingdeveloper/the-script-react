// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { login, reset } from '../reduxAuth/authSlice';
import Spinner from '../components/global/Spinner';

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

    dispatch(login({ email: email.trim(), password }));
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="auth-page-wrapper px-3 d-flex align-items-center justify-content-center">
      <div className="container-fluid px-md-5" style={{ maxWidth: '1200px' }}>
        <div className="row g-0 justify-content-end">

          {/* Form Fields Column snapped to far right */}
          <div className="col-md-6 col-lg-5 ms-auto p-4 p-sm-5 d-flex flex-column justify-content-center">
            <div className="mb-4 text-center text-md-start">
              <img src="/assets/logos/logo-black.png" alt="The Script" width={160} className="mb-3" />
              <h3 className="auth-form-title">Welcome Back</h3>
              <p className="text-muted small"></p>
            </div>

            <form onSubmit={handleLoginSubmit}>
              <div className="mb-4">
                <label className="form-label fw-semibold text-secondary small">
                  Email Address <span className="text-danger">*</span>
                </label>
                <input 
                  type="email" 
                  className="form-control form-control-lg fs-5 rounded-pill py-3 px-4" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="name@example.com"
                  required 
                />
              </div>
              
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label fw-semibold text-secondary small mb-0">
                    Password <span className="text-danger">*</span>
                  </label>
                  <Link to="/forgot-password" style={{ color: '#2db8eb' }} className="small text-decoration-none fw-semibold">
                    Forgot password?
                  </Link>
                </div>
                <input 
                  type="password" 
                  className="form-control form-control-lg fs-5 rounded-pill py-3 px-4" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Enter account password"
                  required 
                />
              </div>

              {/* Centered Submit Button */}
              <div className="text-center">
                <button 
                  type="submit" 
                  className="btn btn-script btn-lg mb-3 shadow-sm px-5 py-2 rounded-pill w-100"
                >
                  Log In
                </button>
              </div>
            </form>

            <p className="text-center small text-muted mb-0 mt-2">
              Don't have an account? <Link to="/register" style={{ color: '#2db8eb' }} className="text-decoration-none fw-semibold">Register here</Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}