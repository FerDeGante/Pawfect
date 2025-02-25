import { useEffect, useState } from "react";
import { Table, Spinner, Container } from "react-bootstrap";
import axios from "axios";

const Mascotas = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:3000/api/pets")
      .then((res) => {
        setPets(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <Container className="mt-4">
      <h2>🐶 Mascotas</h2>
      {loading ? <Spinner animation="border" /> : (
        <Table striped bordered hover>
          <thead>
            <tr><th>Nombre</th><th>Tipo</th><th>Raza</th><th>Edad</th><th>Dueño</th></tr>
          </thead>
          <tbody>
            {pets.map(pet => (
              <tr key={pet.pet_id}>
                <td>{pet.name}</td>
                <td>{pet.type}</td>
                <td>{pet.breed}</td>
                <td>{pet.age}</td>
                <td>{pet.owner_id}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default Mascotas;
