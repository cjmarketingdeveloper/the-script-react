import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../reduxAuth/authSlice'; // Adjust path as needed



export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const handleLogoutClick = async (e) => {
    e.preventDefault();
    // Dispatch the logout action from authSlice
    await dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg py-3 site-header">
      <div className="container-xl">
        {/* Brand/Logo */}
        <Link className="navbar-brand" to="/">
          <div className="footer-logo mb-3">
            <img src="https://admin.thescript.co.za/assets/store/logoscript.png" alt="The Script" width={200} height={50} />
          </div>
        </Link>

        {/* Toggle button for mobile */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-3">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/') ? 'nav-active' : ''}`} to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/magazines') ? 'nav-active' : ''}`} to="/magazines">Magazines</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/podcasts') ? 'nav-active' : ''}`} to="/podcasts">Podcasts</Link>
            </li>

            {/* Profile Dropdown */}
            <li className="nav-item dropdown">
              <a 
                className="nav-link dropdown-toggle" 
                href="#" 
                id="profileDropdown" 
                role="button" 
                data-bs-toggle="dropdown"
              >
                <i className="bi bi-person-circle fs-5"></i>
              </a>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                <li>
                  <button 
                    onClick={handleLogoutClick} 
                    className="dropdown-item text-danger fw-semibold"
                  >
                    <i className="bi bi-box-arrow-right me-2"></i> Log Out
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}