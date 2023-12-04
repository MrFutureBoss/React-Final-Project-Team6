import { Col, Container, Row } from "react-bootstrap";
import "./Profile.css";
import Header from "../Home/Header";
import { Link, useParams } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useEffect, useState } from "react";
import axios from "axios";

import MyArticle from "./MyArticle";
import FavoriteArticle from "./FavoriteArticle";

const UserProfile = () => {
  const { pusername } = useParams();
  const [toggle, setToggle] = useState(true)
  const [data,setData] = useState([])
  const url = pusername.slice(1);
  console.log(url)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        let config = {
          method: "get",
          maxBodyLength: Infinity,
          url: `https://api.realworld.io/api/profiles/${url}`,
          // headers:{
          //   Authorization: `Bearer ${userToken}`,
          // }
        };

        const response = await axios.request(config);
        console.log(response)
        setData(response.data.profile)
      } catch (error) {
          console.log(error); 
        
      }
    };
    fetchData();
  }, [url]);


  return (
    <>
      <Header />
      <Container
        fluid
        style={{
          backgroundColor: "#f3f3f3",
          paddingBottom: "20px",
          marginBottom: "30px",
        }}
      >
        <Row style={{ width: "95%", margin: "auto" }}>
          <Row className="profile-container">
            <Col xs={12} className="profile">
              <img src={data.image} alt={data.username} />
              <h2>{data.username}</h2>
              <p>{data.bio}</p>
            </Col>
          </Row>
          <Row className="profile-btn">
            <Col xs={12}>
              <Link to="/settings" className="">
                <i className="bi bi-gear-fill"></i> Edit Profile Settings
              </Link>
            </Col>
          </Row>
        </Row>
      </Container>
      <Container className="article-container">
        <Row className="profile-bar">
          <Col xs={12} md={10}>
            <ul className="bar-content" style={{ padding: "0" }}>
              <li className={toggle ? "active" : ""}>
                <Link
                  to={`/${pusername}`}
                  onClick={() => setToggle(!toggle)}
                  className={toggle ? "active" : ""}
                >
                  My Articles
                </Link>
              </li>
              <li className={!toggle ? "active" : ""}>
                <Link
                  to={`/${pusername}/favorites`}
                  onClick={() => setToggle(!toggle)}
                  className={!toggle ? "active" : ""}
                >
                  Favorited Articles
                </Link>
              </li>
            </ul>
          </Col>
        </Row>
        <Row style={{width:'100%'}}>
          <Col xs={12}>
            {toggle ? <MyArticle /> : <FavoriteArticle />}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default UserProfile;

