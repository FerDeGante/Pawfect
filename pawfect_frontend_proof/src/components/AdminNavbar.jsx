import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminNavbar = ({ sidebarExpanded }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("Usuario"); // Estado para el nombre
  const [userRole, setUserRole] = useState("Rol"); // Estado para el rol
  const navigate = useNavigate();

  // Obtener la información del usuario
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Hacer una solicitud al backend para obtener la información del usuario
      axios
        .get("http://localhost:3000/api/v1/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const user = response.data;
          setUserName(user.name); // Establece el nombre completo
          setUserRole(user.role); // Establece el rol
        })
        .catch((error) => {
          console.error("Error obteniendo información del usuario:", error);
        });
    }
  }, []);

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className={`admin-navbar ${sidebarExpanded ? "expanded" : ""}`}>
      <h1 className="nav-title">Panel de Administración</h1>
      <div className="admin-nav-links">
        <a href="http://localhost:5173/" className="admin-nav-link">
          Inicio
        </a>
        <a
          href="http://localhost:5173/admin-dashboard/"
          className="admin-nav-link"
        >
          Panel de control
        </a>
        <div
          className="admin-profile"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <FaUserCircle className="profile-icon" />
          <span className="profile-name">
            {userName} ({userRole}) {/* Muestra el nombre y el rol */}
          </span>

          {/* Menú desplegable */}
          {isDropdownOpen && (
            <div className="profile-dropdown">
              <button className="dropdown-item" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;