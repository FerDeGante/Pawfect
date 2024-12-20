const knex = require('../config')

// CREATE
const create = async (pet) => {
  return knex('pets').insert(pet).returning('*')
}

// READ
const findAll = async () => {
  return knex('pets').select('*').where('active', true)
}

const findById = async (petId) => {
  return knex('pets').where('pet_id', petId).where('active', true).first()
}

// UPDATE
const update = async (petId, bodyToUpdate) => {
  try {
    return await knex('pets')
      .update(bodyToUpdate)
      .from('pets')
      .where('pet_id', petId)
      .returning([
        'pet_id',
        'name',
        'type',
        'breed',
        'birthdate',
        'fk_user_id',
        'created_at',
        'updated_at'
      ])
  } catch (error) {
    throw new Error('Error al actualizar la mascota: ' + error.message)
  }
}

// DELETE
// un delete y un destroy de pets
// El softDelete es un borrado lógico, es decir, no se borra el registro de la base de datos, sino que se actualiza un campo llamado active a false.
const softDelete = async (petId) => {
  return knex('pets')
    .update({ active: false })
    .where('pet_id', petId)
}

// El destroy es un borrado físico, es decir, se borra el registro de la base de datos.
const destroy = async (petId) => {
  return knex('pets')
    .delete()
    .where('pet_id', petId)
}

// #3 Exportar las funciones para que sean accesibles desde el controlador
exports.create = create
exports.findAll = findAll
exports.findById = findById
exports.update = update
exports.softDelete = softDelete
exports.destroy = destroy
