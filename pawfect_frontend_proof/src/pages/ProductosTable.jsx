import  { useEffect, useState } from "react";
import { Table, Spinner, Button, OverlayTrigger, Tooltip, Form, Modal, Alert } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus, FaFileExcel } from "react-icons/fa";
import axios from "axios";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [error, setError] = useState(null); // Estado para manejar errores
  const [success, setSuccess] = useState(null); // Estado para manejar mensajes de éxito

  // Lista de categorías disponibles
  const categorias = ["comida", "juguete", "baño", "medicina"];

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get("http://localhost:3000/api/v1/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
 setProductos(res.data)
setFilteredProductos(res.data)
    } catch (error) {
      console.error("Error al obtener productos:", error);
      setError("Error al obtener productos. Inténtalo de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = productos.filter(
      (producto) =>
        producto.name.toLowerCase().includes(term) ||
        producto.category.toLowerCase().includes(term)
    );
    setFilteredProductos(filtered);
  };

  const handleEdit = (producto) => {
    setSelectedProducto(producto);
    setShowEditModal(true);
  };

  const handleDelete = (producto) => {
    setSelectedProducto(producto);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `http://localhost:3000/api/v1/products/softDelete/${selectedProducto.product_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchProductos(); // Recargar la lista de productos
      setShowDeleteModal(false);
      setSuccess("Producto eliminado exitosamente.");
      setError(null); // Limpiar el error si la solicitud es exitosa
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      setError("Error al eliminar producto. Inténtalo de nuevo más tarde.");
      setSuccess(null); // Limpiar el mensaje de éxito si hay un error
    }
  };

  const saveEdit = async () => {
    const token = localStorage.getItem("token");
    try {
      // Captura los valores actualizados del formulario
      const updatedProducto = {
        name: document.getElementById("editName").value,
        category: document.getElementById("editCategory").value, // Asegúrate de que sea un valor permitido
        quantity: parseInt(document.getElementById("editQuantity").value),
        price: parseFloat(document.getElementById("editPrice").value),
      };
  
      console.log("Enviando datos al backend:", updatedProducto); // Depuración
  
      // Envía la solicitud PATCH al backend
      const response = await axios.patch(
        `http://localhost:3000/api/v1/products/${selectedProducto.product_id}`,
        updatedProducto,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      console.log("Respuesta del backend:", response.data); // Depuración
  
      // Recarga la lista de productos y cierra el modal
      fetchProductos();
      setShowEditModal(false);
      setSuccess("Producto actualizado exitosamente.");
      setError(null); // Limpiar el error si la solicitud es exitosa
    } catch (error) {
      console.error("Error al editar producto:", error);
      setError("Error al editar producto. Inténtalo de nuevo más tarde.");
      setSuccess(null); // Limpiar el mensaje de éxito si hay un error
    }
  };

  const handleCreateProduct = async () => {
    const token = localStorage.getItem("token");
    try {
      const newProduct = {
        name: document.getElementById("createName").value,
        category: document.getElementById("createCategory").value,
        quantity: parseInt(document.getElementById("createQuantity").value),
        price: parseFloat(document.getElementById("createPrice").value),
      };

      await axios.post("http://localhost:3000/api/v1/products", newProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchProductos(); // Recargar la lista de productos
      setShowCreateModal(false);
      setSuccess("Producto creado exitosamente.");
      setError(null); // Limpiar el error si la solicitud es exitosa
    } catch (error) {
      console.error("Error al crear producto:", error);
      setError("Error al crear producto. Inténtalo de nuevo más tarde.");
      setSuccess(null); // Limpiar el mensaje de éxito si hay un error
    }
  };

  const exportToExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Productos");

    // Definir las columnas
    worksheet.columns = [
      { header: "Nombre", key: "name", width: 20 },
      { header: "Categoría", key: "category", width: 15 },
      { header: "Cantidad", key: "quantity", width: 10 },
      { header: "Precio", key: "price", width: 10 },
    ];

    // Agregar filas
    productos.forEach((producto) => {
      worksheet.addRow({
        name: producto.name,
        category: producto.category,
        quantity: producto.quantity,
        price: producto.price,
      });
    });

    // Guardar el archivo
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "Productos.xlsx");
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
            category: row.getCell(2).value,
            quantity: row.getCell(3).value,
            price: row.getCell(4).value,
          });
        }
      });

      // Enviar los datos importados al backend
      const token = localStorage.getItem("token");
      try {
        await axios.post(
          "http://localhost:3000/api/v1/products/import",
          importedData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        fetchProductos(); // Recargar la lista de productos
        setSuccess("Productos importados exitosamente.");
        setError(null); // Limpiar el error si la solicitud es exitosa
      } catch (error) {
        console.error("Error al importar productos:", error);
        setError("Error al importar productos. Inténtalo de nuevo más tarde.");
        setSuccess(null); // Limpiar el mensaje de éxito si hay un error
      }
    };
    reader.readAsArrayBuffer(file);
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <div className="p-4">
      <h2>Productos</h2>
      {/* Mostrar mensajes de éxito y error */}
      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="d-flex justify-content-between mb-3">
        <Form.Control
          type="text"
          placeholder="Buscar producto..."
          value={searchTerm}
          onChange={handleSearch}
          style={{ width: "300px" }}
        />
        <div>
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
            className="me-2"
          >
            <FaPlus /> Crear Producto
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
          <Button
            variant="warning"
            onClick={() => document.getElementById("importExcel").click()}
          >
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
          {filteredProductos.map((producto) => (
            <tr key={producto.product_id}>
              <td>{producto.name}</td>
              <td>{producto.category}</td>
              <td>{producto.quantity}</td>
              <td>${producto.price}</td>
              <td>
                <OverlayTrigger overlay={<Tooltip>Editar</Tooltip>}>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleEdit(producto)}
                  >
                    <FaEdit />
                  </Button>
                </OverlayTrigger>{" "}
                <OverlayTrigger overlay={<Tooltip>Eliminar</Tooltip>}>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(producto)}
                  >
                    <FaTrash />
                  </Button>
                </OverlayTrigger>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal para crear producto */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                id="createName"
                placeholder="Nombre"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Select id="createCategory">
                {categorias.map((categoria, index) => (
                  <option key={index} value={categoria}>
                    {categoria}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="number"
                id="createQuantity"
                placeholder="Cantidad"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                id="createPrice"
                placeholder="Precio"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleCreateProduct}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para editar producto */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                id="editName"
                placeholder="Nombre"
                defaultValue={selectedProducto?.name}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Select id="editCategory" defaultValue={selectedProducto?.category}>
                {categorias.map((categoria, index) => (
                  <option key={index} value={categoria}>
                    {categoria}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="number"
                id="editQuantity"
                placeholder="Cantidad"
                defaultValue={selectedProducto?.quantity}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                id="editPrice"
                placeholder="Precio"
                defaultValue={selectedProducto?.price}
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

      {/* Modal para eliminar producto */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar el producto {selectedProducto?.name}?
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

export default Productos;