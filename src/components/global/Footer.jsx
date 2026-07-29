import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <>
      {/* ===== MAIN FOOTER (ORANGE) ===== */}
      <footer className="site-footer">
        <div className="container-xl">
          <div className="row gy-4">

            {/* COLUMN 1 */}
            <div className="col-md-3">
              <img
                src="/assets/logos/logo-white.svg"
                alt="The Script"
                width={140}
                height={40}
              />
              {/* <div className="footer-socials mt-3">
                <Link to="https://www.instagram.com/?hl=en"><i className="bi bi-instagram"></i></Link>
                <Link to="https://twitter.com/?lang=en"><i className="bi bi-twitter-x"></i></Link>
                <Link to="https://www.facebook.com/?locale=en_GB"><i className="bi bi-facebook"></i></Link>
                <Link to="https://www.linkedin.com/in/the-script-789012345/"><i className="bi bi-linkedin"></i></Link>
              </div> */}
            </div>

            {/* COLUMN 2 */}
            <div className="col-md-3">
              <h6 className="footer-title">Explore</h6>
              <ul className="footer-links">
                <li><Link to="/podcasts">Podcasts</Link></li>
                <li><Link to="/magazines">Magazines</Link></li>
              </ul>
            </div>

            {/* COLUMN 3 */}
            <div className="col-md-3">
              <h6 className="footer-title">Contact Us</h6>
              <p>
                <Link to="mailto:cjdigital@cjmarketing.co">
                  cjdigital@cjmarketing.co
                </Link>
              </p>
            </div>

            {/* COLUMN 4 */}
            <div className="col-md-3">
              <h6 className="footer-title">Resources</h6>
              <ul className="footer-links">
                <li><Link to="/magazine-archive">Magazine Archive</Link></li>
                <li><Link to="/marketing-enquiries">Marketing Enquiries</Link></li>
                <li><Link to="/terms-of-service">Terms of Service</Link></li>
                <li><Link to="/support">Support</Link></li>
              </ul>
            </div>

          </div>
        </div>
      </footer>

      {/* ===== COPYRIGHT BAR (BLUE) ===== */}
      <div className="footer-copyright">
        © {new Date().getFullYear()} The Script. Launched by <Link to="https://cjmarketing.co/">CJ Marketing</Link>.
      </div>
    </>
    )
    }