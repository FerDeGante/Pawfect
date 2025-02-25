import React from "react";
import { Navbar, Nav, Container, OverlayTrigger, Tooltip } from "react-bootstrap";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";

function CustomNavbar() {
  return (
    <Navbar expand="lg" className="navbar-custom fixed-top">
      <Container>
        {/* Logo y Nombre */}
        <Navbar.Brand as={Link} to="/" className="text-white fw-bold">
          Atlauhtli
        </Navbar.Brand>

        {/* Botón hamburguesa para móviles */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Menú principal */}
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="d-flex align-items-center" style={{ gap: "20px" }}>
            <Nav.Link as={Link} to="/" className="text-white">Inicio</Nav.Link>
            <Nav.Link as={Link} to="/conocenos" className="text-white">Conócenos</Nav.Link>
            <Nav.Link as={Link} to="/citas" className="text-white">Citas</Nav.Link>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>Ingresa</Tooltip>}>
              <Nav.Link as={Link} to="/login" className="text-white d-flex align-items-center">
                <CgProfile style={{ fontSize: "2.5rem" }} />
              </Nav.Link>
            </OverlayTrigger>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
