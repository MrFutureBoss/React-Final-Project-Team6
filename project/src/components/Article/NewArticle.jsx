import { Col, Container, Form, Row } from "react-bootstrap";
import Header from "../Home/Header";
import "./Article.css";
import {  useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewArticle = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [taglist, setTagList] = useState("");
  const userToken = localStorage.getItem("userToken");

 
  let data = JSON.stringify({
    article: {
      title: title,
      description: description,
      body: body,
      tagList: [taglist],
    },
  });

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       let config = {
  //         method: "post",
  //         maxBodyLength: Infinity,
  //         url: "https://api.realworld.io/api/articles",
  //         headers: {
  //           Authorization: `Bearer ${userToken}`,
  //         },
  //       };
  //       const response = await axios.request(config);
  //       console.log(response);
  //     } catch (error) {
  //       console.log(error); // Handle other errors
  //     }
  //   };
 
  // }, [userToken]);

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const config = {
      method: "post",
      url: "https://api.realworld.io/api/articles",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    const response = await axios.request(config);
    console.log(response);

    if (response.status >= 200 && response.status < 300) {
      toast.success("Add Successful!");
      setTitle("");
      setDescription("");
      setBody("");
      setTagList("");
    } else {
      toast.error("Add Fail!");
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
                  value={taglist}
                  placeholder="Enter tags"
                  className="third-input"
                  onChange={(e) => setTagList(e.target.value)}
                ></Form.Control>
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
};

export default NewArticle;
