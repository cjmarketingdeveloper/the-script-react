export default function AboutSection() {
  return (
    <section className="about-full area-section">
        <div className="row align-items-center">
          
          {/* LEFT IMAGE */}
          <div className="col-md-5">
            <div
              className="about-img"
              style={{ backgroundImage: "url('/assets/aboutimage/1.jpg')" }}
            />
          </div>

          {/* RIGHT CONTENT */}
          <div className="col-md-7 ">
            <div className="about-content pr-m-3">
              <h2>About The Script</h2>
              <h5 className="text-secondary font-weight-light">Pharmacy Expertise and Wellness Insights</h5>
              <p className="w-100 mw-100 font-weight-light">
                The Script is a magazine and hub designed to support both consumers and local independent pharmacies. From practical wellness guides to deep dives into emerging health tech, The Script helps readers make informed decisions while empowering pharmacies with up-to-date knowledge, patient-ready resources, and content they can share directly with their communities. The Script is your trusted source for pharmacy news and insights brought to you by CJ Distribution
              </p>
              <ul className="list-unstyled mt-3">
                <li className="d-flex align-items-start mb-2">
                  <i className="bi bi-capsule me-2 mt-1 font-weight-light" style={{ color: 'var(--color-script-main)' }}></i>
                  <span><strong style={{ color: 'var(--color-script-main)' }}>Expert-Led Content:</strong> Pharmacy professionals, health specialists, and industry innovators sharing trusted knowledge.</span>
                </li>
                <li className="d-flex align-items-start mb-2">
                  <i className="bi bi-capsule me-2 mt-1 font-weight-light" style={{ color: 'var(--color-script-main)' }}></i>
                  <span><strong style={{ color: 'var(--color-script-main)' }}>Supporting Local Pharmacies:</strong> Content, tools, and resources created to strengthen independent pharmacy businesses and patient relationships.</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
    </section>
  )
}
