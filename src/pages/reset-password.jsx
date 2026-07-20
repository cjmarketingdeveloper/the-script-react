import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [verifying, setVerifying] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 🟢 Verify that Supabase successfully processed the hash token in the URL
    const checkRecoverySession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError("Your password recovery session has expired or is invalid. Please request a new link.");
      }
      setVerifying(false);
    };

    checkRecoverySession();
  }, []);

  const handleUpdatePassword = async () => {
    setError('');
    setMessage('');

    if (!newPassword || !confirmPassword) return setError("Please fill out both parameters.");
    if (newPassword !== confirmPassword) return setError("Passwords do not match.");
    if (newPassword.length < 6) return setError("Password must be at least 6 characters.");

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      setMessage("Password updated successfully! Redirecting you to login...");
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (verifying) {
    return (
      <div className="d-flex justify-content-center align-items-center bg-light" style={{ width: '100vw', height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundImage: "url('/assets/hero/mag1.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="container">
        <div className="row justify-content-center m-0">
          <div className="col-12 col-sm-8 col-md-6 col-lg-4">
            <div className="p-4 p-sm-5 border rounded-3 shadow bg-white bg-opacity-95" style={{ backdropFilter: 'blur(5px)' }}>
              <h3 className="mb-4 text-center fw-bold text-dark">Enter New Password</h3>
              
              {error && <div className="alert alert-danger p-2 small text-center">{error}</div>}
              {message && <div className="alert alert-success p-2 small text-center">{message}</div>}

              {!message && (
                <>
                  <div className="mb-3">
                    <label htmlFor="newPasswordInput" className="form-label fw-semibold text-secondary">New Password</label>
                    <input id="newPasswordInput" type="password" className="form-control" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="At least 6 characters" />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="confirmNewPasswordInput" className="form-label fw-semibold text-secondary">Confirm New Password</label>
                    <input id="confirmNewPasswordInput" type="password" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Retype new password" />
                  </div>

                  <button type="button" onClick={handleUpdatePassword} className="btn btn-success btn-lg w-100 shadow-sm fw-semibold">
                    Update Password
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}