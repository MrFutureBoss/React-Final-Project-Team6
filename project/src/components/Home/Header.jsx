import {Col, Container, Row} from "react-bootstrap";
import { NavLink } from "react-router-dom";
const Header = () => {
    return (
      <Container fluid className="header-container">
        <Row className="header-position" >
          <Col xs={6} className="d-flex logo">
            conduit
          </Col>
          <Col xs={6} className="nav-position" >
            <NavLink to='/'>Home</NavLink>
            <NavLink to='login'>Sign in</NavLink>
            <NavLink to='/register'>Sign up</NavLink>
          </Col>
        </Row>
      </Container>
    );
}
 
export default Header;