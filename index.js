// #1 Importar express
const express = require('express')
const PORT = process.env.PORT || 3000

// Importar las rutas de mi vista users
const userRoutes = require('./routes/userRoutes')
// #2 Crear una instancia de express
const app = express()

// #3 Congiurar express para que entienda JSON y datos de formularios
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// #4 Crear rutas
app.use('/api/v1', userRoutes)

// #5 Levantar el servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en el puerto 3000🚀')
})
