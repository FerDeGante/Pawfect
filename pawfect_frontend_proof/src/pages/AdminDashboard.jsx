import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col, Spinner, Nav } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import ClientsTable from "./ClientsTable";
import Mascotas from "./MascotasTable";
import Productos from "./ProductosTable";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      const decoded = jwt_decode(token);
      if (decoded.role !== "admin") {
        navigate("/dashboard");
        return;
      }

      axios
        .get("http://localhost:3000/api/stats", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setStats(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error cargando estadísticas:", error);
          setLoading(false);
        });
    } catch (error) {
      console.error("Error decodificando el token:", error);
      navigate("/");
    }
  }, [navigate]);

  return (
    <Container className="admin-dashboard mt-4">
      <h1>📊 Panel de Administración</h1>
      <p>Bienvenido, administra tu veterinaria eficientemente.</p>

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <>
          <Nav variant="tabs" activeKey={activeSection} onSelect={(selected) => setActiveSection(selected)}>
            <Nav.Item>
              <Nav.Link eventKey="dashboard">📊 Dashboard</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="clients">👥 Clientes</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="pets">🐶 Mascotas</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="products">📦 Productos</Nav.Link>
            </Nav.Item>
          </Nav>

          {activeSection === "dashboard" && (
            <Row className="mt-3">
              <Col md={4}>
                <Card>
                  <Card.Body>
                    <Card.Title>👥 Usuarios Registrados</Card.Title>
                    <Card.Text>{stats?.users ?? 0} usuarios activos</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card>
                  <Card.Body>
                    <Card.Title>🐶 Mascotas Registradas</Card.Title>
                    <Card.Text>{stats?.pets ?? 0} mascotas en la base</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card>
                  <Card.Body>
                    <Card.Title>📦 Productos Registrados</Card.Title>
                    <Card.Text>{stats?.products ?? 0} productos disponibles</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {activeSection === "clients" && <ClientsTable />}
          {activeSection === "pets" && <Mascotas />}
          {activeSection === "products" && <Productos />}
        </>
      )}
    </Container>
  );
};

export default AdminDashboard;
