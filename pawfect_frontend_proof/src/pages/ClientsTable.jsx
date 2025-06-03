import React, { useEffect, useState } from "react";
import { Table, Spinner, Button, OverlayTrigger, Tooltip, Form, Modal, Alert } from "react-bootstrap";
import { FaEdit, FaTrash, FaUserCog, FaSearch, FaFileExcel } from "react-icons/fa";
import axios from "axios";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const ClientsTable = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showChangeRoleModal, setShowChangeRoleModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get("http://localhost:3000/api/v1/users/clients", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClients(res.data.clients);
      setFilteredClients(res.data.clients);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
      setError("Error al obtener clientes. Inténtalo de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = clients.filter(
      (client) =>
        client.first_name.toLowerCase().includes(term) ||
        client.last_name.toLowerCase().includes(term) ||
        client.email.toLowerCase().includes(term)
    );
    setFilteredClients(filtered);
  };

  const handleEdit = (client) => {
    setSelectedClient(client);
    setShowEditModal(true);
  };

  const handleDelete = (client) => {
    setSelectedClient(client);
    setShowDeleteModal(true);
  };

  const handleChangeRole = (client) => {
    setSelectedClient(client);
    setShowChangeRoleModal(true);
  };

  const confirmDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:3000/api/v1/users/${selectedClient.user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchClients(); // Recargar la lista de clientes
      setShowDeleteModal(false);
      setSuccess("Cliente eliminado exitosamente.");
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      setError("Error al eliminar cliente. Inténtalo de nuevo más tarde.");
    }
  };

  const saveEdit = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.patch(
        `http://localhost:3000/api/v1/users/${selectedClient.user_id}`,
        selectedClient,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchClients();
      setShowEditModal(false);
      setSuccess("Cliente actualizado exitosamente.");
    } catch (error) {
      console.error("Error al editar cliente:", error);
      setError(error.response?.data?.message || "Error al editar cliente. Inténtalo de nuevo más tarde.");
    }
  };

  const changeRole = async (newRole) => {
    const token = localStorage.getItem("token");
    try {
      await axios.patch(
        `http://localhost:3000/api/v1/users/${selectedClient.user_id}`,
        { role: newRole },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchClients();
      setShowChangeRoleModal(false);
      setSuccess(`Rol del cliente cambiado a ${newRole} exitosamente.`);
    } catch (error) {
      console.error("Error al cambiar el rol del cliente:", error);
      setError(error.response?.data?.message || "Error al cambiar el rol del cliente. Inténtalo de nuevo más tarde.");
    }
  };

  const exportToExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Clientes");

    worksheet.columns = [
      { header: "Nombre", key: "name", width: 20 },
      { header: "Email", key: "email", width: 25 },
      { header: "Teléfono", key: "phone", width: 15 },
      { header: "Rol", key: "role", width: 15 },
    ];

    clients.forEach((client) => {
      worksheet.addRow({
        name: `${client.first_name} ${client.last_name}`,
        email: client.email,
        phone: client.phone || "No registrado",
        role: client.role,
      });
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(blob, "Clientes.xlsx");
    });
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <div className="p-4">
      <h2>Clientes</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <div className="d-flex justify-content-between mb-3">
        <Form.Control
          type="text"
          placeholder="Buscar cliente..."
          value={searchTerm}
          onChange={handleSearch}
          style={{ width: "300px" }}
        />
        <div>
          <Button variant="success" onClick={exportToExcel} className="me-2">
            <FaFileExcel /> Exportar Excel
          </Button>
        </div>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredClients.map((client) => (
            <tr key={client.user_id}>
              <td>{`${client.first_name} ${client.last_name}`}</td>
              <td>{client.email}</td>
              <td>{client.phone || "No registrado"}</td>
              <td>{client.role}</td>
              <td>
                <OverlayTrigger overlay={<Tooltip>Editar</Tooltip>}>
                  <Button variant="warning" size="sm" onClick={() => handleEdit(client)}>
                    <FaEdit />
                  </Button>
                </OverlayTrigger>{" "}
                <OverlayTrigger overlay={<Tooltip>Eliminar</Tooltip>}>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(client)}>
                    <FaTrash />
                  </Button>
                </OverlayTrigger>{" "}
                <OverlayTrigger overlay={<Tooltip>Cambiar Rol</Tooltip>}>
                  <Button variant="info" size="sm" onClick={() => handleChangeRole(client)}>
                    <FaUserCog />
                  </Button>
                </OverlayTrigger>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal para editar cliente */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre"
                value={selectedClient?.first_name || ""}
                onChange={(e) => setSelectedClient({ ...selectedClient, first_name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                placeholder="Apellido"
                value={selectedClient?.last_name || ""}
                onChange={(e) => setSelectedClient({ ...selectedClient, last_name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                value={selectedClient?.email || ""}
                onChange={(e) => setSelectedClient({ ...selectedClient, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                placeholder="Teléfono"
                value={selectedClient?.phone || ""}
                onChange={(e) => setSelectedClient({ ...selectedClient, phone: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={saveEdit}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para eliminar cliente */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar a {selectedClient?.first_name}{" "}
          {selectedClient?.last_name}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para cambiar rol */}
      <Modal show={showChangeRoleModal} onHide={() => setShowChangeRoleModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cambiar Rol</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nuevo Rol</Form.Label>
              <Form.Select
                value={selectedClient?.role || ""}
                onChange={(e) => setSelectedClient({ ...selectedClient, role: e.target.value })}
              >
                <option value="owner">Dueño</option>
                <option value="employee">Empleado</option>
                <option value="admin">Administrador</option>
                <option value="veterinarian">Veterinario</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowChangeRoleModal(false)}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={() => changeRole(selectedClient.role)}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ClientsTable;