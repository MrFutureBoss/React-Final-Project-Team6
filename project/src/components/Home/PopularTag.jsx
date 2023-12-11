import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const PopularTag = ({setSelectedTag}) => {
  const [tags, setTags] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        let config = {
          method: "get",
          maxBodyLength: Infinity,
          url: `https://api.realworld.io/api/tags`,
        };

        const response = await axios.request(config);
        setTags(response.data.tags);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  });

  const handleOnClick = (tag) =>{
     setSelectedTag(tag);
  }

  return (
    <div className="popular-tags" style={{backgroundColor:'#f3f3f3', padding:'5px 10px'}}>
        <p>Popular Tags</p>
      {tags &&
        tags.map((tag, index) => (
          <div
            className="popular-tags-item"
            key={index}
            onClick={() => handleOnClick(tag)}
          >
            {tag}
          </div>
        ))}
    </div>
  );
};

export default PopularTag;
