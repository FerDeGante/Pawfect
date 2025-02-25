import React, { useState } from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaCalendarAlt, FaUsers, FaPaw, FaBox, FaUserShield, FaBars, FaHome, FaExternalLinkAlt
} from "react-icons/fa";
import "../styles/styles.sass";

const Sidebar = ({ setSelectedSection }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`sidebar ${expanded ? "expanded" : "collapsed"}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="sidebar-header">
        <FaBars className="sidebar-toggle" onClick={() => setExpanded(!expanded)} />
      </div>
      <Nav className="flex-column">
        <Nav.Link onClick={() => setSelectedSection("citas")}>
          <FaCalendarAlt /> {expanded && "Citas"}
        </Nav.Link>
        <Nav.Link onClick={() => setSelectedSection("clientes")}>
          <FaUsers /> {expanded && "Clientes"}
        </Nav.Link>
        <Nav.Link onClick={() => setSelectedSection("mascotas")}>
          <FaPaw /> {expanded && "Mascotas"}
        </Nav.Link>

        <Nav.Link onClick={() => setSelectedSection("productos")}>
          <FaBox /> {expanded && "Productos"}
        </Nav.Link>

        <Nav.Link onClick={() => setSelectedSection("usuarios")}>
          <FaUserShield /> {expanded && "Usuarios"}
        </Nav.Link>

        {/* Íconos adicionales */}
        <div className="sidebar-footer">
          <Nav.Link href="/" target="_blank">
            <FaHome /> {expanded && "Sitio Principal"}
          </Nav.Link>
          <Nav.Link href="https://pawfect.com" target="_blank">
            <FaExternalLinkAlt /> {expanded && "Pawfect"}
          </Nav.Link>
        </div>
      </Nav>
    </div>
  );
};

export default Sidebar;
