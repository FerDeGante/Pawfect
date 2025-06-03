import React, { useState } from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaCalendarAlt,
  FaUsers,
  FaPaw,
  FaBox,
  FaPills,
  FaUserShield,
  FaStore,
  FaBars,
} from "react-icons/fa";
import "../styles/styles.sass";

const Sidebar = () => {
  const [expanded, setExpanded] = useState(false);
  const [stockOpen, setStockOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

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
        <Nav.Link as={Link} to="/admin/citas">
          <FaCalendarAlt /> {expanded && "Citas"}
        </Nav.Link>
        <Nav.Link as={Link} to="/admin/clientes">
          <FaUsers /> {expanded && "Clientes"}
        </Nav.Link>
        <Nav.Link as={Link} to="/admin/mascotas">
          <FaPaw /> {expanded && "Mascotas"}
        </Nav.Link>

        {/* Menú desplegable para Stock */}
        <div className="sidebar-dropdown">
          <Nav.Link onClick={() => setStockOpen(!stockOpen)}>
            <FaBox /> {expanded && "Stock"} {expanded && (stockOpen ? "▼" : "▶")}
          </Nav.Link>
          {stockOpen && (
            <div className="sidebar-submenu">
              <Nav.Link as={Link} to="/admin/productos">
                <FaBox /> {expanded && "Productos"}
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/medicamentos">
                <FaPills /> {expanded && "Medicamentos"}
              </Nav.Link>
            </div>
          )}
        </div>

        {/* Menú desplegable para Administrador */}
        <div className="sidebar-dropdown">
          <Nav.Link onClick={() => setAdminOpen(!adminOpen)}>
            <FaUserShield /> {expanded && "Administrador"} {expanded && (adminOpen ? "▼" : "▶")}
          </Nav.Link>
          {adminOpen && (
            <div className="sidebar-submenu">
              <Nav.Link as={Link} to="/admin/usuarios">
                <FaUserShield /> {expanded && "Usuarios"}
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/minegocio">
                <FaStore /> {expanded && "Mi Negocio"}
              </Nav.Link>
            </div>
          )}
        </div>
      </Nav>
    </div>
  );
};

export default Sidebar;
