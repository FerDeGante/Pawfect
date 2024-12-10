// Llamar a express
const express = require('express')

// Instancia de express
const app = express()

// Configurar mi instancia de express
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rutas
app.get('/', (req, res) => {
  res.send('Hello World')
})

// Iniciar el servidor
app.listen(3000, () => {
  console.log('Server on port 3000 🚀')
})
