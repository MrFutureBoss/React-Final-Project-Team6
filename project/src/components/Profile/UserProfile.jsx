import { Col, Container, Row } from "react-bootstrap";
import "./Profile.css";
import Header from "../Home/Header";
import { Link, useNavigate, useParams } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useEffect, useState } from "react";
import axios from "axios";
import MyArticle from "./MyArticle";
import FavoriteArticle from "./FavoriteArticle";

const UserProfile = () => {
  const { pusername } = useParams();
  const [toggle, setToggle] = useState(true);
  const [data, setData] = useState([]);
  const url = pusername.charAt(0) === "@" ? pusername.slice(1) : pusername;
  const navigate = useNavigate();
  const signup = useNavigate();
  const userToken = localStorage.getItem("userToken");
  const userName = localStorage.getItem("userName");
  console.log(url);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let config = {
          method: "get",
          maxBodyLength: Infinity,
          url: `https://api.realworld.io/api/profiles/${url}`,
        };

        const response = await axios.request(config);
        console.log(response);
        setData(response.data.profile);
      } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 404) {
          navigate("/");
        }
      }
    };
    fetchData();
  }, [url]);

  //Follow or unfollow
  const handleFollowing = async (username, following) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      };

      let response;

      if (!following) {
        // If the article is not follow, send a POST request to favorite it
        response = await axios.post(
          `https://api.realworld.io/api/profiles/${username}/follow`,
          null,
          config
        );
        console.log(response);
      } else {
        // If the article is follow send a DELETE request to remove it from favorites
        response = await axios.delete(
          `https://api.realworld.io/api/profiles/${username}/follow`,
          config
        );
      }

      // Use the functional form of setArticle to ensure you're working with the latest state
      setData((prevState) => ({
        ...prevState,
        following: !following,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignUp = () => {
    signup("/register");
  };

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
              {url === userName ? (
                <Link to="/settings" className="">
                  <i className="bi bi-gear-fill"></i> Edit Profile Settings
                </Link>
              ) : (
                <>
                  {!data.following ? (
                    <button
                      className="profile-follow"
                      onClick={
                        userToken === null
                          ? handleSignUp
                          : () => handleFollowing(data.username, data.following)
                      }
                    >
                      <i className="bi bi-plus-lg"></i>&nbsp;Follow&nbsp;
                      {data.username}
                    </button>
                  ) : (
                    <button
                      className="profile-unfollow"
                      onClick={() =>
                        handleFollowing(data.username, data.following)
                      }
                    >
                      <i className="bi bi-plus-lg"></i>
                      &nbsp;Unfollow&nbsp;
                      {data.username}
                    </button>
                  )}
                </>
              )}
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
        <Row style={{ width: "100%" }}>
          <Col xs={12}>{toggle ? <MyArticle /> : <FavoriteArticle />}</Col>
        </Row>
      </Container>
    </>
  );
};
// {userName===author.username ? (edit) : {!author.following ? (follow) : (unfollow)}}
//{userName===author.username ? (<FavoritedArticle/>) : (<p>No article</p>)}
export default UserProfile;
