// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [practiceNumber, setPracticeNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!email || !practiceNumber) {
      toast.error("Both parameters are mandatory for cross-validation checks.");
      return;
    }

    setIsSubmitting(true);

    // Simulate cross-referencing values inside mock backend database array mapping definitions
    setTimeout(() => {
      const localUsers = JSON.parse(localStorage.getItem('mock_users_db')) || [];
      const userMatch = localUsers.find(
        (u) => u.email?.toLowerCase() === email.trim().toLowerCase() && 
               u.practiceNumber?.toLowerCase() === practiceNumber.trim().toLowerCase()
      );

      setIsSubmitting(false);

      if (!userMatch) {
        toast.error("Mismatch verified: Provided credentials do not align with any registered facility unit profile.");
        return;
      }

      toast.success(`Security payload transmitted successfully to ${email}!`);
      navigate('/login');
    }, 1200);
  };

  return (
    <div className="auth-page-wrapper px-3 d-flex align-items-center justify-content-center">
      <div className="container-fluid px-md-5" style={{ maxWidth: '1200px' }}>
        <div className="row g-0 justify-content-end">
          
          {/* Form Fields Column snapped to the far right */}
          <div className="col-md-6 col-lg-5 ms-auto p-4 p-sm-5 d-flex flex-column justify-content-center">
            <div className="mb-4 text-center text-md-start">
              <img src="/assets/logos/logo-black.svg" alt="The Script" width={160} className="mb-3" />
              <h3 className="auth-form-title">Account Recovery</h3>
              <p className="text-muted small"></p>
            </div>

            <form onSubmit={handleResetSubmit}>
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
                <label className="form-label fw-semibold text-secondary small">
                  Practice Number <span className="text-danger">*</span>
                </label>
                <input 
                  type="text" 
                  className="form-control form-control-lg fs-5 rounded-pill py-3 px-4" 
                  value={practiceNumber} 
                  onChange={(e) => setPracticeNumber(e.target.value)} 
                  placeholder="e.g. PRAC-12345"
                  required 
                />
              </div>

              {/* Centered Action Controls */}
              <div className="text-center">
                <button 
                  type="submit" 
                  className="btn btn-script btn-lg mb-3 shadow-sm px-5 py-2 rounded-pill w-100" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Validating Unit Alignment...' : 'Verify & Send Reset'}
                </button>

                {/* <div>
                  <Link 
                    to="/login" 
                    className="btn btn-script-outline btn-lg rounded-pill px-4 py-2 d-inline-flex align-items-center justify-content-center"
                  >
                    Back to Sign In
                  </Link>
                </div> */}
              </div>
            </form>
            <p className="text-center small text-muted mb-0">
              Remember your credentials? <Link to="/login" style={{ color: '#2db8eb' }} className="text-decoration-none fw-semibold">Sign In</Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}