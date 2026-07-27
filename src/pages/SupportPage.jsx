import { Link } from 'react-router-dom'

export default function SupportPage() {
  return (
    <>
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
                  className="form-control form-control-lg fs-5 rounded-pill py-3 px-4"
                  rows="4"
                />
              </div>

              <button type="submit" className="btn btn-script btn-lg mb-3 shadow-sm px-5 py-2 rounded-pill w-100">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}