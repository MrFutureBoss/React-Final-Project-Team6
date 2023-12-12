import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const MyArticle = () => {
  const { pusername } = useParams();
  const url = pusername.charAt(0) === "@" ? pusername.slice(1) : pusername;
  const userToken = localStorage.getItem("userToken");
  const userName = localStorage.getItem("userName");
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 5;
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        let config = {
          method: "get",
          maxBodyLength: Infinity,
          url:
            url === userName
              ? `https://api.realworld.io/api/articles?author=${url}`
              : `https://api.realworld.io/api/articles?author=${url}&limit=20`,
        };
        if (userToken) {
          config.headers = {
            Authorization: `Bearer ${userToken}`,
          };
        }

        const response = await axios.request(config);
        setArticles(response.data.articles);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false); // Set loading to false when fetching is complete (success or error)
      }
    };
    fetchData();
  }, [url]);

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );

  const paginate = async (pageNumber) => setCurrentPage(pageNumber);

  const handleFavorited = async (slug, favorited) => {
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

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      "en-US",
      options
    );
    return formattedDate;
  };

  const handleDetailArticles = (slug) => {
    navigate(`/article/${slug}`);
  };

  return (
    <>
      <Container fluid style={{ marginBottom: "80px", width: "100%" }}>
        {loading ? (
          <p className="loading-articles">Loading articles...</p>
        ) : (
          <>
            {currentArticles.length > 0 ? (
              currentArticles.map((data, index) => (
                <div
                  key={index}
                  className="myarticle-list"
                  style={{
                    borderBottom:
                      index === currentArticles.length - 1
                        ? ""
                        : "1px solid #aaaaaa",
                  }}
                >
                  <div className="myarticle-line1 d-flex">
                    <div className="d-flex">
                      <img src={data.author.image} alt={url} />
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
                    onClick={() => handleDetailArticles(data.slug)}
                  >
                    <h1>{data.title}</h1>
                  </div>
                  <div
                    className="myarticle-line3"
                    onClick={() => handleDetailArticles(data.slug)}
                  >
                    <p>{data.description}</p>
                  </div>
                  <div
                    className="myarticle-line4 d-flex justify-content-between"
                    onClick={() => handleDetailArticles(data.slug)}
                  >
                    <p>Read more...</p>

                    <div
                      className="taglist"
                      onClick={() => handleDetailArticles(data.slug)}
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
        <div className="pagination">
          {[...Array(Math.ceil(articles.length / articlesPerPage)).keys()].map(
            (number) => (
              <button
                key={number}
                onClick={() => paginate(number + 1)}
                className={currentPage === number + 1 ? "active" : "not-active"}
              >
                {number + 1}
              </button>
            )
          )}
        </div>
      </Container>
    </>
  );
};

export default MyArticle;
