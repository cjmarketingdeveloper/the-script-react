// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from "axios";
import Spinner from '../components/global/Spinner';
import * as CONSTANTS from "./../CONSTANTS";

export default function ForgotPassword() {
  const navigate                              = useNavigate();
  const [email, setEmail]                     = useState('');
  const [practiceNumber, setPracticeNumber]   = useState('');
  
  const [isSubmitting, setIsSubmitting]               = useState(false);
  const [showReset, setShowReset]                     = useState(false);
  const [resetData, setResetData]                     = useState(null);

  const [newPassword, setNewPassword]                 = useState("");
  const [showPassword, setShowPassword]               = useState(false);
  const [confirmPassword, setConfirmPassword]         = useState("");
  const [confirmCode, setConfirmCode]                 = useState("");
  
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!email || !practiceNumber) {
      toast.error("Both parameters are mandatory for cross-validation checks.");
      return;
    }

    setIsSubmitting(true);
    try{

      const response = await axios.post(`${CONSTANTS.API_URL}auth/initiate/reset/user-password/v1`, {
        email: email.trim(),
        practiceNumber: practiceNumber.trim()
      });

      if(response.status === 200){

        setResetData(response.data);
        setShowReset(true);
        toast.success("Validation successful! Please check your email for the reset link.");
      }else{
        toast.warning("We seem to have network issues, try again later.")
      }
    }catch(err){
      toast.error("An error occurred while processing your request.");
    }finally{
      setIsSubmitting(false);
    }
  };

  const handleConfirmPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword && newPassword.length > 2 ) {
      toast.error("The new password and confirmation password do not match.");
      return;
    }

    setIsSubmitting(true);
    try{
      const response = await axios.post(`${CONSTANTS.API_URL}auth/confirm/reset/user-password/v1`, {
        email: email.trim(),
        resetToken: confirmCode.trim(),
        newPassword: newPassword
      });

       setIsSubmitting(false);
      if(response.status === 200){
        toast.success(response.data.message || "Password reset successful! Redirecting to login...");
        setTimeout(() => {
          navigate('/login');
        }, 3000); 
      }
    }catch(err){
      toast.error("An error occurred while processing your request.");
       setIsSubmitting(false);
    }
  }

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

            {
              showReset === false ?
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
              :
                <form onSubmit={handleConfirmPassword}>
                  <div className="mb-4">
                      <label className="form-label fw-semibold text-secondary small">
                              Confirmation Code <span className="text-danger">*</span>
                        </label>
                        <input 
                          type="text" 
                          className="form-control form-control-lg fs-5 rounded-pill py-3 px-4" 
                          value={confirmCode} 
                          onChange={(e) => setConfirmCode(e.target.value)} 
                          placeholder="e.g. 12345"
                          required 
                        />
                    </div>
                    <div className="mb-4 relative">
                      <label className="form-label fw-semibold text-secondary small">
                              New Password <span className="text-danger">*</span>
                        </label>
                        <div className="position-relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            className="form-control form-control-lg fs-5 rounded-pill py-3 px-4"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            required
                          />
                          <div className="position-absolute end-0 top-50 translate-middle-y"
                            style={{
                              margineRight: '100px',
                              margineTop: '25px'
                            }}>
                            <button
                              type="button"
                              className="btn btn-link text-secondary text-decoration-none border-0 shadow-none"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <i className="bi bi-eye-slash"></i>
                              ) : (
                                <i className="bi bi-eye"></i>
                              )}
                            </button>
                          </div>
                        </div>
                    </div>
                    <div className="mb-4">
                      <label className="form-label fw-semibold text-secondary small">
                              Confirm New Password <span className="text-danger">*</span>
                        </label>
                        <input
                          type="password" 
                          className="form-control form-control-lg fs-5 rounded-pill py-3 px-4"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter new password"
                          required
                        />
                    </div>
                    <div className="text-center">
                        <button 
                          type="submit" 
                          className="btn btn-script btn-lg mb-3 shadow-sm px-5 py-2 rounded-pill w-100" 
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Validating Unit Alignment...' : 'Confirm Passwod Reset'}
                        </button>
                      </div>
                </form>
            }
            
            <p className="text-center small text-muted mb-0">
              Remember your credentials? <Link to="/login" style={{ color: '#2db8eb' }} className="text-decoration-none fw-semibold">Sign In</Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}