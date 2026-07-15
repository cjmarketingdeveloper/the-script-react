import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

    const handleResetRequest = async () => {
    setError('');
    setMessage('');

    if (!email) return setError("Please enter your email address.");

    setLoading(true);
    try {
        // // 🟢 Supabase will automatically check auth.users internally.
        // // Because Enumeration Protection is OFF, it throws an error if the email isn't found!
        // const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        // redirectTo: `${window.location.origin}/reset-password`,
        // });

        // if (resetError) {
        // // Catching the explicit "User not found" error from auth.users
        // if (resetError.message.toLowerCase().includes("user not found") || resetError.status === 400) {
        //     return setError("This email address is not registered in our system.");
        // }
        // throw resetError;
        // }
        // console.log("Password reset email sent successfully to:", email);
        // setMessage("A unique password reset link has been sent to your email.");
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
    };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundImage: "url('/assets/hero/mag1.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="container">
        <div className="row justify-content-center m-0">
          <div className="col-12 col-sm-8 col-md-6 col-lg-4">
            <div className="p-4 p-sm-5 border rounded-3 shadow bg-white bg-opacity-95" style={{ backdropFilter: 'blur(5px)' }}>
              <h3 className="mb-3 text-center fw-bold text-dark">Reset Password</h3>
              <p className="text-muted small text-center mb-4">Enter your registered email address below to receive an isolated access recovery framework connection link.</p>
              
              {error && <div className="alert alert-danger p-2 small text-center">{error}</div>}
              {message && <div className="alert alert-success p-2 small text-center">{message}</div>}

              <div className="mb-4">
                <label htmlFor="resetEmail" className="form-label fw-semibold text-secondary">Email address</label>
                <input id="resetEmail" type="email" className="form-control form-control-lg" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
              </div>

              <button type="button" onClick={handleResetRequest} disabled={loading} className="btn btn-primary btn-lg w-100 shadow-sm fw-semibold mb-3">
                {loading ? "Verifying..." : "Send Reset Link"}
              </button>

              <p className="text-center small text-muted mb-0">
                Remember your credentials? <Link to="/login" className="text-decoration-none">Back to Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}