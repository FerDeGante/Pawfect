import React, { useEffect, useState } from "react";
import { Table, Spinner, Button, OverlayTrigger, Tooltip, Form, Modal, Alert } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";

const Mascotas = () => {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [petForm, setPetForm] = useState({ name: "", type: "", breed: "", birthdate: "", owner_id: "" });
  const [owners, setOwners] = useState([]); // Lista de dueños

  useEffect(() => {
    fetchPets();
    fetchOwners(); // Obtener la lista de dueños al cargar el componente
  }, []);

  // Función para obtener la lista de dueños
  const fetchOwners = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/api/v1/users/owners", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data); // Verifica la respuesta del servidor
      setOwners(res.data.owners); // Asegúrate de que la respuesta es { owners: [...] }
    } catch (error) {
      console.error("Error al obtener dueños:", error);
      setErrorMessage("Error al obtener dueños. Inténtalo de nuevo más tarde.");
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  // Función para calcular la edad basada en la fecha de nacimiento
  const calculateAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const fetchPets = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/api/v1/pets", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPets(res.data.pets);
      setFilteredPets(res.data.pets);
    } catch (error) {
      console.error("Error al obtener mascotas:", error);
      setErrorMessage("Error al obtener mascotas. Inténtalo de nuevo más tarde.");
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredPets(
      pets.filter(
        (pet) =>
          pet.name.toLowerCase().includes(term) ||
          pet.type.toLowerCase().includes(term) ||
          pet.breed.toLowerCase().includes(term)
      )
    );
  };

  const handleDelete = (pet) => {
    setSelectedPet(pet);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedPet) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/v1/pets/${selectedPet.pet_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Eliminar la mascota del estado sin recargar toda la lista
      const updatedPets = pets.filter((pet) => pet.pet_id !== selectedPet.pet_id);
      setPets(updatedPets);
      setFilteredPets(updatedPets);

      setSuccessMessage("Mascota eliminada exitosamente.");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error al eliminar mascota:", error);
      setErrorMessage("Error al eliminar mascota. Inténtalo de nuevo más tarde.");
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setShowDeleteModal(false);
      setSelectedPet(null);
    }
  };

  const handleEdit = (pet) => {
    setSelectedPet(pet);
    setPetForm({ name: pet.name, type: pet.type, breed: pet.breed, birthdate: pet.birthdate, owner_id: pet.owner_id });
    setShowEditModal(true);
  };

  const saveEdit = async () => {
    if (!selectedPet) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:3000/api/v1/pets/${selectedPet.pet_id}`, {
        name: petForm.name,
        type: petForm.type,
        breed: petForm.breed,
        birthdate: petForm.birthdate,
        fk_user_id: petForm.owner_id
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Actualizar la mascota en la lista sin recargar todo
      const updatedPets = pets.map((pet) => (pet.pet_id === selectedPet.pet_id ? { ...pet, ...petForm } : pet));
      setPets(updatedPets);
      setFilteredPets(updatedPets);

      setSuccessMessage("Mascota editada exitosamente.");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error al editar mascota:", error);
      setErrorMessage("Error al editar mascota. Inténtalo de nuevo más tarde.");
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setShowEditModal(false);
      setSelectedPet(null);
    }
  };

  const handleCreate = () => {
    setPetForm({ name: "", type: "", breed: "", birthdate: "", owner_id: "" });
    setShowCreateModal(true);
  };

  const saveCreate = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:3000/api/v1/pets", {
        name: petForm.name,
        type: petForm.type,
        breed: petForm.breed,
        birthdate: petForm.birthdate,
        fk_user_id: petForm.owner_id
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Agregar la nueva mascota a la lista sin recargar todo
      setPets([...pets, res.data.pet]);
      setFilteredPets([...pets, res.data.pet]);

      setSuccessMessage("Mascota creada exitosamente.");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error al crear mascota:", error);
      setErrorMessage("Error al crear mascota. Inténtalo de nuevo más tarde.");
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setShowCreateModal(false);
    }
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <div className="p-4">
      <h2>Mascotas</h2>

      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <div className="d-flex justify-content-between mb-3">
        <Form.Control type="text" placeholder="Buscar mascota..." value={searchTerm} onChange={handleSearch} style={{ width: "300px" }} />
        <Button variant="primary" onClick={handleCreate}>
          <FaPlus /> Agregar Mascota
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Raza</th>
            <th>Edad</th>
            <th>Dueño</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
  {filteredPets.map((pet) => (
    <tr key={pet.pet_id}>
      <td>{pet.name}</td>
      <td>{pet.type}</td>
      <td>{pet.breed}</td>
      <td>{calculateAge(pet.birthdate)}</td>
      <td>{pet.owner_name || "Sin dueño"}</td>
      <td>
        <Button variant="warning" size="sm" onClick={() => handleEdit(pet)}>
          <FaEdit />
        </Button>{" "}
        <Button variant="danger" size="sm" onClick={() => handleDelete(pet)}>
          <FaTrash />
        </Button>
      </td>
    </tr>
  ))}
</tbody>
      </Table>

      {/* Modal de edición */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Mascota</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={petForm.name}
                onChange={(e) => setPetForm({ ...petForm, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tipo</Form.Label>
              <Form.Control
                type="text"
                value={petForm.type}
                onChange={(e) => setPetForm({ ...petForm, type: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Raza</Form.Label>
              <Form.Control
                type="text"
                value={petForm.breed}
                onChange={(e) => setPetForm({ ...petForm, breed: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha de Nacimiento</Form.Label>
              <Form.Control
                type="date"
                value={petForm.birthdate}
                onChange={(e) => setPetForm({ ...petForm, birthdate: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Dueño</Form.Label>
              <Form.Select
                value={petForm.owner_id}
                onChange={(e) => setPetForm({ ...petForm, owner_id: e.target.value })}
              >
                <option value="">Selecciona un dueño</option>
                {owners.map((owner) => (
                  <option key={owner.user_id} value={owner.user_id}>
                    {owner.first_name} {owner.last_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={saveEdit}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de creación */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Mascota</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={petForm.name}
                onChange={(e) => setPetForm({ ...petForm, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tipo</Form.Label>
              <Form.Control
                type="text"
                value={petForm.type}
                onChange={(e) => setPetForm({ ...petForm, type: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Raza</Form.Label>
              <Form.Control
                type="text"
                value={petForm.breed}
                onChange={(e) => setPetForm({ ...petForm, breed: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha de Nacimiento</Form.Label>
              <Form.Control
                type="date"
                value={petForm.birthdate}
                onChange={(e) => setPetForm({ ...petForm, birthdate: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Dueño</Form.Label>
              <Form.Select
                value={petForm.owner_id}
                onChange={(e) => setPetForm({ ...petForm, owner_id: e.target.value })}
              >
                <option value="">Selecciona un dueño</option>
                {owners.map((owner) => (
                  <option key={owner.user_id} value={owner.user_id}>
                    {owner.first_name} {owner.last_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={saveCreate}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de eliminación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Mascota</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar la mascota {selectedPet?.name}?
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

export default Mascotas;