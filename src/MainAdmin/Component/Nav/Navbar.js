
import React from "react";
import  {Navbar , Container ,Nav} from 'react-bootstrap';
import './Nav.css';
import logo from '../../../Assets/logo11.png';

const Navbars = () =>{
return(
  <Navbar expand="lg">
  <Container>
    <Navbar.Brand>
      <img src={logo} title="logo" alt="" />
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="ml-auto">
        <Nav.Link className="active" href="/Home">
          الصفحة الرئيسية
        </Nav.Link>
        <Nav.Link className="activelogout" href="/">
              تسجيل الخروج
            </Nav.Link>

        {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
          <NavDropdown.Item href="#">Action</NavDropdown.Item>
          <NavDropdown.Item href="#action/3.2">
            Another action
          </NavDropdown.Item>
          <NavDropdown.Item href="/about">Something</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="#action/3.4">
            Separated link
          </NavDropdown.Item>
        </NavDropdown> */}

      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>

);
}



export default Navbars;