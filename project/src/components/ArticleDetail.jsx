import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Home/Header";
import axios from "axios";
import './Home/style.css';
import { Spinner } from "react-bootstrap";

const ArticleDetail = () => {
  const { slug } = useParams();
  const [token, setToken] = useState(localStorage.getItem("userToken"));
  const [article, setArticle] = useState();
  const [comment, setComment] = useState([]);
  const [user, setUser] = useState();
  const [body, setBody] = useState('');
  const [followedAuthor, setFollowedAuthor] = useState(null); 
  const nav = useNavigate();
  // console.log(slug);

  useEffect(() => {
      const setDefaultToken = async () =>{
        axios.defaults.headers.common['Authorization'] =  await `Bearer ${localStorage.getItem("userToken")}`;
      }
      setDefaultToken();
  }, [localStorage.getItem("userToken")]);

  const handleGetArticle = () => {
    axios.get(`https://api.realworld.io/api/articles/${slug}`)
      // .then((response) => response.json())
      .then((data) => setArticle(data.data))
      .catch((error) => console.error("Error fetching articles:", error));
  }

  // useEffect(() => {
  //   fetch(`https://api.realworld.io/api/articles/${slug}`)
  //     .then((response) => response.json())
  //     .then((data) => setArticle(data))
  //     .catch((error) => console.error("Error fetching articles:", error));
  // });

  useEffect(() => {
    handleGetArticle();
  },[]);

  useEffect(() => {
    if (token) {
      fetch(`https://api.realworld.io/api/articles/${slug}/comments`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      })
        .then((response) => response.json())
        .then((data) => {
          setComment(data.comments);
          console.log(data.comments);
        })
        .catch((error) => console.error("Error fetching comments:", error));
    } else {
      fetch(`https://api.realworld.io/api/articles/${slug}/comments`)
        .then((response) => response.json())
        .then((data) => {
          setComment(data.comments);
          console.log(data.comments);
        })
        .catch((error) => console.error("Error fetching comments:", error));
    }
  });

  useEffect(() => {
    fetch("https://api.realworld.io/api/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUser(data.user);
        console.log(data.user);
      })
      .catch((error) => console.error("Error fetching user:", error));
  },[]);

  const handleEdit = () => {
    nav(`/edit/${slug}`);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    axios
      .delete(`https://api.realworld.io/api/articles/${slug}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        nav("/");
        // console.log(res.data.errors);
      })
      .catch((error) => {
        console.error("Error publishing article:", error);
      });
  };

  const changeBody = event => {
    setBody(event.target.value);
    console.log(body);
  };

  const postComment = async e => {
    e.preventDefault();
    axios.post(
      `https://api.realworld.io/api/articles/${slug}/comments`,
      {
        comment: {
          body: body,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          comment: {
            body: body,
          }
        })
      }
    )
      .then((res) => {
        console.log(res);
        // nav(`/article/${slug}`)
        // console.log(res.data.errors);
      })
      .then(() => {
        setBody('')
      })
      .catch((error) => {
        console.error('Error publishing article:', error);
      });
  };

  const handleDeleteComment = (id) => {
    console.log(id);
    axios
      .delete(`https://api.realworld.io/api/articles/${slug}/comments/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        // nav("/");
        // console.log(res.data.errors);
      })
      .catch((error) => {
        console.error("Error publishing article:", error);
      });

  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      "en-US",
      options
    );
    return formattedDate;
  };


  if (!article) {
    return (
      <>
        <div className="d-flex justify-content-center align-items-center text-center" style={{marginTop:'300px'}}>
          <Spinner animation="border" role="status"></Spinner>
          <span>Loading...</span>
        </div>
      </>
    );
  }

  const handleFollow = async () => {
    console.log(article);
    console.log(token);
    axios.defaults.headers.common['Authorization'] = await `Bearer ${token}`;
      if (article?.article?.author?.following) {
        axios.delete(`https://api.realworld.io/api/profiles/${article.article.author.username}/follow`) 
        .then((res) => {
          handleGetArticle();
        }
        );
    }
    else{
      axios.post(`https://api.realworld.io/api/profiles/${article.article.author.username}/follow`)
      .then((res) => {
        handleGetArticle();
      })
    }
  
  };


  return (
    <>
      <Header />
      <div className="article-page">
        <div className="">
          <div className="fluid">
            <div className=" d-block text-center text-bg-dark text-white">
              <div className="container article-meta d-flex align-items-center gap-3 pb-4">
                <h1 className="pt-4 pb-2  text-start">{article?.article?.title}</h1>
              </div>

              <div className="container article-meta d-flex align-items-center gap-3 pb-4">
                <a className="d-inline-block">
                  {/* <img src={articles.author.image} alt="error" /> */}
                  <img
                    className="rounded-circle"
                    src="https://api.realworld.io/images/demo-avatar.png"
                    alt="Anah Benešová"
                  ></img>
                </a>

                <div className="info text-start " style={{ gap: "10px" }}>
                  <a
                    className="no-underline hover:underline hover:cursor-pointer"
                    style={{ color: "white" }}
                  >
                    {article?.article?.author?.username}
                    
                  </a>

                  <span className="feed-date d-block">
                    {formatDate(article?.article?.createdAt)}
                  </span>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <button
                    className={`btn btn-sm btn-outline-secondary btn-follow ${
                       !article?.article?.author?.following ? 'unfollowed' : ''
                    }`}
                    onClick={handleFollow}
                  >
                    <i class="bi bi-plus"></i>
                    &nbsp;  {!article?.article?.author?.following ? 'Unfollow' : 'Follow'} {article?.article?.author?.username}
                  </button>
                   <button className="btn btn-sm btn-outline-secondary btn-favorite-detail">
                      <i className="bi bi-heart-fill"></i>
                      &nbsp; Favorite Article ( {article?.article?.favoritesCount} )
                   </button>
                </div>

              </div>
            </div>
          </div>
          <div className="container page" style={{ marginTop: "1.5rem" }}>
            <div className="row article-content">
              <div className="col-xs-12">
                <div>
                  <p style={{ textAlign: "initial", fontSize: "1.25em" }}>{article?.article?.body}</p>
                </div>
              </div>

              <div className="text-start">
                <ul className="tag-list d-inline-block">
                {article?.article?.tagList && article?.article?.tagList?.map((tag, index) => (
                  <li
                    key={index}
                    style={{
                      border: "1px solid #ddd",
                      color: "rgb(193, 190, 190)",
                      fontSize: "0.8rem",
                      borderRadius: "10rem",
                    }}
                    className="tag-default tag-pill tag-outline d-inline-block pt-1 pb-1 pl-2 pr-2 m-1"
                  >
                    {tag}
                  </li>
                ))}
                </ul>
              </div>

              <div
                className="mt-3"
                style={{ borderBottom: "1px solid lightGray" }}
              ></div>
            </div>
          </div>
        </div>
        {user !== undefined &&
          user?.username === article?.article?.author?.username && (
            <div className="d-flex justify-center mt-10">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={handleEdit}
              >
                <i className="bi bi-pencil-square"></i>Edit Article
              </button>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={handleDelete}
              >
                <i class="bi bi-trash-fill"></i> Delete Article
              </button>
            </div>
          )}

        {token && <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            <div>
              <form
                method="POST"
                onSubmit={postComment}
                className="card comment-form m-5"
              >
                <div className="card-block ">
                  <fieldset className="form-group p-4">
                    <input
                      type="text"
                      className="form-control h-32"
                      placeholder="Write a comment..."
                      value={body}
                      onChange={changeBody}
                      id="body"
                    />
                  </fieldset>
                </div>

                <div className="card-footer d-flex justify-content-between align-items-center p-3">
                  <img
                    style={{
                      width: "2rem",
                      float: "float-start",
                      borderRadius: "50%",
                    }}
                    src="https://api.realworld.io/images/smiley-cyrus.jpeg"
                    className="comment-author-img d-inline-block"
                    alt="HastyAlvin"
                  ></img>
                  <button className="btn btn-sm btn-success " type="submit">
                    Post Comment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>}


        <div className="comment">
          {comment.map((e, index) => (
            <div className=" col-md-8 offset-md-2" key={e?.id}>
              <div>
                <div
                  className="card comment-form m-4"
                >
                  <div className="card-block form-control form-group p-4">
                    {e?.body}
                  </div>
                  <div className="card-footer d-flex justify-content-between align-items-center p-3">
                    <div>
                      <img
                        style={{
                          width: "2rem",
                          float: "float-start",
                          borderRadius: "50%",
                        }}
                        src={e?.author?.image}
                        className="comment-author-img d-inline-block"
                        alt="HastyAlvin"
                      ></img>
                      <a className="no-underline hover:underline hover:cursor-pointer p-1 " style={{ color: "green", textDecoration:'none' }}>
                        {/* {articles.author.username} */}
                        {e?.author?.username} 
                      </a>  &nbsp;
                      <span className="feed-date d-d-inline-block ">
                        {formatDate(e?.createdAt)}
                      </span>
                    </div>
                    {user !== undefined &&
                      user?.username === e?.author?.username &&
                      < button className="bi bi-trash " onClick={() => handleDeleteComment(e?.id)}>
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    }
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div >
      </div >

      {/* {followedAuthor && <YourFeed followedAuthor={followedAuthor} />} */}
    </>
  );
};

export default ArticleDetail;
