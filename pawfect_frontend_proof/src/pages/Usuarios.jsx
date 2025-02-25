import React, { useEffect, useState } from "react";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsuarios(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleEdit = (usuario) => {
    const newName = prompt("Nuevo nombre:", usuario.name);
    if (newName) {
      // Llamar a la API para actualizar el nombre
      fetch(`/api/users/${usuario.id}`, {
        method: "PUT",
        body: JSON.stringify({ name: newName }),
      }).then(() => {
        // Actualizar el estado local
        setUsuarios((prev) =>
          prev.map((u) => (u.id === usuario.id ? { ...u, name: newName } : u))
        );
      });
    }
  };

  const handleChangeRole = (usuario) => {
    const newRole = prompt("Nuevo rol (admin, owner, veterinarian, employee):");
    if (newRole) {
      // Llamar a la API para actualizar el rol
      fetch(`/api/users/${usuario.id}`, {
        method: "PUT",
        body: JSON.stringify({ role: newRole }),
      }).then(() => {
        // Actualizar el estado local
        setUsuarios((prev) =>
          prev.map((u) => (u.id === usuario.id ? { ...u, role: newRole } : u))
        );
      });
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <table className="usuarios-table">
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
          <tr key={usuario.id}>
            <td>{usuario.name}</td>
            <td>{usuario.email}</td>
            <td>{usuario.role}</td>
            <td>
              <button onClick={() => handleEdit(usuario)}>✏️ Editar</button>
              <button onClick={() => handleChangeRole(usuario)}>🔄 Cambiar Rol</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Usuarios;