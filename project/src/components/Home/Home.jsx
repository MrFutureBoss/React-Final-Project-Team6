<<<<<<< Updated upstream
import { Col, Container, Row } from "react-bootstrap";
import "./Home.css";
=======
// Home.js

import React, { useState, useEffect } from "react";
import { Col, Row, Button } from "react-bootstrap";
import "./Home.css"; // Your existing styles
import "./Pagination.css"; // Pagination styles
>>>>>>> Stashed changes
import Header from "./Header";
import Banner from "./Banner";
import Footer from "./Footer";
import axios from 'axios';
import GlobalFeed from './GlobalFeed';

const formatDate = (dateString, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return new Date(dateString).toLocaleDateString(undefined, mergedOptions);
};

const PAGE_SIZE = 10; // Number of articles per page

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [apiTitle, setApiTitle] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async () => {
    try {
      const response = await axios.get(`https://api.realworld.io/api/articles?limit=${PAGE_SIZE}&offset=${(currentPage - 1) * PAGE_SIZE}`);
      setArticles(response.data.articles);
      setApiTitle(response.data.title);
      setTotalPages(Math.ceil(response.data.articlesCount / PAGE_SIZE));
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
        <Col xs={12}>
          <h2>{apiTitle}</h2>
          <Button onClick={fetchData}>Global Feed</Button>
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
      </Row>
      <Footer />
    </>
  );
};

export default Home;
