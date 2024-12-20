const knex = require('../config')

// Crear un nuevo producto
const create = (bodyProduct) => {
  return knex('products')
    .insert(bodyProduct)
    .returning(['product_id', 'name', 'category', 'quantity', 'price', 'active', 'created_at', 'updated_at'])
}

// Obtener todos los productos activos
const findAll = async () => {
  return knex('products').where('active', true).select('*')
}

// Obtener un producto por su ID (si está activo)
const findById = async (productId) => {
  return knex('products').where({ product_id: productId, active: true }).first()
}

// Actualizar un producto por su ID
const update = async (productId, bodyProduct) => {
  return knex('products')
    .where('product_id', productId)
    .update(bodyProduct)
    .returning(['product_id', 'name', 'category', 'quantity', 'price', 'active', 'created_at', 'updated_at'])
}

// Marcar un producto como inactivo
const softDelete = async (productId) => {
  return knex('products')
    .where('product_id', productId)
    .update({ active: false, updated_at: new Date() })
    .returning(['product_id', 'name', 'category', 'quantity', 'price', 'active', 'created_at', 'updated_at'])
}

// Eliminar un producto físicamente
const destroy = async (productId) => {
  return knex('products')
    .where('product_id', productId)
    .del()
}

// Exportar funciones
exports.create = create
exports.findAll = findAll
exports.findById = findById
exports.update = update
exports.softDelete = softDelete
exports.destroy = destroy
