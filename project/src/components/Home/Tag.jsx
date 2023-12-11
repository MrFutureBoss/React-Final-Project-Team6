import React, { useEffect, useState } from "react";
import { Container, Pagination } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./Article.css";
import "./style.css";

export default function Tag({getTag}) {
  const [articles, setArticles] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [articlesCount, setArticlesCount] = useState(0);
  const userToken = localStorage.getItem("userToken");
  const [n1Articles, setn1Articles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  console.log(getTag)

  const nav = useNavigate();
  const limit = 10;
  const offset = (activePage - 1) * limit;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchData = async () => {
    try {
        console.log("hello");
        const response = await axios.get(
          `https://api.realworld.io/api/articles?limit=${limit}&offset=${offset}${
            getTag ? `&tag=${getTag}` : ""
          }`
        );
        setArticles(response.data.articles);
        setArticlesCount(response.data.articlesCount);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData(); // Call the fetchData function
  }, [getTag]);

  const handlePageChange = async (pageNumber) => {
    console.log(pageNumber);
    fetchData();
    setActivePage(pageNumber);
  };

  const handleDetail = (slug) => {
    nav(`/article/${slug}`);
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

  const handleFavorited = async (slug, favorited) => {
    getAnArticles(slug);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      };

      let response;

      if (!favorited) {
        // If the article is not favorited, send a POST request to favorite it
        response = await axios.post(
          `https://api.realworld.io/api/articles/${slug}/favorite`,
          null,
          config
        );
      } else {
        // If the article is favorited, send a DELETE request to remove it from favorites
        response = await axios.delete(
          `https://api.realworld.io/api/articles/${slug}/favorite`,
          config
        );
      }

      // After favoriting/unfavoriting, update the favoritesCount in the current state
      const updatedArticles = articles.map((article) => {
        if (article.slug === slug) {
          return {
            ...article,
            favorited: !favorited, // Toggle the favorited state
            favoritesCount: favorited
              ? article.favoritesCount - 1
              : article.favoritesCount + 1, // Update favoritesCount
          };
        }
        return article;
      });

      // Update the state with the modified articles array
      setArticles(updatedArticles);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container fluid style={{ marginBottom: "80px", width: "100%" }}>
      {loading ? (
        <p className="loading-articles">Loading articles...</p>
      ) : (
        <>
          {articles.length > 0 ? (
            articles.map((data, index) => (
              <div
                key={index}
                className="myarticle-list"
                style={{
                  borderBottom:
                    index === articles.length - 1 ? "" : "1px solid #aaaaaa",
                }}
              >
                <div className="myarticle-line1 d-flex">
                  <div className="d-flex">
                    <img src={data.author.image} alt="error" />
                    <div className="content">
                      <Link
                        to={`/@${data.author.username}`}
                        style={{ textDecoration: "none" }}
                      >
                        <p>{data.author.username}</p>
                      </Link>
                      <p>{formatDate(data.createdAt)}</p>
                    </div>
                  </div>
                  <button
                    className="favorite"
                    onClick={() => handleFavorited(data.slug, data.favorited)}
                  >
                    <i className="bi bi-heart-fill">
                      &nbsp;{data.favoritesCount}
                    </i>
                  </button>
                </div>
                <div
                  className="myarticle-line2"
                  onClick={() => handleDetail(data.slug)}
                >
                  <h1>{data.title}</h1>
                </div>
                <div
                  className="myarticle-line3"
                  onClick={() => handleDetail(data.slug)}
                >
                  <p>{data.description}</p>
                </div>
                <div
                  className="myarticle-line4 d-flex justify-content-between"
                  onClick={() => handleDetail(data.slug)}
                >
                  <p>Read more...</p>

                  <div
                    className="taglist"
                    onClick={() => handleDetail(data.slug)}
                  >
                    {data.tagList.map((list, index) => (
                      <div key={index}>
                        <p>{list}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-articles">No articles are here... yet.</p>
          )}
        </>
      )}
      <Pagination
        className="mr-32 ml-32 pagination d-flex flex-wrap"
        currentpage={activePage}
        handlepagechange={handlePageChange}
      >
        {paginationItems}
      </Pagination>
    </Container>
  );
}
