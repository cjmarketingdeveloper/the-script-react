// src/pages/Register.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { register, reset } from '../reduxAuth/authSlice';
import Spinner from '../components/global/Spinner';
import '../styles/auth.css';

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  // Specified Field Parameters
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [practiceNumber, setPracticeNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  
  const [validated, setValidated] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); 

  useEffect(() => {
    if (isError) {
      toast.error(message || "Registration failed. Please try again.");
      dispatch(reset());
    }
    if (isSuccess) {
      setShowSuccessModal(true);
      dispatch(reset());
    }
  }, [isError, isSuccess, message, dispatch]);

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setValidated(true);

    if (!name || !surname || !email || !password || !practiceNumber || !phone) {
      toast.error("Please fill in all required fields marked with an asterisk (*).");
      return;
    }

    const cleanedPhone = phone.replace(/\D/g, '');
    if (cleanedPhone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    // Bind fields to payload enforcing Staff rules anchored via Pharmacy Unit
    const userData = {
      fullName: `${name} ${surname}`.trim(),
      firstName: name,
      lastName: surname,
      phonenumber: cleanedPhone,
      email,
      password,
      practiceNumber: practiceNumber.trim(),
      jobTitle: jobTitle.trim(),
      role: 'Staff' // Enforced constraint
    };

    dispatch(register(userData));
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="auth-page-wrapper p-3 py-5">
      <div className="container" style={{ maxWidth: '640px' }}>
        {/* <div className="card auth-split-card shadow-lg"> */}
          <div className="row g-0">
            
            {/* Form Fields Column */}
            <div className="col-lg-12 p-4 p-sm-5 d-flex flex-column justify-content-center">
              <div className="mb-4">
                <h3 className="auth-form-title">Create Staff Account</h3>
                <p className="text-muted small">Enter your pharmacy workplace coordinates to self-provision validation profiles.</p>
              </div>

              <form onSubmit={handleRegisterSubmit}>
                <div className="row g-2 mb-3">
                  <div className="col-sm-6">
                    <label className="form-label fw-semibold text-secondary small">Name <span className="text-danger">*</span></label>
                    <input type="text" className={`form-control ${validated && !name ? 'is-invalid' : ''}`} value={name} onChange={(e) => setName(e.target.value)} placeholder="John" required />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label fw-semibold text-secondary small">Surname <span className="text-danger">*</span></label>
                    <input type="text" className={`form-control ${validated && !surname ? 'is-invalid' : ''}`} value={surname} onChange={(e) => setSurname(e.target.value)} placeholder="Doe" required />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold text-secondary small">Email Address <span className="text-danger">*</span></label>
                  <input type="email" className={`form-control ${validated && !email ? 'is-invalid' : ''}`} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@pharmacy.com" required />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold text-secondary small">Password <span className="text-danger">*</span></label>
                  <input type="password" className={`form-control ${validated && !password ? 'is-invalid' : ''}`} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" required />
                </div>

                <div className="row g-2 mb-4">
                  <div className="col-sm-6">
                    <label className="form-label fw-semibold text-secondary small">Practice Number <span className="text-danger">*</span></label>
                    <input type="text" className={`form-control ${validated && !practiceNumber ? 'is-invalid' : ''}`} value={practiceNumber} onChange={(e) => setPracticeNumber(e.target.value)} placeholder="e.g. PRAC-12345" required />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label fw-semibold text-secondary small">Phone <span className="text-danger">*</span></label>
                    <input type="tel" className={`form-control ${validated && !phone ? 'is-invalid' : ''}`} value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={10} placeholder="10-digit number" required />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold text-secondary small">Job Title <span className="text-muted">(Optional)</span></label>
                  <input type="text" className="form-control" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Clerk, Assistant, Driver" />
                </div>
          
                <button type="submit" className="btn btn-script btn-lg w-100 mb-3 shadow-sm">Register Account</button>
              </form>

              <p className="text-center small text-muted mb-0">
                Already registered? <Link to="/login" style={{ color: '#2563EB' }} className="text-decoration-none fw-semibold">Sign In</Link>
              </p>
            </div>

            {/* Visual Vector Column */}
            {/* <div className="col-lg-6 d-none d-lg-flex auth-vector-panel">
              <img 
                src="image_agent_tag_16513441333642316184" 
                alt="Pharmacy Staff Workspace" 
                className="auth-vector-image" 
              />
            </div> */}

          </div>
        {/* </div> */}
      </div>

      {/* SUCCESS OVERLAY MODAL */}
      {showSuccessModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg p-4">
              <div className="modal-body text-center p-4">
                <div className="mb-3" style={{ color: 'var(--color-script-main)' }}><i className="bi bi-check-circle-fill display-4"></i></div>
                <h4 className="fw-bold mb-2">Registration Complete</h4>
                <p className="text-muted small mb-4">Your staff profile is bound under practice key unit tracking parameters.</p>
                <button type="button" className="btn btn-script w-100" onClick={() => navigate('/login')}>Proceed to Sign In</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}