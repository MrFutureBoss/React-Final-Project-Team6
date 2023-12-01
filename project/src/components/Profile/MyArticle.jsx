import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";

const MyArticle = () => {
  const { pusername } = useParams();
  const url = pusername.slice(1);
  const userToken = localStorage.getItem("userToken");
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 5;
  useEffect(() => {
    const fetchData = async () => {
      try {
        let config = {
          method: "get",
          maxBodyLength: Infinity,
          url: `https://api.realworld.io/api/articles?author=${url}`,
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        };

        const response = await axios.request(config);
        setArticles(response.data.articles);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [url, userToken]);

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

  return (
    <>
      <Container fluid style={{ marginBottom: "80px" }}>
        {currentArticles.length > 0 &&
          currentArticles.map((data, index) => (
            <div key={index} className="myarticle-list">
              <div className="myarticle-line1 d-flex">
                <div className="d-flex">
                  <img src={data.author.image} alt={url} />
                  <div className="content">
                    <p>{url}</p>
                    <p>November</p>
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
              <div className="myarticle-line2">
                <h1>{data.title}</h1>
              </div>
              <div className="myarticle-line3">
                <p>{data.description}</p>
              </div>
              <div className="myarticle-line4 d-flex justify-content-between">
                <p>Read more...</p>
                <div className="taglist">
                  {data.tagList.map((list, index) => (
                    <div key={index}>
                      <p>{list}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

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
