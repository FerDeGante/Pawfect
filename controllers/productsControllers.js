const knex = require('../config')
const ModelUsers = require('../models/users')
const ModelProducts = require('../models/products')

// CREATE
const createProduct = async (req, res) => {
  try {
    const { name, category, quantity, price } = req.body
    const fkUserId = req.user.id // Obtenemos el ID del usuario del token

    // Validar el rol del usuario, solo los usuarios con role de admin o employee pueden crear productos
    const userRole = await ModelUsers.findRoleById(fkUserId)
    if (userRole.role !== 'admin' && userRole.role !== 'employee') {
      return res.status(403).json({ error: 'Solo los administradores y empleados pueden registrar productos.' })
    }

    // Validar que todos los campos requeridos estén presentes
    if (!name || !category || !quantity || !price) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' })
    }

    // Validar si el producto ya existe
    const existingProduct = await knex('products').where('name', name).first()
    if (existingProduct) {
      return res.status(400).json({ message: 'Product already exists' })
    }

    const product = {
      name,
      category,
      quantity,
      price,
      created_at: new Date(),
      updated_at: new Date()
    }

    const newProduct = await ModelProducts.create(product)
    return res.status(201).json(newProduct)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

// READ - findAllProducts
const findAllProducts = async (req, res) => {
  try {
    const fkUserId = req.user.id // Obtenemos el ID del usuario del token

    // Validar el rol del usuario, solo los usuarios con role de admin o employee pueden ver todos los productos
    const userRole = await ModelUsers.findRoleById(fkUserId)
    if (userRole.role !== 'admin' && userRole.role !== 'employee') {
      return res.status(403).json({ error: 'Solo los administradores y empleados pueden ver todos los productos.' })
    }

    const products = await ModelProducts.findAll()
    res.status(200).json(products)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// READ - findProductById
const findProductById = async (req, res) => {
  try {
    const { idProduct } = req.params
    const product = await ModelProducts.findById(idProduct)
    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }
    res.status(200).json(product)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// UPDATE - updateProduct
const updateProduct = async (req, res) => {
  try {
    const { idProduct } = req.params
    const { name, category, quantity, price } = req.body
    const fkUserId = req.user.id // Obtenemos el ID del usuario del token

    // Validar el rol del usuario
    const userRole = await ModelUsers.findRoleById(fkUserId)
    if (userRole.role !== 'admin' && userRole.role !== 'employee') {
      return res.status(403).json({ error: 'Solo los administradores y empleados pueden actualizar productos.' })
    }

    // Validar que todos los campos requeridos estén presentes
    if (!name || !category || !quantity || !price) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' })
    }

    const updatedProduct = {
      name,
      category,
      quantity,
      price,
      updated_at: new Date()
    }

    const product = await ModelProducts.update(idProduct, updatedProduct)
    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    res.status(200).json(product)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// DELETE - softDeleteProduct
// Eliminar producto (marcar como inactivo)
const softDeleteProduct = async (req, res) => {
  try {
    const { idProduct } = req.params
    const fkUserId = req.user.id

    // Validar el rol del usuario
    const userRole = await ModelUsers.findRoleById(fkUserId)
    if (userRole.role !== 'admin') {
      return res.status(403).json({ error: 'Solo los administradores pueden borrar productos.' })
    }

    const product = await ModelProducts.softDelete(idProduct)
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado.' })
    }

    res.status(200).json({ message: 'Producto marcado como inactivo.', product })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// DELETE - destroyProduct
const destroyProduct = async (req, res) => {
  try {
    const { idProduct } = req.params
    const fkUserId = req.user.id // Obtenemos el ID del usuario del token

    // Validar el rol del usuario
    const userRole = await ModelUsers.findRoleById(fkUserId)
    if (userRole.role !== 'admin') {
      return res.status(403).json({ error: 'Solo los administradores pueden borrar productos.' })
    }

    const product = await ModelProducts.destroy(idProduct)
    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    res.status(200).json({ message: 'Product deleted' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  createProduct,
  findAllProducts,
  findProductById,
  updateProduct,
  softDeleteProduct,
  destroyProduct
}
