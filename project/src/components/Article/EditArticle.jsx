import { Col, Container, Form, Row } from "react-bootstrap";
import Header from "../Home/Header";
import "./NewArticle.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";

export default function EditArticle() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [taglist, setTagList] = useState([]);
  const userToken = localStorage.getItem("userToken");
  const { pslug } = useParams();
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
        console.log(response);
        setTitle(response.data.article.title);
        setBody(response.data.article.body);
        setDescription(response.data.article.description);
        setTagList(response.data.article.tagList);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [pslug, userToken]);


  const handleSubmit = async (e) => {
      let data = JSON.stringify({
        article: {
          title: title,
          description: description,
          body: body,
          tagList: taglist,
        },
      });
    e.preventDefault();

    try {
      const config = {
        method: "put",
        url: `https://api.realworld.io/api/articles/${pslug}`,
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
        data: data,
      };

      const response = await axios.request(config);
      console.log(response);

      if (response.status >= 200 && response.status < 300) {
        toast.update("update Successful!");
        navigate(`/article/${pslug}`);
      } else {
        toast.error("Add Fail!");
        console.error("Error creating article:", response.error);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed Notification!");
    }
  };


  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
       setTagList(e)
    }
  };

  return (
    <>
      <Header />
      <Container fluid>
        <Row>
          <Col className="offset-2 col-md-8">
            <Form onSubmit={(e) => handleSubmit(e)}>
              <Form.Group className="col-md-12">
                <Form.Control
                  value={title}
                  placeholder="Article Title"
                  className="first-input"
                  onChange={(e) => setTitle(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group className="col-md-12">
                <Form.Control
                  value={description}
                  placeholder="What's this article about?"
                  className="second-input"
                  onChange={(e) => setDescription(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group className="col-md-12">
                <textarea
                  placeholder="Write your article (in markdown)"
                  className="textbox"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                ></textarea>
              </Form.Group>
              <Form.Group className="col-md-12">
                <Form.Control
                  placeholder="Enter tags"
                  className="third-input"
                  onChange={(e) => setTagList(e.target.value)}
                ></Form.Control>
                <div className="d-flex">
                  {Array.isArray(taglist) &&
                    taglist.map((list, index) => (
                      <div key={index} className="d-flex newarticle-taglist">
                        <p>{list}</p>
                        <p>X</p>
                      </div>
                    ))}
                </div>
              </Form.Group>
              <Form.Group className="col-md-12">
                <button className="btn-publish" type="submit">
                  Publish Article
                </button>
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Container>
      <ToastContainer />
    </>
  );
}
