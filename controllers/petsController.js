const ModelPets = require('../models/pets')
const ModelUsers = require('../models/users')

// CREATE  Sólo el user con role de 'owner' puede crear una mascota
const createPet = async (req, res) => {
  const { name, type, breed, birthdate, fkUserId } = req.body

  // Validar el rol del usuario
  const userRole = await ModelUsers.findRoleById(fkUserId)
  if (userRole.role !== 'owner') {
    return res.status(403).json({ error: 'Solo los dueños pueden registrar mascotas.' })
  }

  // Validar que todos los campos requeridos estén presentes
  if (!name || !type || !breed || !birthdate) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' })
  }

  const pet = {
    name,
    type,
    breed,
    birthdate,
    fk_user_id: fkUserId, // Asegúrate de que el userId se asigna correctamente
    created_at: new Date(),
    updated_at: new Date()
  }

  ModelPets.create(pet)
    .then((newPet) => {
      res.status(201).json(newPet)
    })
    .catch((error) => {
      res.status(400).json({ error: error.message })
    })
}

// READ find all pets
const findAllPets = (req, res) => {
  ModelPets.findAll()
    .then((pets) => {
      res.status(200).json(pets)
    })
    .catch((error) => {
      res.status(400).json({ error: error.message })
    })
}

// READ find one pet by id
const findOnePet = (req, res) => {
  const { idPet } = req.params

  ModelPets.findById(idPet)
    .then((pet) => {
      if (!pet) {
        return res.status(404).json({ error: 'Pet not found' })
      }
      res.status(200).json(pet)
    })
    .catch((error) => {
      res.status(400).json({ error: error.message })
    })
}

// UPDATE pets
const updatePet = async (req, res) => {
  const { idPet } = req.params
  const { name, type, breed, birthdate, fkUserId } = req.body

  // Validar el rol del usuario
  const userRole = await ModelUsers.findRoleById(fkUserId)
  if (userRole.role !== 'owner') {
    return res.status(403).json({ error: 'Solo los dueños pueden actualizar mascotas.' })
  }

  // Validar que todos los campos requeridos estén presentes
  if (!name || !type || !breed || !birthdate) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' })
  }

  const updatedPet = {
    name,
    type,
    breed,
    birthdate,
    fk_user_id: fkUserId,
    updated_at: new Date()
  }

  ModelPets.update(idPet, updatedPet)
    .then((pet) => {
      if (!pet) {
        return res.status(404).json({ error: 'Pet not found' })
      }
      res.status(200).json(pet)
    })
    .catch((error) => {
      res.status(400).json({ error: error.message })
    })
}

// DELETE borrar una mascota por ID (soft delete)
const softDeleteOnePet = async (req, res) => {
  const { idPet } = req.params
  try {
    const pet = await ModelPets.findById(idPet)
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' })
    }
    await ModelPets.softDelete(idPet)
    return res.status(200).json({ message: 'Pet deleted successfully' })
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting pet', error: error.message })
  }
}

// DELETE borrar una mascota por ID (hard delete)
const destroyOnePet = async (req, res) => {
  const { idPet } = req.params
  try {
    const pet = await ModelPets.findById(idPet)
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' })
    }
    await ModelPets.destroy(idPet)
    return res.status(200).json({ message: 'Pet destroyed successfully' })
  } catch (error) {
    return res.status(500).json({ message: 'Error destroying pet', error: error.message })
  }
}

// Exportar las funciones
module.exports = {
  createPet,
  findAllPets,
  findOnePet,
  updatePet,
  softDeleteOnePet,
  destroyOnePet
}
