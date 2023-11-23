import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const Header = () => {

  const userToken = localStorage.getItem("userToken");
  console.log("Header: "+userToken)
  
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
              <NavLink to="/editor">New Article</NavLink>
              <NavLink to="/settings">Settings</NavLink>
              <NavLink to="/">...</NavLink>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Header;

