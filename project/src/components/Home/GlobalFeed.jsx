import "../Home/GlobalFeed.css";
import React from "react";

const GlobalFeed = ({ article, formatDate }) => {
  return (
    <div key={article.id} className="article-preview">
      <div className="article-meta">
        {article.author && article.author.image && (
          <img src={article.author.image} alt={article.author.username} className="thumbnail" />
        )}
        <div className="info">
          {article.author && (
            <a href={`/${article.author.username}`} className="author">
              {article.author.username}
            </a>
          )}
          {article.createdAt && (
            <span className="date">{formatDate(article.createdAt)}</span>
          )}
        </div>
      </div>
      <a href={`/article/${article.slug}`} className="preview-link">
        <h3>{article.title}</h3>
        <p>{article.description}</p>
        {/* Add more details as needed */}
      </a>
    </div>
  );
};

export default GlobalFeed;
