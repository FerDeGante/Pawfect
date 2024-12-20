// #1 traer la configuración del entorno de knex y su información de la base de datos
const knex = require('../config')

// #2 Crear funciones que permitan interactuar con la tabla users

// CRUD
// CREATE
// Crear un nuevo usuario
const create = (bodyUser) => {
  return knex
    .insert(bodyUser) // Qué datos voy a insertar
    .into('users') // En qué tabla
    .returning(['user_id', 'first_name', 'last_name', 'email', 'phone', 'role', 'created_at', 'updated_at', 'licence', 'password']) // Qué datos voy a retornar
}
// READ
// find all users
const findAll = () => {
  return knex
    .select('*')
    .from('users')
    .where('active', true)
}
// find one user
const findOne = (userId) => {
  return knex
    .select('*')
    .from('users')
    .where('user_id', userId)
    .where('active', true)
}
// Buscar un usuario por email (para login)
const findOneByEmail = (email) => {
  return knex
    .select('*')
    .from('users')
    .where('email', email)
    .where('active', true)
    .first() // Retorna solo un usuario
}

// Obtener el rol de un usuario por su ID
const findRoleById = (userId) => {
  return knex
    .select('role')
    .from('users')
    .where('user_id', userId)
    .first()
}

// UPDATE
// actualizar un usuario
const update = (userId, bodyToUpdate) => {
  return knex('users')
    .update(bodyToUpdate)
    .from('users')
    .where('user_id', userId)
    .returning(['user_id', 'first_name', 'last_name', 'email',
      'phone', 'role', 'created_at', 'updated_at', 'licence', 'password'])
}

// DELETE
// un delete y un destroy
// El softDelete es un borrado lógico, es decir, no se borra el registro de la base de datos, sino que se actualiza un campo llamado active a false.
const softDelete = (userId) => {
  return knex
    .update({ active: false })
    .from('users')
    .where('user_id', userId)
}
// El destroy es un borrado físico, es decir, se borra el registro de la base de datos.
const destroy = (userId) => {
  return knex
    .delete()
    .from('users')
    .where('user_id', userId)
}

// #3 Exportar las funciones para que sean accesibles desde el controlador
exports.create = create
exports.findAll = findAll
exports.findOne = findOne
exports.update = update
exports.softDelete = softDelete
exports.destroy = destroy
exports.findOneByEmail = findOneByEmail
exports.findRoleById = findRoleById
