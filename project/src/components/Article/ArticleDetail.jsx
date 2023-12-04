import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../Home/Header";
import "./ArticleDetail.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ArticleDetail = () => {
  const userToken = localStorage.getItem("userToken");
  const userName = localStorage.getItem("userName");
  const { pslug } = useParams();
  const [article, setArticle] = useState([]);
  const [author, setAuthor] = useState([]);
  const [comments, setComments] = useState([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let config = {
          method: "get",
          maxBodyLength: Infinity,
          url: `https://api.realworld.io/api/articles/${pslug}`,
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        };

        const response = await axios.request(config);
        setArticle(response.data.article);
        setAuthor(response.data.article.author);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [pslug]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let config = {
          method: "get",
          maxBodyLength: Infinity,
          url: `https://api.realworld.io/api/articles/${pslug}/comments`,
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        };

        const response = await axios.request(config);
        setComments(response.data.comments);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [pslug]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      "en-US",
      options
    );
    return formattedDate;
  };

  //Delete Article
  const handleDelete = () => {
    try {
      let config = {
        method: "delete",
        maxBodyLength: Infinity,
        url: `https://api.realworld.io/api/articles/${pslug}`,
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      };
      axios.request(config).then((response) => {
        console.log(JSON.stringify(response.data));
      });
    } catch (error) {
      console.log(error);
    } finally {
      navigate("/");
    }
  };

  //Move to Edit Article Page
  const handleEdit = () => {
    navigate(`/editor/${pslug}`);
  };

  //Favorited or unfavorited an article
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
        console.log(response);
      } else {
        // If the article is favorited, send a DELETE request to remove it from favorites
        response = await axios.delete(
          `https://api.realworld.io/api/articles/${slug}/favorite`,
          config
        );
      }

      // Use the functional form of setArticle to ensure you're working with the latest state
      setArticle((prevState) => ({
        ...prevState,
        favorited: !favorited,
        favoritesCount: favorited
          ? prevState.favoritesCount - 1
          : prevState.favoritesCount + 1,
      }));
    } catch (error) {
      console.error(error);
    }
  };

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
      setAuthor((prevState) => ({
        ...prevState,
        following: !following,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  //Post comment
  const handlePostComment = async (e) => {
    let data = JSON.stringify({
      comment: {
        body: body,
      },
    });

     if (body.length === 0) {
       toast.error("Comment is empty");
       return; // Không thực hiện thêm comment
     }

    e.preventDefault();
    try {
      const config = {
        method: "post",
        url: `https://api.realworld.io/api/articles/${pslug}/comments`,
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
        data: data,
      };

      const response = await axios.request(config);
      console.log(response);

      if (response.status >= 200 && response.status < 300) {
        toast.success("Post Successful!");
        setComments((updateComments) => [...updateComments, response.data.comment]);
        setBody("");
      } else {
        toast.error("Post Fail!");
        console.error("Error creating article:", response.error);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed Notification!");
    }
  };
  //Delete comments
  const handleDeleteComment = async (id) => {
    try {
      let config = {
        method: "delete",
        maxBodyLength: Infinity,
        url: `https://api.realworld.io/api/articles/${pslug}/comments/${id}`,
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      };
      const response = await axios.request(config);
      console.log(response);
      if (response.status >= 200 && response.status < 300) {
        toast.success("Delete Successful!");
        setComments((updateComments) =>
          updateComments.filter((comment) => comment.id !== id)
        );
      } else {
        toast.error("Delete Fail!");
        console.error("Error creating article:", response.error);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed Notification!");
    }
  };
  return (
    <>
      <Header />
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ marginTop: "100px" }}
        >
          <Spinner animation="border" role="status"></Spinner>
          <span>Loading...</span>
        </div>
      ) : (
        <>
          <Container
            fluid
            style={{ backgroundColor: "#333", marginBottom: "30px" }}
          >
            <Row
              className="detail-header"
              style={{ width: "80%", margin: "auto" }}
            >
              <Col xs={12} lg={10} style={{ margin: "auto" }}>
                <Row>
                  <Col xs={12} className="detail-line1">
                    <h1>{article.title}</h1>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} className="d-flex detail-line2">
                    <img src={author.image} alt={pslug} />
                    <div className="content">
                      <p>{author.username}</p>
                      <p>{formatDate(article.createdAt)}</p>
                    </div>
                    {userName === author.username ? (
                      <>
                        <button className="detail-edit" onClick={handleEdit}>
                          <i className="bi bi-pencil-fill"></i>&nbsp;Edit
                          Article
                        </button>
                        <button
                          className="detail-delete"
                          onClick={handleDelete}
                        >
                          <i className="bi bi-trash3-fill"></i>
                          &nbsp;Delete Article
                        </button>
                      </>
                    ) : (
                      <>
                        {!author.following ? (
                          <button
                            className="detail-follow"
                            onClick={() =>
                              handleFollowing(author.username, author.following)
                            }
                          >
                            <i className="bi bi-plus-lg"></i>&nbsp;Follow&nbsp;
                            {author.username}
                          </button>
                        ) : (
                          <button
                            className="detail-unfollow"
                            onClick={() =>
                              handleFollowing(author.username, author.following)
                            }
                          >
                            <i className="bi bi-plus-lg"></i>
                            &nbsp;Unfollow&nbsp;
                            {author.username}
                          </button>
                        )}
                        {!article.favorited ? (
                          <button
                            className="detail-favorite"
                            onClick={() =>
                              handleFavorited(article.slug, article.favorited)
                            }
                          >
                            <i className="bi bi-heart-fill"></i>
                            &nbsp;Favorited Article ({article.favoritesCount})
                          </button>
                        ) : (
                          <button
                            className="detail-unfavorite"
                            onClick={() =>
                              handleFavorited(article.slug, article.favorited)
                            }
                          >
                            <i className="bi bi-heart-fill"></i>
                            &nbsp;Unfavorited Article ({article.favoritesCount})
                          </button>
                        )}
                      </>
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
          <Container fluid style={{ marginBottom: "100px" }}>
            <Row style={{ width: "80%", margin: "auto" }}>
              <Col xs={12} lg={10} style={{ margin: "auto" }}>
                <Row>
                  <Col xs={12} className="detail-line3">
                    <p>{article.body}</p>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} className="detail-line4">
                    <div className="taglist">
                      {article.tagList &&
                        article.tagList.map((list, index) => (
                          <div key={index}>
                            <p>{list}</p>
                          </div>
                        ))}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} className="m-auto">
                    <div className="d-flex justify-content-center detail-line5">
                      <img src={author.image} alt={pslug} />
                      <div className="content">
                        <p>{author.username}</p>
                        <p>{formatDate(article.updatedAt)}</p>
                      </div>
                      {userName === author.username ? (
                        <>
                          <button className="detail-edit2" onClick={handleEdit}>
                            <i className="bi bi-pencil-fill"></i>&nbsp;Edit
                            Article
                          </button>
                          <button
                            className="detail-delete2"
                            onClick={handleDelete}
                          >
                            <i className="bi bi-trash3-fill"></i>
                            &nbsp;Delete Article
                          </button>
                        </>
                      ) : (
                        <>
                          {!author.following ? (
                            <button
                              className="detail-follow"
                              onClick={() =>
                                handleFollowing(
                                  author.username,
                                  author.following
                                )
                              }
                            >
                              <i className="bi bi-plus-lg"></i>
                              &nbsp;Follow&nbsp;
                              {author.username}
                            </button>
                          ) : (
                            <button
                              className="detail-unfollow2"
                              onClick={() =>
                                handleFollowing(
                                  author.username,
                                  author.following
                                )
                              }
                            >
                              <i className="bi bi-plus-lg"></i>
                              &nbsp;Unfollow&nbsp;
                              {author.username}
                            </button>
                          )}
                          {!article.favorited ? (
                            <button
                              className="detail-favorite2"
                              onClick={() =>
                                handleFavorited(article.slug, article.favorited)
                              }
                            >
                              <i className="bi bi-heart-fill"></i>
                              &nbsp;Favorited Article ({article.favoritesCount})
                            </button>
                          ) : (
                            <button
                              className="detail-unfavorite2"
                              onClick={() =>
                                handleFavorited(article.slug, article.favorited)
                              }
                            >
                              <i className="bi bi-heart-fill"></i>
                              &nbsp;Unfavorited Article (
                              {article.favoritesCount})
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col
                    lg={10}
                    xs={12}
                    style={{
                      margin: "30px auto 20px auto",
                      backgroundColor: "#F5F5F5",
                      padding: "0",
                    }}
                  >
                    <div className="detail-line6">
                      <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder="Write a comment..."
                      ></textarea>
                    </div>
                    <div className="detail-line7" style={{ margin: "auto" }}>
                      <img src={author.image} alt={pslug} />
                      <button
                        className="post-comment"
                        onClick={(e) => handlePostComment(e)}
                      >
                        Post Comment
                      </button>
                    </div>
                  </Col>
                </Row>
                <Row>
                  {comments &&
                    comments.map((comment, index) => (
                      <Col lg={10} xs={12} key={index} className="comment-box">
                        <Row>
                          <Col xs={12} className="detail-line8">
                            {comment.body}
                          </Col>
                        </Row>
                        <Row>
                          <Col xs={12} className="detail-line9">
                            <div className="d-flex gap-1 right-content">
                              <img
                                src={comment.author.image}
                                alt={comment.author.username}
                              />
                              <p className="comment-username">
                                {comment.author.username}
                              </p>
                              <p>{formatDate(article.createdAt)}</p>
                            </div>
                            <i
                              className="bi bi-trash3-fill"
                              onClick={() => handleDeleteComment(comment.id)}
                            ></i>
                          </Col>
                        </Row>
                      </Col>
                    ))}
                </Row>
              </Col>
            </Row>
          </Container>
          <ToastContainer />
        </>
      )}
    </>
  );
};

export default ArticleDetail;
