import {Col, Container, Row} from "react-bootstrap";

const Banner = () => {
    return (
      <Container fluid className="banner-container">
        <Row style={{ height: "100%" }}>
          <Col xs={10} className="banner-content">
            <Row>
              <p className="banner-logo">conduit</p>
              <p className="banner-title"> A place to share your knowledge.</p>
            </Row>
          </Col>
        </Row>
      </Container>
    );
}
 
export default Banner;