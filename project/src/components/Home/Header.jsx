import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

const Header = () => {
  const userToken = localStorage.getItem("userToken");
  const userImg = localStorage.getItem("userImg");
  const userName = localStorage.getItem("userName");
  console.log("Header: " + userToken);
  const clearToken = () => {
    localStorage.removeItem("userImg");
    localStorage.removeItem("userToken");
    localStorage.removeItem("userBio");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("currentPass");
    window.location.reload();
  };
  return (
    <Container fluid className="header-container">
      <Row className="header-position">
        <Col xs={6} className="d-flex logo">
          conduit
        </Col>
        <Col xs={6} className="nav-position">
          <NavLink to="/">Home</NavLink>
          {userToken == null ? (
            <>
              <NavLink to="/login">Sign in</NavLink>
              <NavLink to="/register">Sign up</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/editor">
                <i class="bi bi-pencil-square"></i> New Article
              </NavLink>
              <NavLink to="/settings">
                <i class="bi bi-gear-fill"></i> Settings
              </NavLink>
              <NavLink to={`/@${userName}`} className="nav-profile">
                <img src={userImg} className="nav-profileimg" alt={userName} />
                <p>{userName}</p>
              </NavLink>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Header;
