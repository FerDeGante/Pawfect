
# 🐾 Pawfect

**Pawfect** es una plataforma de gestión veterinaria completa, diseñada para ayudar a clínicas veterinarias a administrar sus operaciones de forma eficiente. Incluye funcionalidades para el control de mascotas, clientes, doctores, productos y medicamentos, con un enfoque moderno y escalable.

---

## 📁 Estructura del proyecto

Pawfect/
│
├── api/ # Backend en Node.js con Express y Knex
│
├── pawfect_frontend/ # Primer prototipo del frontend (React)
│
├── pawfect_frontend_proof/ # Versión más completa y refinada del frontend

yaml
Copiar
Editar

---

## ⚙️ Tecnologías utilizadas

### Backend

- Node.js + Express
- PostgreSQL
- Knex.js
- JWT para autenticación
- Control de acceso por roles (`admin`, `employee`, `owner`)

### Frontend

- React + Vite
- Bootstrap
- Axios para conexión con la API

---

## 🚀 Funcionalidades clave

- CRUD de mascotas, clientes, doctores, productos y medicamentos
- Gestión por roles (administrador, empleado, dueño)
- Dashboard para administración
- Integración QR para clientes
- Diseño responsive y optimizado para uso clínico

---

## 🛠️ Instalación local

### Clona el repositorio

```bash
git clone https://github.com/FerDeGante/Pawfect.git
cd Pawfect
Backend
bash
Copiar
Editar
cd api
npm install
npx knex migrate:latest
npx knex seed:run
npm run dev
Asegúrate de tener PostgreSQL corriendo y configurar tu .env

Frontend
bash
Copiar
Editar
cd ../pawfect_frontend_proof
npm install
npm run dev
📦 Próximas mejoras
Módulo de agenda y reservaciones

Sistema de pagos en línea

Gestión de stock inteligente

Notificaciones automáticas

Dashboard del cliente final

🤝 Contribuciones
Las contribuciones están abiertas. Si deseas aportar mejoras o detectar errores, ¡eres bienvenido!

📄 Licencia
Este proyecto es de código cerrado (por ahora). Todos los derechos reservados a Fer De Gante.
```
