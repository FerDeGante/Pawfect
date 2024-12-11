// Tiene la lógica de la conexión a la base de datos, la configuración de la base de datos y la exportación de la conexión a la base de datos.

// #1 Importar el modelo
const ModelUsers = require('../models/users')

// #2 Procedo al CRUD
// CREATE
const createUser = (req, res) => {
  ModelUsers.create(req.body).then((user) => {
    res.status(201).json(user)
  }).catch((error) => {
    res.status(400).json(error.message)
  })
}

// #3 Exportar las funciones
module.exports = {
  createUser
}
