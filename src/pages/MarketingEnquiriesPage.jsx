import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

export default function MarketingEnquiriesPage() {
  // 1. Get user and token from Redux
  const user = useSelector((state) => state.auth?.user || state.user?.user || state.user);
  const token = useSelector((state) => state.auth?.token || state.user?.token || user?.token);

  // 2. Local form state
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // 3. Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage({ type: '', text: '' });

    const userId = user?._id || user?.id;

    if (!userId) {
      setStatusMessage({ type: 'danger', text: 'User ID not found. Please log in.' });
      setLoading(false);
      return;
    }

    try {
      // Direct API path (adjust base URL if needed)
      const API_URL = process.env.REACT_APP_API_URL || 'https://admin.thescript.co.za/api/';
      
      const res = await axios.post(
        `${API_URL}enquiry/submission`,
        { userId, subject, message },
        { headers: { token: `Bearer ${token}` } }
      );

      setStatusMessage({
        type: 'success',
        text: res.data?.message || 'Thank you, your enquiry was submitted successfully.',
      });

      setSubject('');
      setMessage('');
    } catch (err) {
      console.error('Error submitting enquiry:', err);
      setStatusMessage({
        type: 'danger',
        text: err.response?.data?.message || err.response?.data || 'Failed to submit enquiry.',
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

              <Link to="/marketing-enquiries/#contact-us-form" className="btn btn-script-outline">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ================= WHY US ================= */}
      <div className="container-xl my-5">
        <h2 className="text-center mb-5">Why Us</h2>

        <div className="row text-center g-4">
          <div className="col-md-4">
            <i className="bi bi-people fs-1 text-orange" />
            <h5 className="mt-3">12,000+</h5>
            <p>Active Subscribers across print and digital platforms.</p>
          </div>

          <div className="col-md-4">
            <i className="bi bi-megaphone fs-1 text-orange" />
            <h5 className="mt-3">Niche Audience</h5>
            <p>Direct access to independent pharmacy owners, corporate retail, and clinic sisters.</p>
          </div>

          <div className="col-md-4">
            <i className="bi bi-bar-chart fs-1 text-orange" />
            <h5 className="mt-3">360 Exposure</h5>
            <p>Integrated campaigns across Magazine, Website, Social Media, and Podcast.</p>
          </div>
        </div>
      </div>

      {/* ================= MARKETING SOLUTIONS ================= */}
      <div id="marketing-solutions" className="container-xl my-5">
        <h2 className="text-center mb-2">Marketing Solutions</h2>
        <p className="text-center mb-5 text-muted">Choose Platform</p>

        <div className="row g-4">
          {/* Magazine */}
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <img src="/assets/marketing/mag.png" className="card-img-top" alt="Magazine Advertising" />
              <div className="card-body">
                <h5 className="card-title">Print & Digital Magazine</h5>
                <p className="card-text">
                  Full-page ads, advertorials, and product spotlights in South Africa's leading pharmacy publication.
                </p>
              </div>
              <div className="card-footer bg-white border-0">
                <Link to="/marketing-enquiries/#contact-us-form" className="btn btn-script w-100">
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>

          {/* Digital */}
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <img src="/assets/marketing/digital.png" className="card-img-top" alt="Digital Campaigns" />
              <div className="card-body">
                <h5 className="card-title">Digital Hub & Digital Marketing</h5>
                <p className="card-text">UX & Designs, Websites, Mobile Apps, Social Media Marketing.</p>
              </div>
              <div className="card-footer bg-white border-0">
                <Link to="/marketing-enquiries/#contact-us-form" className="btn btn-script w-100">
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>

          {/* Podcasts */}
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <img src="/assets/marketing/pod.png" className="card-img-top" alt="Podcast Sponsorship" />
              <div className="card-body">
                <h5 className="card-title">The Script Podcast</h5>
                <p className="card-text">
                  Episode sponsorships, host-read ads, and guest expert slots. Engage listeners with audio storytelling.
                </p>
              </div>
              <div className="card-footer bg-white border-0">
                <Link to="/marketing-enquiries/#contact-us-form" className="btn btn-script w-100">
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= ENQUIRY FORM ================= */}
      <div
        className="container-fluid py-5"
        style={{
          backgroundImage: "url('/assets/sub/subscribeimage.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div id="contact-us-form" className="container-xl py-5">
          <div className="row py-5">
            {/* Left Text */}
            <div className="col-md-6 text-white mb-4 mb-md-0">
              <h2>Enquiry Form</h2>
              <p>
                Fill out the form to get in touch with our marketing team. Our team will respond promptly with the information you need.
              </p>
            </div>

            {/* Right Form */}
            <div className="col-md-6">
              <div className="p-4 bg-white rounded-0">
                {statusMessage.text && (
                  <div className={`alert alert-${statusMessage.type} mb-3`} role="alert">
                    {statusMessage.text}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="userid" className="form-label">User ID *</label>
                    <input
                      type="text"
                      className="form-control form-control-lg fs-5 rounded-pill py-3 px-4 bg-light text-muted"
                      id="userid"
                      value={user?._id || user?.id || ''}
                      readOnly
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="subject" className="form-label">Subject *</label>
                    <input
                      type="text"
                      className="form-control form-control-lg fs-5 rounded-pill py-3 px-4"
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="message" className="form-label">Message</label>
                    <textarea
                      className="form-control form-control-lg fs-5 rounded-5 py-3 px-4"
                      id="message"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-script w-100" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}