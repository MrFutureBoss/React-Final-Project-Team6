import React, { useState, useEffect } from "react";
import { Col, Row, Button } from "react-bootstrap";
import "./Home.css"; 
import "./Pagination.css"; 
import Header from "./Header";
import Banner from "./Banner";
import Footer from "./Footer";
import axios from 'axios';
import GlobalFeed from './GlobalFeed';
import Tags from "./Tags";

const formatDate = (dateString, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return new Date(dateString).toLocaleDateString(undefined, mergedOptions);
};

const PAGE_SIZE = 10; 

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [apiTitle, setApiTitle] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tags, setTags] = useState([]);

  const fetchData = async () => {
    try {
      const [articlesResponse, tagsResponse] = await Promise.all([
        axios.get(`https://api.realworld.io/api/articles?limit=${PAGE_SIZE}&offset=${(currentPage - 1) * PAGE_SIZE}`),
        axios.get(`https://api.realworld.io/api/tags`),
      ]);

      setArticles(articlesResponse.data.articles);
      setApiTitle(articlesResponse.data.title);
      setTotalPages(Math.ceil(articlesResponse.data.articlesCount / PAGE_SIZE));
      setTags(tagsResponse.data.tags);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage);
  };

  return (
    <>
      <Header />
      <Banner />
      <Row>
        <Col xs={12} md={2}></Col>
        <Col xs={12} md={8}>
          <h2>{apiTitle}</h2>
          <a className="nav-link.active" onClick={fetchData}>Global Feed</a>
          {articles.map((article) => (
            <GlobalFeed key={article.id} article={article} formatDate={formatDate} />
          ))}
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <Button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`page-link ${currentPage === index + 1 ? "active" : ""}`}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </Col>
        <Col xs={12} md={2}>
          {/* Content for the third column */}
          <div className="square-box">
            <h3>Popular Tags</h3>
            <div className="tags-container">
              {tags.map((tag) => (
                <Button key={tag} variant="outline-primary" className="tag-button">{tag}</Button>
              ))}
            </div>
          </div>
        </Col>
      </Row>
      <Footer />
    </>
  );
};

export default Home;
