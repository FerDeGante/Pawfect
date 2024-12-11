/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 * author: Fernando De Gante
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  // Se necesita borrar las tablas en un orden específico para evitar errores de FK
  // y reiniciar la secuencia de IDs para que los registros sean consecutivos.
  await knex.raw('TRUNCATE pets RESTART IDENTITY CASCADE')

  // Insertamos datos en la tabla pets
  await knex('pets').insert([
    {
      name: 'Yeon',
      type: 'dog',
      breed: 'Husky',
      birthdate: '2021-10-15', // Fecha de nacimiento
      fk_user_id: 1, // Stephen Hawking's user_id
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      name: 'Shun',
      type: 'dog',
      breed: 'Husky',
      birthdate: '2023-03-22', // Fecha de nacimiento
      fk_user_id: 1, // Stephen Hawking's user_id
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      name: 'Milo',
      type: 'cat',
      breed: 'Persian',
      birthdate: '2022-12-01', // Fecha de nacimiento
      fk_user_id: 1, // Stephen user_id
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    }
  ])
}
