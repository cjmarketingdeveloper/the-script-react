import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import * as CONSTANTS from '../CONSTANTS';

export default function SupportPage() {
  // 1. Retrieve the authenticated user from Redux state
  const user = useSelector((state) => state.auth?.user || state.user?.user || state.user);
  const token = useSelector((state) => state.auth?.token || state.user?.token || user?.token);

  // 2. Local state for form fields and UI feedback
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // 3. Form submission handler matching backend router expectation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage({ type: '', text: '' });

    const userId = user?._id || user?.id;

    if (!userId) {
      setStatusMessage({ type: 'danger', text: 'User ID not found. Please log in again.' });
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${CONSTANTS.API_URL}enquiry/submission`,
        {
          userId,
          subject,
          message,
        },
        {
          headers: {
            token: `Bearer ${token}`, // Pass token for the `verify` middleware on backend
          },
        }
      );

      setStatusMessage({
        type: 'success',
        text: res.data?.message || 'Thank you, your enquiry was submitted successfully.',
      });

      // Reset text inputs on success
      setSubject('');
      setMessage('');
    } catch (err) {
      console.error('Error submitting enquiry:', err);
      setStatusMessage({
        type: 'danger',
        text: err.response?.data?.message || err.response?.data || 'Failed to submit enquiry. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ================= HERO ================= */}
      <div className="container-xl my-5 slider-relative-container">
        <div
          className="hero-slide position-relative d-flex align-items-center"
          style={{
            backgroundImage: "url('/assets/marketing/hero1.jpg')",
            minHeight: '420px',
          }}
        >
          <div className="container-xl text-white">
            <h1 className="mb-3">Reach the Heart of South Africa's Pharmacy Industry</h1>
            <p className="mb-4 col-md-6">
              Connect with thousands of pharmacists, healthcare professionals, and decision-makers through our multi-channel platform
            </p>

            <div className="d-flex gap-3">
              <Link to="/marketing-enquiries/#marketing-solutions" className="btn btn-script">
                Our Services
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-5 justify-content-center">
        {/* ================= LEFT COLUMN (2/3) ================= */}
        <div className="col-12 p-4 p-sm-5 justify-content-center">
          <div className="container-xl my-5">
            {/* Heading + Icon */}
            <div className="d-flex align-items-center gap-3 mb-3">
              <h1 className="mb-0">Welcome to Support</h1>
              <i className="bi bi-chat-dots fs-1 text-orange" />
            </div>

            {/* Intro paragraph */}
            <p className="mb-4 col-lg-10">
              Need assistance or have an enquiry? Our support team is here to
              help. Please complete the form below and we’ll get back to you as
              soon as possible.
            </p>

            {/* Alert Messages */}
            {statusMessage.text && (
              <div className={`alert alert-${statusMessage.type} col-lg-10`} role="alert">
                {statusMessage.text}
              </div>
            )}

            {/* Support Form */}
            <form className="col-lg-10" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="userid" className="form-label">
                  User ID *
                </label>
                <input
                  id="userid"
                  name="userid"
                  type="text"
                  className="form-control form-control-lg fs-5 rounded-pill py-3 px-4 bg-light text-muted"
                  value={user?._id || user?.id || ''}
                  readOnly /* Prevents user modification */
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="subject" className="form-label">
                  Subject *
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  className="form-control form-control-lg fs-5 rounded-pill py-3 px-4"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="message" className="form-label">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  className="form-control form-control-lg fs-5 rounded-5 py-3 px-4"
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-script btn-lg mb-3 shadow-sm px-5 py-2 rounded-pill"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}