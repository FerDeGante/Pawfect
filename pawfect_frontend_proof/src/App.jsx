import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import AdminNavbar from "./components/AdminNavbar";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles/styles.sass";

// Páginas
import Inicio from "./pages/Inicio";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import Citas from "./pages/Citas";
import ClientsTable from "./pages/ClientsTable";
import Mascotas from "./pages/MascotasTable";
import Productos from "./pages/ProductosTable";
import Medicamentos from "./pages/MedicamentosTable";
import Usuarios from "./pages/Usuarios";
import MiNegocio from "./pages/MiNegocio";

function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="app-container">
      {isAdminPage ? <AdminNavbar /> : <Navbar />}
      
      <div className={`content-container ${isAdminPage ? "admin-layout" : ""}`}>
        {isAdminPage && <Sidebar />}
        
        <div className="dashboard-container">
          <div className="dashboard-content">
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Rutas Administración */}
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/admin/citas" element={<Citas />} />
              <Route path="/admin/clientes" element={<ClientsTable />} />
              <Route path="/admin/mascotas" element={<Mascotas />} />
              <Route path="/admin/productos" element={<Productos />} />
              <Route path="/admin/medicamentos" element={<Medicamentos />} />
              <Route path="/admin/usuarios" element={<Usuarios />} />
              <Route path="/admin/minegocio" element={<MiNegocio />} />
            </Routes>
          </div>
        </div>
      </div>

      {!isAdminPage && <Footer />}
    </div>
  );
}

export default App;