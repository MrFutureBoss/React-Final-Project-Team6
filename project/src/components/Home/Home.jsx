import { Container, Col, Row } from "react-bootstrap";
import "./style.css";
import Header from "./Header";
import Banner from "./Banner";
import Footer from "./Footer";

import Pagination from "react-bootstrap/Pagination";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [articlesCount, setArticlesCount] = useState(0);
  const userToken = localStorage.getItem("userToken");
  const [n1Articles, setn1Articles] = useState([]);
  const [followedAuthor, setFollowedAuthor] = useState(null);
  const [activeTab, setActiveTab] = useState("global");
  const [tag, setTag] = useState();

  useEffect(() => {
    const setDefaultToken = async () => {
      axios.defaults.headers.common["Authorization"] =
        await `Bearer ${localStorage.getItem("userToken")}`;
    };
    setDefaultToken();
  }, [userToken]);

  const nav = useNavigate();
  const limit = 10;
  const offset = (activePage - 1) * limit;

  const fetchData = async () => {
    try {
      if (userToken) {
        const response = await axios.get(
          `https://api.realworld.io/api/articles${
            activeTab === "yourFeed" ? "/feed" : ""
          }?limit=${limit}&offset=${offset}${tag ? `&tag=${tag}` : ""}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        setArticles(response.data.articles);
        setArticlesCount(response.data.articlesCount);
      } else {
        console.log("hello");
        const response = await axios.get(
          `https://api.realworld.io/api/articles?limit=${limit}&offset=${offset}${
            tag ? `&tag=${tag}` : ""
          }`
        );
        setArticles(response.data.articles);
        setArticlesCount(response.data.articlesCount);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };
  useEffect(() => {
    fetchData(); // Call the fetchData function
  }, [userToken]);

  const handlePageChange = async (pageNumber) => {
    console.log(pageNumber);
    fetchData();
    setActivePage(pageNumber);
  };

  const handleDetail = (slug) => {
    nav(`/article/${slug}`);
  };

  const handleFilter = (e) => {
    const offset = (activePage - 1) * limit;
    const tag = e;
    axios
      .get(
        `https://api.realworld.io/api/articles?limit=${limit}&offset=${offset}&tag=${tag}`
      )
      // .then(response => response.json())
      .then((data) => {
        setArticles(data.data.articles);
        setArticlesCount(data.data.articlesCount);
      })
      .catch((error) => console.error("Error fetching articles:", error));
    setTag(e);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      "en-US",
      options
    );
    return formattedDate;
  };

  const getAnArticles = async (slug) => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    };
    try {
      const anArticles = await axios.get(
        `https://api.realworld.io/api/articles/${slug}`,
        { headers }
      );

      setn1Articles(anArticles.data.article);
    } catch (error) {
      console.log(error);
    }
  };

  const totalPages = Math.ceil(articlesCount / limit);

  // Dynamically generate pagination items based on totalPages
  const paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item
        key={number}
        active={number === activePage}
        className="pagination-item"
        onClick={() => handlePageChange(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  const handleFavorite = (slug) => {
    getAnArticles(slug);
    if (!userToken) {
      nav("/login");
    } else {
      try {
        const headers = {
          Authorization: `Bearer ${userToken}`,
        };
        let response;
        if (n1Articles.favorited) {
          response = axios.delete(
            `https://api.realworld.io/api//articles/${slug}/favorite`,
            {
              headers,
            }
          );
        } else {
          response = axios.post(
            `https://api.realworld.io/api//articles/${slug}/favorite`,
            {},
            {
              headers,
            }
          );
        }
      } catch (error) {
        console.log(" handle favorites");
      }
    }
  };

  const handleYourFeed = () => {
    setFollowedAuthor(/* Set the followed author */);
    setActiveTab("yourFeed");
  };

  const handleGlobalFeed = () => {
    setFollowedAuthor(null); // Reset the followed author
    setActiveTab("global");
  };

  return (
    <>
      <Header />
      <Banner />
      <br /> <br />
      <Container>
        <div className="pr-32 pl-32 pt-10 row">
          <div className="col-md-9">
            <div
              className="feed-toggle"
              style={{ borderBottom: "1px solid lightgray" }}
            >
              <ul className="nav nav-pills feed-item">
                {userToken && (
                  <li className="nav-item">
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
                <li className="nav-item">
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
                  <li className="nav-item">
                    <Link
                      className={`nav-link feed-tag ${
                        activeTab === "global" ? "active" : ""
                      }`}
                    >
                      # {tag}
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            {articles.map((articles, index) => (
              <div key={articles.slug} className="article-preview">
                <div className="d-flex justify-between align-items-center">
                  <div className="col-md-11">
                    <div className="article-meta d-flex align-items-center gap-3">
                      <Link className="d-inline-block">
                        <img src={articles.author.image} alt="error" />
                      </Link>
                      <div className="info">
                        <Link className="no-underline hover:underline hover:cursor-pointer">
                          {articles.author.username}
                        </Link>
                        <span className="feed-date">
                          {formatDate(articles.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-1">
                    <button
                      onClick={() => handleFavorite(articles.slug)}
                      className={`btn btn-sm btn-outline-succes btn-heart ${
                        articles.favorited ? "bg-success text-white" : ""
                      }`}
                      style={{ borderColor: "#5CB85C", color: "#5CB85C" }}
                    >
                      <i
                        className={`fa fa-heart-fill ${
                          articles.favorited ? "text-white" : ""
                        }`}
                      >
                        <i className="bi bi-heart-fill"></i>
                      </i>
                      <span className="ml-1" style={{ fontWeight: "400" }}>
                        {articles.favoritesCount}
                      </span>
                    </button>
                  </div>
                </div>

                <div
                  className="d-block"
                  onClick={() => handleDetail(articles.slug)}
                >
                  <h1 className="article-title">{articles.title}</h1>
                  <p className="article-description">{articles.description}</p>
                  <div className="d-flex align-items-center justify-between">
                    <div className="col-md-8">
                      <span className="article-read-more hover:cursor-pointer">
                        Read more ...
                      </span>
                    </div>
                    <div className="col-md-4">
                      <ul className="tag-list">
                        {articles.tagList.map((tag) => (
                          <li
                            key={tag}
                            className="tag-item hover:cursor-pointer"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {/* 
          {activeTab === 'yourFeed' ? <Feed  followedAuthor={'https://api.realworld.io/api/articles/feed'}/> : <Feed  followedAuthor={'https://api.realworld.io/api/articles'}/>} */}
          </div>

          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>
              <div className="popular-tags">
                <Link
                  className="popular-tags-item"
                  onClick={(e) => handleFilter("welcome")}
                >
                  welcome
                </Link>
                <Link
                  className="popular-tags-item"
                  onClick={(e) => handleFilter("implementations")}
                >
                  implementations
                </Link>
                <Link
                  className="popular-tags-item"
                  onClick={(e) => handleFilter("introduction")}
                >
                  introduction
                </Link>
                <Link
                  className="popular-tags-item"
                  onClick={(e) => handleFilter("codebaseShow")}
                >
                  codebaseShow
                </Link>
                <Link
                  className="popular-tags-item"
                  onClick={(e) => handleFilter("ipsum")}
                >
                  ipsum
                </Link>
                <Link
                  className="popular-tags-item"
                  onClick={(e) => handleFilter("qui")}
                >
                  qui
                </Link>
                <Link
                  className="popular-tags-item"
                  onClick={(e) => handleFilter("et")}
                >
                  et
                </Link>
                <Link
                  className="popular-tags-item"
                  onClick={(e) => handleFilter("cupiditate")}
                >
                  cupiditate
                </Link>
                <Link
                  className="popular-tags-item"
                  onClick={(e) => handleFilter("quia")}
                >
                  quia
                </Link>
                <Link
                  className="popular-tags-item"
                  onClick={(e) => handleFilter("deserunt")}
                >
                  deserunt
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Pagination
          className="mr-32 ml-32 pagination"
          currentpage={activePage}
          totalpages={totalPages}
          handlepagechange={handlePageChange}
        >
          {paginationItems}
        </Pagination>
      </Container>
      <Footer />
    </>
  );
};

export default Home;
