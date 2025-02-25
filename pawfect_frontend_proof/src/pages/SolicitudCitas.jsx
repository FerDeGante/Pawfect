import React, { useState } from "react";
import "../styles/styles.sass";

function SolicitudCitas() {
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    mascota: "",
    fecha: "",
    hora: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("¡Cita solicitada con éxito! Nos pondremos en contacto contigo.");
  };

  return (
    <div className="solicitud-citas-container">
      <h2>Agenda una Cita</h2>
      <form onSubmit={handleSubmit} className="solicitud-citas-form">
        <label>Nombre</label>
        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />

        <label>Teléfono</label>
        <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required />

        <label>Tipo de Mascota</label>
        <select name="mascota" value={formData.mascota} onChange={handleChange} required>
          <option value="">Selecciona</option>
          <option value="perro">Perro</option>
          <option value="gato">Gato</option>
          <option value="otro">Otro</option>
        </select>

        <label>Fecha</label>
        <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} required />

        <label>Hora</label>
        <input type="time" name="hora" value={formData.hora} onChange={handleChange} required />

        <button type="submit" className="cta-button">Solicitar Cita</button>
      </form>
    </div>
  );
}

export default SolicitudCitas;
