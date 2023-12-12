// import React, { useState, useEffect } from "react";
import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link, NavLink, useNavigate} from "react-router-dom";
// import axios from "axios";

const Header = () => {
  const userToken = localStorage.getItem("userToken");
  const username = localStorage.getItem("userName");
  const img = localStorage.getItem("userImg");
  const navigate = useNavigate();
   const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

   const toggleMobileMenu = () => {
     setMobileMenuOpen(!isMobileMenuOpen);
   };

  // const [img, setImg] = useState("");
  // const [username, setUserName] = useState("");

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       let config = {
  //         method: "get",
  //         maxBodyLength: Infinity,
  //         url: "https://api.realworld.io/api/user",
  //         headers: {
  //           Authorization: `Bearer ${userToken}`,
  //         },
  //       };

  //       const response = await axios.request(config);
  //       setUserName(response.data.user.username);
  //       setImg(response.data.user.image);
  //     } catch (error) {
  //       if (error.response.status === 401 && userToken==null) {
  //         console.clear();  //Turn off unauthorization
  //         console.log("Need login")
  //       } else {
  //         console.log(error); // Handle other errors
  //       }
  //     }
  //   };

  //   fetchData();
  // }, [userToken]);

 const handleClickLogo = () => {
   navigate("/");
 };

  return (
    <Container fluid className="header-container">
      <Row className="header-position" style={{ margin: "0px" }}>
        <Col xs={12} lg={5} sm={4} className="d-flex logo">
          <p
            style={{ cursor: "pointer", margin: "0px 0px 0px" }}
            onClick={handleClickLogo}
          >
            conduit
          </p>
        </Col>
        <Col xs={0} lg={2} sm={0} style={{ display: "none" }}></Col>
        <Col xs={12} lg={5} sm={8} className="nav-position">
          <NavLink to="/">Home</NavLink>
          {userToken == null ? (
            <>
              <NavLink to="/login">Sign in</NavLink>
              <NavLink to="/register">Sign up</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/editor">
                <i className="bi bi-pencil-square"></i> New Article
              </NavLink>
              <NavLink to="/settings">
                <i className="bi bi-gear-fill"></i> Settings
              </NavLink>
              <NavLink to={`/@${username}`} className="nav-profile">
                <img src={img} className="nav-profileimg" alt={username} />
                <p>{username}</p>
              </NavLink>
            </>
          )}
        </Col>
      </Row>
      <Row className="menu">
        <Col xs={6} lg={6} sm={6} className="d-flex logo">
          <p
            style={{ cursor: "pointer", margin: "0px 0px 0px" }}
            onClick={handleClickLogo}
          >
            conduit
          </p>
        </Col>
        <Col
          xs={6}
          lg={6}
          sm={6}
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          style={{ display: isMobileMenuOpen ? "none" : "block" }}
        >
          ☰
        </Col>
        {isMobileMenuOpen && (
          <Row>
            <Col xs={12} className="mobile-menu">
              <div
                className="exit-menu"
                onClick={toggleMobileMenu}
                style={{ color: "#fff" }}
              >
                <p>X</p>
              </div>
              {userToken == null ? (
                <>
                  <NavLink to="/login">Sign in</NavLink>
                  <NavLink to="/register">Sign up</NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/editor">
                    <i className="bi bi-pencil-square"></i> New Article
                  </NavLink>
                  <NavLink to="/settings">
                    <i className="bi bi-gear-fill"></i> Settings
                  </NavLink>
                  <NavLink to={`/@${username}`} className="nav-profile">
                    <img src={img} className="nav-profileimg" alt={username} />
                    <p>{username}</p>
                  </NavLink>
                </>
              )}
            </Col>
          </Row>
        )}
      </Row>
    </Container>
  );
};

export default Header;
