import React from "react";
import { Navbar, Container } from "react-bootstrap";

const AdminNavbar = () => {
  return (
 <Navbar expand="lg" className="navbar-custom fixed-top">     
  <Container>
        <Navbar.Brand>Bienvenido, Admin</Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;
