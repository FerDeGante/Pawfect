import { useEffect, useState } from "react";
import { ListGroup, Spinner } from "react-bootstrap";
import { FaCalendarAlt } from "react-icons/fa";

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/appointments")
      .then((res) => res.json())
      .then((data) => {
        setAppointments(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <Spinner animation="border" />;

  return (
    <ListGroup>
      {appointments.map((appointment) => (
        <ListGroup.Item key={appointment.appointment_id} className="d-flex flex-column">
          <div><FaCalendarAlt className="text-primary me-2" /> <strong>{appointment.date} - {appointment.time}</strong></div>
          <div>👤 {appointment.client_name}</div>
          <div>🐶 {appointment.pet_name}</div>
          <div>🔄 {appointment.status}</div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default AppointmentsList;
