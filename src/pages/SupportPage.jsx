import { Link } from 'react-router-dom'

export default function SupportPage() {
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

                {/* <Link to="/marketing-enquiries/#contact-us-form" className="btn btn-script-outline">
                Contact Us
                </Link> */}
            </div>
            </div>
        </div>
      </div>

      <div className="row g-5 justify-content-center">
        {/* ================= LEFT COLUMN (2/3) ================= */}
        <div className="col-12 p-4 p-sm-5 justify-content-center">
          {/* Back / Home button */}
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

            {/* Support Form */}
            <form className="col-lg-10">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name & Surname *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="form-control form-control-lg fs-5 rounded-pill py-3 px-4"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="company" className="form-label">
                  Company Name *
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  className="form-control form-control-lg fs-5 rounded-pill py-3 px-4"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="phone" className="form-label">
                  Phone Number *
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="form-control form-control-lg fs-5 rounded-pill py-3 px-4"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="enquiry" className="form-label">
                  Enquiry *
                </label>
                <input
                  id="enquiry"
                  name="enquiry"
                  type="text"
                  className="form-control form-control-lg fs-5 rounded-pill py-3 px-4"
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
                />
              </div>

              <button type="submit" className="btn btn-script btn-lg mb-3 shadow-sm px-5 py-2 rounded-pill">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}