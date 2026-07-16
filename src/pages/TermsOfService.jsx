import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function TermsOfService() {
  const termsSections = [
    {
      title: '1. Use of Our Services',
      content:
        'You agree to use our services only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else’s use of the platform.'
    },
    {
      title: '2. Intellectual Property',
      content:
        'All content published by The Script, including articles, magazines, podcasts, images, branding, and designs, is the intellectual property of The Script unless otherwise stated.\n\nYou may not reproduce, distribute, or commercially exploit any content without prior written permission.'
    },
    {
      title: '3. Subscriptions & Access',
      content:
        'Some content or services may require a subscription or registration. You are responsible for maintaining the confidentiality of your account details and for all activities under your account.'
    },
    {
      title: '4. Marketing & Advertising',
      content:
        'Advertising and sponsored content featured on The Script is subject to separate commercial agreements. The Script is not responsible for third-party products or services advertised on the platform.'
    },
    {
      title: '5. User Submissions',
      content:
        'Any information or content you submit (including enquiries or forms) must be accurate and lawful. By submitting content, you grant The Script permission to use it for communication and service purposes.'
    },
    {
      title: '6. Limitation of Liability',
      content:
        'The Script shall not be liable for any indirect, incidental, or consequential damages arising from your use of our services or content.'
    },
    {
      title: '7. Termination',
      content:
        'We reserve the right to suspend or terminate access to our services if these terms are violated or if misuse is detected.'
    },
    {
      title: '8. Changes to These Terms',
      content:
        'We may update these Terms of Service from time to time. Continued use of our services after changes indicates acceptance of the revised terms.'
    },
    {
      title: '9. Governing Law',
      content:
        'These terms are governed by the laws of South Africa. Any disputes shall be subject to the jurisdiction of South African courts.'
    },
    {
      title: '10. Contact Us',
      content:
        'If you have any questions about these Terms of Service, please contact us via the Support page.'
    }
  ]

  // Track which sections are open (initialized as an empty object)
  const [openSections, setOpenSections] = useState({})

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  return (
    <>
      {/* ================= HERO ================= */}
      <div className="container-xl my-5">
        <Link
          to="/"
          className="btn btn-outline-orange mb-4 d-inline-flex align-items-center gap-2"
        >
          <i className="bi bi-arrow-left" />
          Home
        </Link>

        <h1 className="mb-3">Terms of Service</h1>
        <p className="text-muted">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="container-xl mb-5">
        <div className="col-lg-9">
          <p>
            Welcome to <strong>The Script</strong>. By accessing or using our
            website, services, magazines, podcasts, or digital platforms, you
            agree to be bound by these Terms of Service.
          </p>

          {termsSections.map((section, idx) => (
            <div key={idx} className="mb-3">
              <button
                type="button"
                className="btn btn-outline-orange w-100 text-start d-flex justify-content-between align-items-center"
                onClick={() => toggleSection(idx)}
                style={{ fontWeight: 'bold' }}
              >
                {section.title}
                <i
                  className={`bi ${
                    openSections[idx] ? 'bi-chevron-up' : 'bi-chevron-down'
                  }`}
                />
              </button>
              {openSections[idx] && (
                <div className="mt-2 ps-3">
                  {section.content.split('\n').map((line, i) => (
                    <p key={i} className="mb-1 text-muted">
                      {line.includes('Support') ? (
                        <Link to="/support">Support</Link>
                      ) : (
                        line
                      )}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}