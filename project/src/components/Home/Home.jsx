import { Col, Container, Row } from "react-bootstrap";
import "./Home.css";
import Header from "./Header";
import Banner from "./Banner";
import Footer from "./Footer";

const Home = () => {
  return (
    <>
        <Header/>
        <Banner/>
      <Row>
        <Col xs={12}>
          
        </Col>
      </Row>
      <Footer/>
    </>
  );
};

export default Home;
