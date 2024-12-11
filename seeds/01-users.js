/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 * author: Fernando De Gante
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  // Se necesita borrar las tablas en un orden específico para evitar errores de FK. Es necesario reiniciar la secuencia e las tablas para que los nuevos registros tengan un id consecutivo que empiece con 1 cada vez que se ejecuta
  await knex.raw('TRUNCATE users RESTART IDENTITY CASCADE')

  await knex('users').insert([
    {
      first_name: 'Stephen',
      last_name: 'Hawking',
      email: 'stephen.hawking@example.com',
      phone: '123456789',
      password: 'password123', // Asegúrate de usar una contraseña cifrada si es necesario
      role: 'owner',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      licence: null,
      years_experience: null
    },
    {
      first_name: 'Albert',
      last_name: 'Einstein',
      email: 'albert.einstein@example.com',
      phone: '987654321',
      password: 'password123',
      role: 'veterinarian',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      licence: 'VET12345', // Asumiendo que es un veterinario con licencia
      years_experience: 20
    },
    {
      first_name: 'Fernando',
      last_name: 'De Gante',
      email: 'fernando.degante@example.com',
      phone: '5555555555',
      password: 'password123',
      role: 'admin',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      licence: null,
      years_experience: null
    },
    {
      first_name: 'Princess',
      last_name: 'Leia',
      email: 'princess.leia@example.com',
      phone: '111223344',
      password: 'password123',
      role: 'employee',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      licence: null,
      years_experience: null
    }
  ])
}
