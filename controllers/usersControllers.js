const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const knex = require('../config')

// Crear un nuevo usuario
const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, role, licence, password } = req.body

    // Validar si el usuario ya existe
    const existingUser = await knex('users').where('email', email).first()
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' })
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear el usuario
    const [newUser] = await knex('users').insert({
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      role,
      licence,
      password: hashedPassword,
      active: true, // Asumiendo que los usuarios nuevos están activos
      created_at: knex.fn.now(), // Timestamp para creación
      updated_at: knex.fn.now() // Timestamp para actualización
    }).returning('*') // Obtener los datos insertados

    // Generar un token
    const token = jwt.sign(
      { user_id: newUser.user_id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    return res.status(201).json({ message: 'User created successfully', token })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error creating user', error: error.message })
  }
}

// Login
const login = async (req, res) => {
  // Validar que el email y el password vengan en el body
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: 'Email and Password are required' })
  }

  try {
    // Buscar al usuario en la base de datos con el correo proporcionado.
    const user = await knex('users').where({ email: req.body.email }).first()

    if (!user) {
      return res.status(400).json({ message: 'Email or Password Error' })
    }

    // Comparar la contraseña proporcionada con la contraseña almacenada en la base de datos.
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password)

    // Si la contraseña es incorrecta: Error 401 (Unauthorized)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email or Password Error' })
    }

    // Generar un token de autenticación (JWT)
    const payload = {
      user_id: user.user_id,
      email: user.email,
      role: user.role
    }

    // Crear el token con el método sign de JWT
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })

    // Devolver el token en la respuesta
    return res.status(200).json({ message: 'User Logged In', token })
  } catch (error) {
    return res.status(500).json({ message: 'Error Logging In', error: error.message })
  }
}

// Obtener todos los usuarios
const findAllUsers = async (req, res) => {
  try {
    const users = await knex('users').where({ active: true }) // Solo obtener usuarios activos
    return res.status(200).json({ users })
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching users', error: error.message })
  }
}

// Obtener un solo usuario por ID
const findOneUser = async (req, res) => {
  const { idUser } = req.params
  try {
    const user = await knex('users').where({ user_id: idUser }).first()
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    return res.status(200).json({ user })
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching user', error: error.message })
  }
}

// Actualizar un usuario por ID
const updateOneUser = async (req, res) => {
  const { idUser } = req.params
  const { firstName, lastName, email, phone, role, licence, password } = req.body

  try {
    const user = await knex('users').where({ user_id: idUser }).first()
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Encriptar nueva contraseña si se proporciona
    const updatedPassword = password ? await bcrypt.hash(password, 10) : user.password

    const [updatedUser] = await knex('users')
      .where({ user_id: idUser })
      .update({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        role,
        licence,
        password: updatedPassword,
        updated_at: knex.fn.now() // Actualizar el timestamp
      })
      .returning('*') // Obtener el usuario actualizado

    return res.status(200).json({ message: 'User updated successfully', updatedUser })
  } catch (error) {
    return res.status(500).json({ message: 'Error updating user', error: error.message })
  }
}

// Borrar un usuario por ID (Soft delete)
const softDeleteOneUser = async (req, res) => {
  const { idUser } = req.params
  try {
    const user = await knex('users').where({ user_id: idUser }).first()
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    await knex('users').where({ user_id: idUser }).update({ active: false })
    return res.status(200).json({ message: 'User soft deleted successfully' })
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting user', error: error.message })
  }
}

// Borrar un usuario por ID (Hard delete)
const destroyOneUser = async (req, res) => {
  const { idUser } = req.params
  try {
    const user = await knex('users').where({ user_id: idUser }).first()
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    await knex('users').where({ user_id: idUser }).del()
    return res.status(200).json({ message: 'User permanently deleted' })
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting user', error: error.message })
  }
}

module.exports = {
  createUser,
  login,
  findAllUsers,
  findOneUser,
  updateOneUser,
  softDeleteOneUser,
  destroyOneUser
}
