const express = require('express')
const PORT = process.env.PORT || 3000

// Importar las rutas de mi vista users, pets y products
const userRoutes = require('./routes/userRoutes')
const petRoutes = require('./routes/petRoutes')
const productRoutes = require('./routes/productRoutes')

// Crear una instancia de express
const app = express()

// Configurar express para que entienda JSON y datos de formularios
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Crear rutas
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/pets', petRoutes)
app.use('/api/v1/products', productRoutes)

// Levantar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}🚀`)
})

// Manejar rutas no encontradas
app.use((req, res, next) => {
  res.status(404).send('Ruta no encontrada')
})
