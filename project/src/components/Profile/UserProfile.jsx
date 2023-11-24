import { Col, Container, Row } from "react-bootstrap";
import './Profile.css'
import Header from "../Home/Header";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
const UserProfile = () => {
    const userName = localStorage.getItem("userName");
     const userImg = localStorage.getItem("userImg");
     const userBio = localStorage.getItem("userBio");
    return (
      <>
        <Header />
        <Container
          fluid
          style={{ backgroundColor: "#f3f3f3", paddingBottom: "20px" }}
        >
          <Row style={{ width: "95%", margin: "auto" }}>
            <Row className="profile-container">
              <Col xs={12} className="profile">
                <img src={userImg} alt={userName} />
                <h2>{userName}</h2>
                <p>{userBio}</p>
              </Col>
            </Row>
            <Row className="profile-btn">
              <Col xs={12}>
                <Link to='/settings'>
                  <i class="bi bi-gear-fill"></i> Edit Profile Settings
                </Link>
              </Col>
            </Row>
          </Row>
        </Container>
      </>
    );
}
 
export default UserProfile;