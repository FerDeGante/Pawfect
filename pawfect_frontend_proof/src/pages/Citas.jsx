import { useEffect, useState } from "react";
import { Container, Card, Spinner } from "react-bootstrap";
import axios from "axios";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:3000/api/appointments")
      .then((res) => {
        setAppointments(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <Spinner animation="border" />;

  return (
    <Container className="mt-4">
      <h2>Citas</h2>
      {appointments.map((appt) => (
        <Card key={appt.appointment_id} className="mb-3">
          <Card.Body>
            <Card.Title>{appt.date}</Card.Title>
            <Card.Text><strong>Motivo:</strong> {appt.reason}</Card.Text>
            <Card.Text><strong>Estado:</strong> {appt.status}</Card.Text>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default AppointmentsPage;