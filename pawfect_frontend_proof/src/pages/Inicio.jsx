import React from "react";
import { FaStethoscope, FaHeartbeat, FaFlask, FaPaw, FaCut, FaSyringe, FaStore, FaHome, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom"; // Asegúrate de importar Link si lo estás usando
import 'bootstrap/dist/css/bootstrap.min.css';
import "../styles/styles.sass";

const services = [
  { name: "Consulta General", icon: <FaStethoscope style={{ color: "#FF5733" }} /> },
  { name: "Cirugía", icon: <FaHeartbeat style={{ color: "#33A1FF" }} /> },
  { name: "Pruebas de Laboratorio", icon: <FaFlask style={{ color: "#FFD700" }} /> },
  { name: "Ultrasonografía", icon: <FaPaw style={{ color: "#4CAF50" }} /> },
  { name: "Baño y Peluquería", icon: <FaCut style={{ color: "#FF69B4" }} /> },
  { name: "Vacunas", icon: <FaSyringe style={{ color: "#FF4500" }} /> },
  { name: "Venta de Accesorios y Medicamentos", icon: <FaStore style={{ color: "#8A2BE2" }} /> },
  { name: "Pensión y guardería", icon: <FaHome style={{ color: "#00CED1" }} /> },
];

function Inicio() {
  return (
    <div className="inicio-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h1>Bienvenido a Atlauhtli 🐾🐈</h1>
          <p>El mejor cuidado para tu mascota, en nuestra casa de sanación animal con un equipo comprometido.</p>
          <button className="cta-button">Agenda tu cita</button>
        </div>
      </section>

      {/* Beneficios */}
      <section className="benefits">
        <div className="benefit-card">
          <FaPaw className="icon" />
          <h3>Cuidado Integral</h3>
          <p>Veterinarios expertos listos para atender a tu mascota.</p>
        </div>
        <div className="benefit-card">
          <FaHeartbeat className="icon" />
          <h3>Urgencias 24/7</h3>
          <p>Siempre disponibles para emergencias y cuidados especiales.</p>
        </div>
        <div className="benefit-card">
          <FaStar className="icon" />
          <h3>Calidad Garantizada</h3>
          <p>Servicios certificados con los más altos estándares.</p>
        </div>
      </section>

      {/* Sección de Servicios */}
      <section className="services">
        <h2>Nuestros Servicios</h2>
        <div className="services-grid">
          {services.map((service, index) => (
            <div className="service-card" key={index}>
              <div className="icon">{service.icon}</div>
              <h3>{service.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Llamado a la acción */}
      <section className="call-to-action">
        <h2>¿Listo para darle lo mejor a tu mascota?</h2>
        <Link to="/citas" className="cta-button">Agenda una cita ahora</Link>
      </section>
    </div>
  );
}

export default Inicio;