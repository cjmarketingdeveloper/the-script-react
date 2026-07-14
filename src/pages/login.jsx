import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 🟢 We change this from a form submit handler to a standard function
  const handleLoginSubmit = async () => {
    setError('');
    
    if (!email || !password) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      await loginWithEmail(email, password);
      navigate('/'); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundImage: "url('/assets/hero/mag1.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', overflowY: 'auto' }}>
      <div className="container">
        <div className="row justify-content-center m-0">
          <div className="col-12 col-sm-8 col-md-6 col-lg-4">
            
            {/* 🟢 CHANGE: Changed from <form> to a standard <div> to stop iframe sandboxing bugs */}
            <div className="p-4 p-sm-5 border rounded-3 shadow bg-white bg-opacity-95" style={{ backdropFilter: 'blur(5px)' }}>
              <h3 className="mb-4 text-center fw-bold text-dark">Sign In</h3>
              
              {error && <div className="alert alert-danger p-2 small text-center">{error}</div>}

              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary">Email address</label>
                <input 
                  type="email" 
                  className="form-control form-control-lg" 
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

              {/* Inside Login.jsx - underneath the password input block */}
              <div className="mb-4 text-end">
                <Link to="/forgot-password" className="small text-decoration-none fw-semibold text-primary">
                  Forgot password?
                </Link>
              </div>
              
              {/* 🟢 CHANGE: type="button" and added onClick handler */}
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
            </div> {/* 🟢 CHANGE: Ends in </div> */}

          </div>
        </div>
      </div>
    </div>
  );
}