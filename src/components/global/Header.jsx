import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { logout } from '../../reduxAuth/authSlice';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Read the authenticated user directly from the Redux store
  const { user } = useSelector((state) => state.auth);
  const isAuthenticated = !!user;

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const handleLogoutClick = async (e) => {
    e.preventDefault();
    try {
      await dispatch(logout()).unwrap();
      navigate('/login'); 
    } catch (error) {
      console.error("Error signing out:", error.message || error);
    }
  };

  return (
    <Navbar expand="lg" className="py-3 site-header">
      <Container fluid="xl">
        <Navbar.Brand as={Link} to="/">
          <div className="footer-logo mb-3">
            <img
              src="/assets/logos/logo-black.svg"
              alt="The Script"
              width={200}
              height={50}
            />
          </div>
        </Navbar.Brand>

        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="ms-auto gap-3">
            <Nav.Link
              as={Link}
              to="/"
              className={isActive('/') ? 'nav-active' : ''}
            >
              Home
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/magazines"
              className={isActive('/magazines') ? 'nav-active' : ''}
            >
              Magazines
            </Nav.Link>

            {/* Only render Dashboard link if user is logged in */}
            {isAuthenticated && (
              <Nav.Link
                as={Link}
                to="/dashboard"
                className={isActive('/dashboard') ? 'nav-active' : ''}
              >
                Dashboard
              </Nav.Link>
            )}

            {/* Profile dropdown */}
            {isAuthenticated && (
              <NavDropdown
                title={<i className="bi bi-person-circle fs-5"></i>} 
                id="profile-nav-dropdown"
                align="end" 
              >
                {/* User Header Info */}
                <NavDropdown.Item text="true" className="text-muted small border-bottom pb-2">
                  Signed in as:<br/>
                  <strong>{user?.name ? `${user.name} ${user.surname || ''}` : 'User'}</strong>
                  <div>{user?.isAdmin ? 'Admin' : (user?.role || user?.roles || 'User')}</div>
                </NavDropdown.Item>

                {/* 🟢 Added My Profile link */}
                <NavDropdown.Item
                  as={Link}
                  to="/profile"
                  style={{color: 'var(--color-script-accent)'}}
                  className={isActive('/profile') ? 'fw-bold' : ''}
                >
                  <i className="bi bi-person me-2"></i> My Profile
                </NavDropdown.Item>

                <NavDropdown.Divider />

                {/* Log Out Button */}
                <NavDropdown.Item onClick={handleLogoutClick} className="text-danger fw-semibold">
                  <i className="bi bi-box-arrow-right me-2"></i> Log Out
                </NavDropdown.Item>
              </NavDropdown>
            )}

            {!isAuthenticated && (
              <Nav.Link as={Link} to="/login" className="btn btn-outline-primary px-3 py-1">
                Sign In
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}