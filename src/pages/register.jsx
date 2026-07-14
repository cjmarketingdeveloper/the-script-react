import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


export default function Register() {
  const { registerWithEmail, loginWithGoogle } = useAuth();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [validated, setValidated] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // 🟢 Tracks custom modal visibility
  const navigate = useNavigate();

  const handleRegisterSubmit = async () => {
    setError('');
    setValidated(true);

    if (!fullName || !phone || !email || !password || !confirmPassword) {
      return setError("All fields are required.");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      

      if (existingUser) {
        return setError("An account with this email address already exists.");
      }

      // 2. Attempt Registration
      await registerWithEmail(email, password, fullName, phone);
      
      // 3. 🟢 Trigger custom modal popup instead of browser alert
      setShowSuccessModal(true);
    } catch (err) {
      // Catch Supabase specific duplicate user strings if manual check missed it
      if (err.message.includes("already registered") || err.message.includes("User already exists")) {
        setError("An account with this email address already exists.");
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundImage: "url('/assets/hero/mag1.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', overflowY: 'auto' }}>
      <div className="container my-5"> 
        <div className="row justify-content-center m-0">
          <div className="col-12 col-sm-10 col-md-8 col-lg-5">
            
            <div className="p-4 p-sm-5 border rounded-3 shadow bg-white bg-opacity-95" style={{ backdropFilter: 'blur(5px)' }}>
              <h3 className="mb-4 text-center fw-bold text-dark">Create Account</h3>
              
              {error && <div className="alert alert-danger p-2 small text-center">{error}</div>}

              {/* Input Fields */}
              <div className="mb-3">
                <label htmlFor="fullNameInput" className="form-label fw-semibold text-secondary">Full Name <span className="text-danger">*</span></label>
                <input id="fullNameInput" type="text" className={`form-control ${validated && !fullName ? 'is-invalid' : ''}`} value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" />
              </div>

              <div className="mb-3">
                <label htmlFor="phoneInput" className="form-label fw-semibold text-secondary">Phone Number <span className="text-danger">*</span></label>
                <input id="phoneInput" type="tel" className={`form-control ${validated && !phone ? 'is-invalid' : ''}`} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" />
              </div>

              <div className="mb-3">
                <label htmlFor="emailInput" className="form-label fw-semibold text-secondary">Email address <span className="text-danger">*</span></label>
                <input id="emailInput" type="email" className={`form-control ${validated && !email ? 'is-invalid' : ''}`} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
              </div>
              
              <div className="mb-3">
                <label htmlFor="passwordInput" className="form-label fw-semibold text-secondary">Password <span className="text-danger">*</span></label>
                <input id="passwordInput" type="password" className={`form-control ${validated && !password ? 'is-invalid' : ''}`} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
              </div>

              <div className="mb-4">
                <label htmlFor="confirmPasswordInput" className="form-label fw-semibold text-secondary">Confirm Password <span className="text-danger">*</span></label>
                <input id="confirmPasswordInput" type="password" className={`form-control ${validated && !confirmPassword ? 'is-invalid' : ''}`} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Retype password" />
              </div>
        
              <button type="button" onClick={handleRegisterSubmit} className="btn btn-success btn-lg w-100 shadow-sm fw-semibold mb-3">Register</button>


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