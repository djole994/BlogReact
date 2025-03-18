import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import "./Navigation.css";

const Navigation = ({ user, setUser }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
  };

  return (
    <Navbar
      expand="lg"
      fixed="top"
      className={`custom-navbar ${scrolled ? "scrolled" : ""}`}
    >
      <Container>
        <Navbar.Brand as={Link} to="/">
        <img src="/img/logo.png" alt="MyBlog Logo" height="80" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Glavni linkovi */}
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/posts">
              Posts
            </Nav.Link>
            {user && (
              <Nav.Link as={Link} to="/create-post">
                New Post
              </Nav.Link>
            )}
          </Nav>

          {/* Društvene mreže */}
          <Nav className="social-icons d-none d-lg-flex">
            <Nav.Link href="https://facebook.com" target="_blank">
              <FaFacebook />
            </Nav.Link>
            <Nav.Link href="https://twitter.com" target="_blank">
              <FaTwitter />
            </Nav.Link>
            <Nav.Link href="https://instagram.com" target="_blank">
              <FaInstagram />
            </Nav.Link>
          </Nav>

          {/* Login/Logout */}
          <Nav>
            {user ? (
              <>
                <Navbar.Text className="me-3">Hello, {user}!</Navbar.Text>
                <Button variant={scrolled ? "outline-light" : "outline-dark"} onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
