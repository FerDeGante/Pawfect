import React, { useState } from "react";
import { Form, Button, Alert, Spinner, FloatingLabel } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "",
    licence: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/users/register", formData);
      console.log(response.data);
      alert("Registro exitoso");
      navigate("/login"); // Redirigir al login después de registrar
    } catch (error) {
      setError("Error en el registro. Verifica los datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Regístrate en Pawfect</h2>
        <p className="login-subtitle">Crea tu cuenta para gestionar la veterinaria</p>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit} className="login-form">
          <FloatingLabel controlId="floatingFirstName" label="Nombre" className="mb-3">
            <Form.Control
              type="text"
              name="first_name"
              placeholder="Nombre"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </FloatingLabel>

          <FloatingLabel controlId="floatingLastName" label="Apellido" className="mb-3">
            <Form.Control
              type="text"
              name="last_name"
              placeholder="Apellido"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </FloatingLabel>

          <FloatingLabel controlId="floatingEmail" label="Correo Electrónico" className="mb-3">
            <Form.Control
              type="email"
              name="email"
              placeholder="Correo Electrónico"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FloatingLabel>

          <FloatingLabel controlId="floatingPhone" label="Teléfono" className="mb-3">
            <Form.Control
              type="text"
              name="phone"
              placeholder="Teléfono"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </FloatingLabel>

    

          <FloatingLabel controlId="floatingLicence" label="Licencia (solo para veterinarios)" className="mb-3">
            <Form.Control
              type="text"
              name="licence"
              placeholder="Número de licencia"
              value={formData.licence}
              onChange={handleChange}
            />
          </FloatingLabel>

          <FloatingLabel controlId="floatingPassword" label="Contraseña">
            <Form.Control
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </FloatingLabel>

          <Button variant="primary" type="submit" disabled={loading} className="login-button mt-3">
            {loading ? <Spinner animation="border" size="sm" /> : "Registrarse"}
          </Button>
        </Form>

        <p className="login-footer mt-3">
          ¿Ya tienes cuenta? <a href="/login" className="register-link">Inicia sesión</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
