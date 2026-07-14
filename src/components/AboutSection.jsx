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
          <div className="col-md-7">
            <div className="about-content">
              <h2>About The Script</h2>
              <p>
                The Script is a magazine and podcast focused on storytelling,
                creativity, and behind-the-scenes insights across the pharmacy
                and media space.
              </p>
            </div>
          </div>

        </div>
    </section>
  )
}
