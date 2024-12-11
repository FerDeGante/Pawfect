// #1 Importar el modelo
const ModelUsers = require('../models/users')

// #2 Procedo al CRUD
// CREATE
const createUser = (req, res) => {
  const { firstName, lastName, email, phone, role, licence, yearsExperience, password } = req.body

  // Validación de campos obligatorios
  if (!password) {
    return res.status(400).json({ error: 'La contraseña es obligatoria.' })
  }

  // Validación: Si el rol es 'veterinarian', asegúrate de que 'licence' y 'yearsExperience' estén presentes
  if (role === 'veterinarian' && (!licence || !yearsExperience)) {
    return res.status(400).json({ error: 'Licencia y años de experiencia son obligatorios para los veterinarios.' })
  }

  // Crear el objeto de usuario con los datos proporcionados
  const user = {
    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    role,
    licence: licence || null,
    years_experience: yearsExperience || null,
    password // Guardar la contraseña como está (sin hash)
  }

  // Insertar el usuario en la base de datos
  ModelUsers.create(user)
    .then((newUser) => {
      // Responder con el usuario creado
      res.status(201).json(newUser)
    })
    .catch((error) => {
      res.status(400).json({ error: error.message })
    })
}

// READ
const findAllUsers = (req, res) => {
  ModelUsers.findAll()
    .then((users) => {
      res.status(200).json(users)
    })
    .catch((error) => {
      res.status(400).json({ error: error.message })
    })
}
const findOneUser = (req, res) => {
  const { idUser } = req.params // Extraer idUser de los parámetros de la URL
  ModelUsers.findOne(idUser)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' })
      }
      res.status(200).json(user)
    })
    .catch((error) => {
      res.status(400).json({ error: error.message })
    })
}

// UPDATE
const updateOneUser = (req, res) => {
  ModelUsers.update(req.params.idUser, req.body)
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' })
      }
      res.status(200).json(user)
    })
}
// DELETE
const softDeleteOneUser = (req, res) => {
  ModelUsers.softDelete(req.params.idUser)
    .then(user => res.status(204).json())
    .catch(error => res.status(400).json({ error: error.message }))
}
const destroyOneUser = (req, res) => {
  ModelUsers.destroy(req.params.idUser)
    .then(user => res.status(204).json())
    .catch(error => res.status(400).json({ error: error.message }))
}

// #3 Exportar las funciones
module.exports = {
  createUser,
  findAllUsers,
  findOneUser,
  updateOneUser,
  softDeleteOneUser,
  destroyOneUser
}
