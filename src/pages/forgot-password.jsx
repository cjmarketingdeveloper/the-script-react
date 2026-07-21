// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles/auth.css';

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
    <div className="auth-page-wrapper px-3">
      <div className="container" style={{ maxWidth: '660px' }}>
        {/* <div className="card auth-split-card shadow-lg"> */}
          <div className="row g-0">
            
            {/* Visual Vector Column */}
            {/* <div className="col-md-6 d-none d-md-flex auth-vector-panel">
              <img 
                src="image_agent_tag_16513441333642314217" 
                alt="Account Recovery Process" 
                className="auth-vector-image" 
              />
            </div> */}

            {/* Form Fields Column */}
            <div className="col-md-12 p-4 p-sm-5 d-flex flex-column justify-content-center">
              <div className="mb-4">
                <h3 className="auth-form-title">Account Recovery</h3>
                <p className="text-muted small">Verify identity anchors to generate password renewal tokens.</p>
              </div>

              <form onSubmit={handleResetSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-secondary small">Email Address <span className="text-danger">*</span></label>
                  <input 
                    type="email" 
                    className="form-control form-control-lg fs-6" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="name@example.com"
                    required 
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold text-secondary small">Practice Number <span className="text-danger">*</span></label>
                  <input 
                    type="text" 
                    className="form-control form-control-lg fs-6" 
                    value={practiceNumber} 
                    onChange={(e) => setPracticeNumber(e.target.value)} 
                    placeholder="e.g. PRAC-12345"
                    required 
                  />
                </div>

                <button type="submit" className="btn btn-script btn-lg w-100 mb-3 shadow-sm" disabled={isSubmitting}>
                  {isSubmitting ? 'Validating Unit Alignment...' : 'Verify & Send Reset'}
                </button>

                <Link to="/login" className="btn btn-script-outline btn-lg w-100 d-flex align-items-center justify-content-center">
                  Back to Sign In
                </Link>
              </form>
            </div>

          </div>
        {/* </div> */}
      </div>
    </div>
  );
}