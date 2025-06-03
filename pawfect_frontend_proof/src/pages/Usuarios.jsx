import React, { useEffect, useState } from "react";
import { Table, Spinner, Button, OverlayTrigger, Tooltip, Form, Modal, Alert } from "react-bootstrap";
import { FaEdit, FaUserCog } from "react-icons/fa";
import axios from "axios";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");

  useEffect(() => {
    const fetchUsuarios = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get("http://localhost:3000/api/v1/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuarios(res.data.users);
      } catch (error) {
        setError("Error al cargar usuarios.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  const handleEdit = (usuario) => {
    setSelectedUsuario(usuario);
    setNewName(`${usuario.first_name} ${usuario.last_name}`);
    setNewRole(usuario.role);
    setShowEditModal(true);
  };

  const saveEdit = async () => {
    const token = localStorage.getItem("token");
    try {
      const [first_name, last_name] = newName.split(" ");
      await axios.patch(`http://localhost:3000/api/v1/users/${selectedUsuario.user_id}`, {
        firstName: first_name,
        lastName: last_name,
        role: newRole,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsuarios((prev) =>
        prev.map((u) =>
          u.user_id === selectedUsuario.user_id
            ? { ...u, first_name, last_name, role: newRole }
            : u
        )
      );

      setSuccess("Usuario actualizado correctamente.");
      setError(null);
    } catch (error) {
      setError("Error al actualizar usuario.");
      setSuccess(null);
    } finally {
      setShowEditModal(false);
    }
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <div className="dashboard-content">
      <h2>Usuarios</h2>

      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.user_id}>
              <td>{usuario.first_name} {usuario.last_name}</td>
              <td>{usuario.email}</td>
              <td>{usuario.role}</td>
              <td>
                <OverlayTrigger overlay={<Tooltip>Editar Usuario</Tooltip>}>
                  <Button variant="warning" size="sm" onClick={() => handleEdit(usuario)}>
                    <FaEdit />
                  </Button>
                </OverlayTrigger>{' '}
                <OverlayTrigger overlay={<Tooltip>Cambiar Rol</Tooltip>}>
                  <Button variant="info" size="sm" onClick={() => handleEdit(usuario)}>
                    <FaUserCog />
                  </Button>
                </OverlayTrigger>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal para editar usuario */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre completo</Form.Label>
              <Form.Control
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                <option value="admin">Administrador</option>
                <option value="owner">Dueño</option>
                <option value="veterinarian">Veterinario</option>
                <option value="employee">Empleado</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={saveEdit}>
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Usuarios;
