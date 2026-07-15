// src/pages/Register.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { register, reset } from '../reduxAuth/authSlice';
import Spinner from '../components/global/Spinner';

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 1. Get status states from our Redux auth slice
  const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  // 2. Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [validated, setValidated] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); 

  // 3. Monitor registration success/error lifecycle
  useEffect(() => {
    if (isError) {
      toast.error(message || "Registration failed. Please try again.");
      dispatch(reset());
    }

    if (isSuccess) {
      setShowSuccessModal(true);
      dispatch(reset()); // Reset state so subsequent actions work cleanly
    }
  }, [isError, isSuccess, message, dispatch]);

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setValidated(true);

    // Basic Validation
    if (!fullName || !phone || !email || !password || !confirmPassword) {
      toast.error("All fields are required.");
      return;
    }

    if (!isValidPhoneNumber(phone)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    // Clean phone number format for DB consistency
    const cleanedPhone = phone.replace(/\D/g, '');

    const userData = {
      fullName,
      phonenumber: cleanedPhone, // Maps to the "phonenumber" field used in login
      email,
      password,
      role: 'Staff' // 🟢 Automatically register all public sign-ups as Staff
    };

    // Dispatch register action to Redux authSlice
    dispatch(register(userData));
  };

  // Helper phone verification
  function isValidPhoneNumber(cell) {
    if (!cell) return false;
    const cleaned = cell.replace(/\D/g, '');
    return /^\d{10}$/.test(cleaned);
  }

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundImage: "url('/assets/hero/mag1.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', overflowY: 'auto' }}>
      <div className="container my-5"> 
        <div className="row justify-content-center m-0">
          <div className="col-12 col-sm-10 col-md-8 col-lg-5">
            
            <div className="p-4 p-sm-5 border rounded-3 shadow bg-white bg-opacity-95" style={{ backdropFilter: 'blur(5px)' }}>
              <h3 className="mb-4 text-center fw-bold text-dark">Create Account</h3>

              <form onSubmit={handleRegisterSubmit}>
                {/* Input Fields */}
                <div className="mb-3">
                  <label htmlFor="fullNameInput" className="form-label fw-semibold text-secondary">Full Name <span className="text-danger">*</span></label>
                  <input id="fullNameInput" type="text" className={`form-control ${validated && !fullName ? 'is-invalid' : ''}`} value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" required />
                </div>

                <div className="mb-3">
                  <label htmlFor="phoneInput" className="form-label fw-semibold text-secondary">Phone Number <span className="text-danger">*</span></label>
                  <input id="phoneInput" type="tel" className={`form-control ${validated && !phone ? 'is-invalid' : ''}`} value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={10} placeholder="Enter 10-digit number" required />
                </div>

                <div className="mb-3">
                  <label htmlFor="emailInput" className="form-label fw-semibold text-secondary">Email address <span className="text-danger">*</span></label>
                  <input id="emailInput" type="email" className={`form-control ${validated && !email ? 'is-invalid' : ''}`} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" required />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="passwordInput" className="form-label fw-semibold text-secondary">Password <span className="text-danger">*</span></label>
                  <input id="passwordInput" type="password" className={`form-control ${validated && !password ? 'is-invalid' : ''}`} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" required />
                </div>

                <div className="mb-4">
                  <label htmlFor="confirmPasswordInput" className="form-label fw-semibold text-secondary">Confirm Password <span className="text-danger">*</span></label>
                  <input id="confirmPasswordInput" type="password" className={`form-control ${validated && !confirmPassword ? 'is-invalid' : ''}`} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Retype password" required />
                </div>
          
                <button type="submit" className="btn btn-success btn-lg w-100 shadow-sm fw-semibold mb-3">Register</button>
              </form>

              <p className="text-center small text-muted mb-0">
                Already have an account? <Link to="/login" className="text-decoration-none">Sign In</Link>
              </p>
            </div> 

          </div>
        </div>
      </div>

      {/* 🟢 SUCCESS MODAL OVERLAY */}
      {showSuccessModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-body text-center p-5">
                <div className="text-success mb-3"><i className="bi bi-check-circle-fill display-3"></i></div>
                <h4 className="fw-bold mb-3">Account successfully registered!</h4>
                <p className="text-muted mb-4">You can now use your credentials to log in to your dashboard panel.</p>
                <div className="d-flex flex-column gap-2">
                  <button type="button" className="btn btn-primary btn-lg fw-semibold" onClick={() => navigate('/login')}>Sign In</button>
                  <button type="button" className="btn btn-link text-secondary text-decoration-none btn-sm" onClick={() => setShowSuccessModal(false)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}