// import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { NavLink, useNavigate} from "react-router-dom";
// import axios from "axios";

const Header = () => {
  const userToken = localStorage.getItem("userToken");
  const username = localStorage.getItem("userName");
  const img = localStorage.getItem("userImg");
  const navigate = useNavigate();
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
      <Row className="header-position">
        <Col xs={4} lg={5} className="d-flex logo">
          <p style={{ cursor: "pointer",margin:'0px 0px 0px' }} onClick={handleClickLogo}>
            conduit
          </p>
        </Col>
        <Col xs={1} lg={2} style={{display:'none'}}></Col>
        <Col xs={7} lg={5} className="nav-position">
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
    </Container>
  );
};

export default Header;
