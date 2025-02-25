import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Spinner, Container } from "react-bootstrap";

const Medicamentos = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedicamentos = async () => {
      try {
        const response = await axios.get("api/v1/products");
        setMedicamentos(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching medicamentos:", error);
        setLoading(false);
      }
    };

    fetchMedicamentos();
  }, []);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          {medicamentos.map((medicamento) => (
            <tr key={medicamento.id}>
              <td>{medicamento.nombre}</td>
              <td>{medicamento.descripcion}</td>
              <td>{medicamento.cantidad}</td>
              <td>{medicamento.precio}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Medicamentos;