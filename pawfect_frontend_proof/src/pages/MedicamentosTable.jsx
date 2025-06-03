import React, { useEffect, useState } from "react";
import { Table, Spinner, Button, OverlayTrigger, Tooltip, Form, Modal } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaFileExcel } from "react-icons/fa";
import axios from "axios";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const Medicamentos = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [filteredMedicamentos, setFilteredMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMedicamento, setSelectedMedicamento] = useState(null);

  useEffect(() => {
    fetchMedicamentos();
  }, []);

  const fetchMedicamentos = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get("http://localhost:3000/api/v1/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Filtrar por la categoría "medicina"
      const medicamentos = res.data.products.filter((product) => product.category === "medicina");
      setMedicamentos(medicamentos);
      setFilteredMedicamentos(medicamentos);
    } catch (error) {
      console.error("Error al obtener medicamentos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = medicamentos.filter(
      (medicamento) =>
        medicamento.name.toLowerCase().includes(term) ||
        medicamento.category.toLowerCase().includes(term)
    );
    setFilteredMedicamentos(filtered);
  };

  const handleEdit = (medicamento) => {
    setSelectedMedicamento(medicamento);
    setShowEditModal(true);
  };

  const handleDelete = (medicamento) => {
    setSelectedMedicamento(medicamento);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:3000/api/v1/products/${selectedMedicamento.product_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMedicamentos(); // Recargar la lista de medicamentos
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error al eliminar medicamento:", error);
    }
  };

  const saveEdit = async (updatedMedicamento) => {
    const token = localStorage.getItem("token");
    try {
      // Convertir el precio a número
      updatedMedicamento.price = parseFloat(updatedMedicamento.price);
  
      await axios.patch(
        `http://localhost:3000/api/v1/products/${selectedMedicamento.product_id}`,
        updatedMedicamento,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchMedicamentos(); // Recargar la lista de medicamentos
      setShowEditModal(false);
    } catch (error) {
      console.error("Error al editar medicamento:", error);
    }
  };

  const exportToExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Medicamentos");

    // Definir las columnas
    worksheet.columns = [
      { header: "Nombre", key: "name", width: 20 },
      { header: "Categoría", key: "category", width: 15 },
      { header: "Cantidad", key: "quantity", width: 10 },
      { header: "Precio", key: "price", width: 10 },
    ];

    // Agregar filas
    medicamentos.forEach((medicamento) => {
      worksheet.addRow({
        name: medicamento.name,
        category: medicamento.category,
        quantity: medicamento.quantity,
        price: medicamento.price,
      });
    });

    // Guardar el archivo
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(blob, "Medicamentos.xlsx");
    });
  };

  const importFromExcel = (file) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const buffer = e.target.result;
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);
      const worksheet = workbook.getWorksheet(1);

      const importedData = [];
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          // Ignorar la primera fila (encabezados)
          importedData.push({
            name: row.getCell(1).value,
            category: "medicina", // Asignar la categoría "medicina"
            quantity: row.getCell(3).value,
            price: row.getCell(4).value,
          });
        }
      });

      // Enviar los datos importados al backend
      const token = localStorage.getItem("token");
      try {
        await axios.post("http://localhost:3000/api/v1/products/import", importedData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchMedicamentos(); // Recargar la lista de medicamentos
      } catch (error) {
        console.error("Error al importar medicamentos:", error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <div className="p-4">
      <h2>Medicamentos</h2>
      <div className="d-flex justify-content-between mb-3">
        <Form.Control
          type="text"
          placeholder="Buscar medicamento..."
          value={searchTerm}
          onChange={handleSearch}
          style={{ width: "300px" }}
        />
        <div>
          <Button variant="primary" onClick={() => setShowCreateModal(true)} className="me-2">
            <FaPlus /> Crear Medicamento
          </Button>
          <Button variant="success" onClick={exportToExcel} className="me-2">
            <FaFileExcel /> Exportar Excel
          </Button>
          <input
            type="file"
            accept=".xlsx"
            onChange={(e) => importFromExcel(e.target.files[0])}
            style={{ display: "none" }}
            id="importExcel"
          />
          <Button variant="warning" onClick={() => document.getElementById("importExcel").click()}>
            <FaFileExcel /> Importar Excel
          </Button>
        </div>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredMedicamentos.map((medicamento) => (
            <tr key={medicamento.product_id}>
              <td>{medicamento.name}</td>
              <td>{medicamento.category}</td>
              <td>{medicamento.quantity}</td>
              <td>${medicamento.price}</td>
              <td>
                <OverlayTrigger overlay={<Tooltip>Editar</Tooltip>}>
                  <Button variant="warning" size="sm" onClick={() => handleEdit(medicamento)}>
                    <FaEdit />
                  </Button>
                </OverlayTrigger>{" "}
                <OverlayTrigger overlay={<Tooltip>Eliminar</Tooltip>}>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(medicamento)}>
                    <FaTrash />
                  </Button>
                </OverlayTrigger>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal para editar medicamento */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Medicamento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre"
                defaultValue={selectedMedicamento?.name}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Control
                type="text"
                placeholder="Categoría"
                defaultValue={selectedMedicamento?.category}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="number"
                placeholder="Cantidad"
                defaultValue={selectedMedicamento?.quantity}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                placeholder="Precio"
                defaultValue={selectedMedicamento?.price}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={() => saveEdit(selectedMedicamento)}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para eliminar medicamento */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Medicamento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar el medicamento {selectedMedicamento?.name}?
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
    </div>
  );
};

export default Medicamentos;