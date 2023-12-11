import { Container, Col, Row } from "react-bootstrap";
import "./style.css";
import Header from "./Header";
import Banner from "./Banner";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GlobalFeed from "./GlobalFeed";
import YourFeed from "./YourFeed";
import Tag from "./Tag";
import PopularTag from "./PopularTag";

const Home = () => {
  const userToken = localStorage.getItem("userToken");
  const [followedAuthor, setFollowedAuthor] = useState(null);
  const [activeTab, setActiveTab] = useState("global");
  const [tag, setTag] = useState();



  const handleYourFeed = () => {
    setFollowedAuthor(/* Set the followed author */);
    setActiveTab("yourFeed");
  };

  const handleGlobalFeed = () => {
    setFollowedAuthor(null); // Reset the followed author
    setActiveTab("global");
  };

  const handleDataChange = (data) => {
     setActiveTab("tag")
     setTag(data)
  }

  return (
    <>
      <Header />
      <Banner />
      <br /> <br />
      <Container style={{marginBottom:"40px"}}>
        <div className="pr-32 pl-32 pt-10 row">
          <div className="col-md-9">
            <div
              className="feed-toggle"
              style={{ borderBottom: "1px solid lightgray" }}
            >
              <ul className="nav nav-pills feed-item">
                {userToken && (
                  <li className="nav-item" style={{ padding: "0px" }}>
                    <Link
                      className={`nav-link feed-tag ${
                        activeTab === "yourFeed" && !tag ? "active" : ""
                      }`}
                      onClick={handleYourFeed}
                    >
                      Your Feed
                    </Link>
                  </li>
                )}
                <li className="nav-item" style={{ padding: "0px" }}>
                  <Link
                    className={`nav-link feed-tag ${
                      activeTab === "global" && !tag ? "active" : ""
                    }`}
                    onClick={handleGlobalFeed}
                  >
                    Global Feed
                  </Link>
                </li>

                {tag && (
                  <li className="nav-item" style={{ padding: "0px", display:activeTab==="tag"? "block" : "none" }}>
                    <Link
                      className={`nav-link feed-tag ${
                        activeTab === "tag" ? "active" : ""
                      }`}
                    >
                      # {tag}
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            {activeTab === "tag" ? (
              <Tag getTag={tag} />
            ) : activeTab === "global" ? (
              <GlobalFeed />
            ) : (
              <YourFeed />
            )}
            {/* 
          {activeTab === 'yourFeed' ? <Feed  followedAuthor={'https://api.realworld.io/api/articles/feed'}/> : <Feed  followedAuthor={'https://api.realworld.io/api/articles'}/>} */}
          </div>
          <div className="col-md-3">
            <PopularTag setSelectedTag={handleDataChange} />
          </div>
        </div>
      </Container>
    </>
  );
};

export default Home;
