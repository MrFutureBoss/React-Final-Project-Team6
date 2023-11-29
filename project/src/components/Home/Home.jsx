import { Col, Row } from "react-bootstrap";
import "./Home.css";
import Header from "./Header";
import Banner from "./Banner";
import Footer from "./Footer";
import Feed from "./Feed";

const Home = () => {
  return (
    <>
      <Header />
      <Banner />
      <Feed />
      <Footer />
    </>
  );
};

export default Home;
