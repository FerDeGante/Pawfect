import React, { useState, useEffect } from "react";
import { Button, Form, ListGroup, InputGroup, Container, Row, Col } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa"; // Íconos de React Icons

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Simulación de carga de productos desde una API
    const fetchedProducts = [
      { id: 1, name: "Producto 1", stock: 10 },
      { id: 2, name: "Producto 2", stock: 5 },
      { id: 3, name: "Producto 3", stock: 20 },
    ];
    setProductos(fetchedProducts);
  }, []);

  const handleAddProduct = () => {
    // Lógica para agregar un producto
    const newProduct = { id: productos.length + 1, name: `Producto ${productos.length + 1}`, stock: 0 };
    setProductos([...productos, newProduct]);
  };

  const handleEditProduct = (id) => {
    // Lógica para editar un producto
    const newName = prompt("Nuevo nombre del producto:");
    if (newName) {
      setProductos((prev) =>
        prev.map((product) => (product.id === id ? { ...product, name: newName } : product))
      );
    }
  };

  const handleDeleteProduct = (id) => {
    // Lógica para eliminar un producto
    setProductos((prev) => prev.filter((product) => product.id !== id));
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = productos.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="mt-4">
      <h1>Productos</h1>
      <Row className="mb-3">
        <Col>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Buscar productos"
              value={searchTerm}
              onChange={handleSearch}
            />
          </InputGroup>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={handleAddProduct}>
            Agregar Producto
          </Button>
        </Col>
      </Row>
      <ListGroup>
        {filteredProducts.map((product) => (
          <ListGroup.Item key={product.id} className="d-flex justify-content-between align-items-center">
            <div>
              <strong>{product.name}</strong>
              <br />
              <small>Stock: {product.stock}</small>
            </div>
            <div>
              <Button variant="link" onClick={() => handleEditProduct(product.id)}>
                <FaEdit /> {/* Ícono de editar */}
              </Button>
              <Button variant="link" onClick={() => handleDeleteProduct(product.id)}>
                <FaTrash /> {/* Ícono de eliminar */}
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default Productos;