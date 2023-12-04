import React from "react";
import { Col, Button } from "react-bootstrap";
import "./Tags.css"; 

const TagsComponent = ({ tags }) => {
  return (
    <Col xs={12} md={2}>
      <div className="square-box">
        <h3>Popular Tags</h3>
        <div className="tags-container">
          {tags.map((tag) => (
            <Button
              key={tag}
              className={`tag-button ${tag === 'pill' ? 'tag-pill' : 'tag-default'}`}
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>
    </Col>
  );
};

export default TagsComponent;