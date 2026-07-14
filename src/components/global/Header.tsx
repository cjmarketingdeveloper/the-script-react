import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import React from 'react';

export default function Header() {
  const location = useLocation()

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/'
    return location.pathname.startsWith(href)
  }

  // Inside your Header component:
  const { logout } = useAuth() as any;
  const navigate = useNavigate();

  const handleLogoutClick = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    try {
      await logout();
      navigate('/login'); 
    } catch (error: any) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <Navbar expand="lg" className="py-3 site-header">
      <Container fluid="xl">
        <Navbar.Brand as={Link} to="/">
              {/* Replace with your logo */}
            <div className="footer-logo mb-3">
              {/* Replace with your logo */}
              <img
                src="/assets/logos/logo-black.png"
                alt="The Script"
                width={200}
                height={50}
                // unoptimized
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

            <Nav.Link
              as={Link}
              to="/podcasts"
              className={isActive('/podcasts') ? 'nav-active' : ''}
            >
              Podcasts
            </Nav.Link>

            <NavDropdown
              title={<i className="bi bi-person-circle fs-5"></i>} // Uses your icon as the clickable trigger
              id="profile-nav-dropdown"
              align="end" // Aligns the dropdown menu to the right edge so it doesn't clip off-screen
            >
              <NavDropdown.Item onClick={handleLogoutClick} className="text-danger fw-semibold">
                <i className="bi bi-box-arrow-right me-2"></i> Log Out
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
