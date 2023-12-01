import React from "react";
import "./ArticleActions.css";

const ArticleActions = ({ username, image }) => {
  return (
    <>
      <div className="article-meta">
        <div className="art-user">
          <a>
            {image && <img className="img-ac" src={image} alt={username} />}
          </a>
          <span>{username}</span>
        </div>
        <div className="art-act">
          <a className="btn btn-sm btn-outline-secondary">
            <i className="bi bi-pencil-fill"></i> Edit Article
          </a>
          <button className="btn btn-sm btn-outline-danger">
            <i className="bi bi-trash3-fill"></i> Delete Article
          </button>
        </div>
      </div>
    </>
  );
};

export default ArticleActions;
