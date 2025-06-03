import React, { useState } from "react";
import { Form, Button, Alert, Spinner, FloatingLabel } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/api/v1/users/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);

      // Verifica el rol del usuario
      if (response.data.role === "admin") {
        navigate("/admin-dashboard"); // Redirige al panel de administración
      } else {
        navigate("/dashboard"); // Redirige al dashboard de usuario normal
      }
    } catch (err) {
      setError("Correo o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Bienvenido a Pawfect</h2>
        <p className="login-subtitle">Inicia sesión para gestionar tu veterinaria</p>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleLogin} className="login-form">
          <FloatingLabel controlId="floatingEmail" label="Correo Electrónico" className="mb-3">
            <Form.Control
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FloatingLabel>

          <FloatingLabel controlId="floatingPassword" label="Contraseña" className="mb-3">
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FloatingLabel>

          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            className="login-button mt-3"
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Iniciar Sesión"}
          </Button>
        </Form>

        <p className="login-footer mt-3">
          ¿No tienes cuenta? <a href="/register" className="register-link">Regístrate</a>
        </p>
      </div>
    </div>
  );
}

export default Login;