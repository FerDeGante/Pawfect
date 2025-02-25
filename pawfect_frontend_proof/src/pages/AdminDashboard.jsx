import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col, Spinner } from "react-bootstrap";
import axios from "axios";
import "../styles/styles.sass";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:3000/api/stats")
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <Container className="mt-4">
      <h1>📊 Panel de Administración</h1>
      <p>Bienvenido, administra tu veterinaria eficientemente.</p>

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Row>
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>👥 Clientes Registrados</Card.Title>
                <Card.Text>{stats.clients} clientes activos</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>🐶 Mascotas Registradas</Card.Title>
                <Card.Text>{stats.pets} mascotas en la base</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>📅 Citas Agendadas</Card.Title>
                <Card.Text>{stats.appointments} citas registradas</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default AdminDashboard;
