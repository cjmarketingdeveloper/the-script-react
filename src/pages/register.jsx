// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
// 1. Added 'login' import here
import { register, login, reset } from '../reduxAuth/authSlice'; 
import Spinner from '../components/global/Spinner';

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading } = useSelector((state) => state.auth);

  // Specified Field Parameters
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [practiceNumber, setPracticeNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  
  const [validated, setValidated] = useState(false);

  // 2. Removed the useEffect block so it won't force navigation mid-process

  const handleRegisterSubmit = async (e) => {
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

    const userData = {
      fullName: `${name} ${surname}`.trim(),
      name: name,
      surname: surname,
      phone: cleanedPhone,
      email: email.trim(),
      password,
      practiceNumber: practiceNumber.trim(),
      job: jobTitle.trim(),
      role: 'Staff'
    };

    try {
      // Step A: Register the user
      await dispatch(register(userData)).unwrap();
      
      // Step B: Immediately log them in
      await dispatch(login({ email: email.trim(), password })).unwrap();
      
      toast.success("Account created and logged in successfully!");
      
      // Step C: Navigate to main dashboard/home
      navigate('/'); 

    } catch (err) {
      toast.error(err || "Something went wrong during registration.");
    } finally {
      dispatch(reset());
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="auth-page-wrapper register-page p-3 py-5 d-flex align-items-center justify-content-center" style={{ backgroundSize: 'contain' }}>
      <div className="container-fluid px-md-5" style={{ maxWidth: '1200px' }}>
        <div className="row g-0 justify-content-end">
          
          {/* Form Fields Column */}
          <div className="col-lg-6 col-xl-5 ms-auto p-4 p-sm-5 d-flex flex-column justify-content-center">
            <div className="mb-4 text-center text-md-start">
              <img src="/assets/logos/logo-black.svg" alt="The Script" width={160} className="mb-3" />
              <h3 className="auth-form-title">Create Staff Account</h3>
              <p className="text-muted small"></p>
            </div>

            <form onSubmit={handleRegisterSubmit}>
              <div className="row g-2 mb-3">
                <div className="col-sm-6">
                  <label className="form-label fw-semibold text-secondary small">
                    Name <span className="text-danger">*</span>
                  </label>
                  <input 
                    type="text" 
                    className={`form-control form-control-lg fs-5 rounded-pill py-3 px-4 ${validated && !name ? 'is-invalid' : ''}`} 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}  
                    required 
                  />
                </div>
                <div className="col-sm-6">
                  <label className="form-label fw-semibold text-secondary small">
                    Surname <span className="text-danger">*</span>
                  </label>
                  <input 
                    type="text" 
                    className={`form-control form-control-lg fs-5 rounded-pill py-3 px-4 ${validated && !surname ? 'is-invalid' : ''}`} 
                    value={surname} 
                    onChange={(e) => setSurname(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary small">
                  Email Address <span className="text-danger">*</span>
                </label>
                <input 
                  type="email" 
                  className={`form-control form-control-lg fs-5 rounded-pill py-3 px-4 ${validated && !email ? 'is-invalid' : ''}`} 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="example@pharmacy.com" 
                  required 
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary small">
                  Password <span className="text-danger">*</span>
                </label>
                <input 
                  type="password" 
                  className={`form-control form-control-lg fs-5 rounded-pill py-3 px-4 ${validated && !password ? 'is-invalid' : ''}`} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="At least 6 characters" 
                  required 
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary small">
                  Phone <span className="text-danger">*</span>
                </label>
                <input 
                  type="tel" 
                  className={`form-control form-control-lg fs-5 rounded-pill py-3 px-4 ${validated && !phone ? 'is-invalid' : ''}`} 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  maxLength={10} 
                  placeholder="10-digit number" 
                  required 
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary small">
                  Practice Number <span className="text-danger">*</span>
                </label>
                <input 
                  type="text" 
                  className={`form-control form-control-lg fs-5 rounded-pill py-3 px-4 ${validated && !practiceNumber ? 'is-invalid' : ''}`} 
                  value={practiceNumber} 
                  onChange={(e) => setPracticeNumber(e.target.value)} 
                  placeholder="e.g. PRAC-12345" 
                  required 
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold text-secondary small">
                  Job Title <span className="text-muted">(Optional)</span>
                </label>
                <input 
                  type="text" 
                  className="form-control form-control-lg fs-5 rounded-pill py-3 px-4" 
                  value={jobTitle} 
                  onChange={(e) => setJobTitle(e.target.value)} 
                  placeholder="e.g. Clerk, Assistant, Driver" 
                />
              </div>
        
              <div className="text-center">
                <button 
                  type="submit" 
                  className="btn btn-script btn-lg mb-3 shadow-sm px-5 py-2 rounded-pill w-100"
                >
                  Register
                </button>
              </div>
            </form>

            <p className="text-center small text-muted mb-0">
              Already registered? <Link to="/login" style={{ color: '#2db8eb' }} className="text-decoration-none fw-semibold">Sign In</Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}