/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  // Se necesita borrar las tablas en un orden específico para evitar errores de FK
  // y reiniciar la secuencia de IDs para que los registros sean consecutivos.
  await knex.raw('TRUNCATE consultations RESTART IDENTITY CASCADE')

  // Insertamos datos en la tabla consultations
  // consultation_id (PK), consultation_date, diagnosis, treatment, fk_pet (FK hacia pets), fk_user (FK hacia users, usuario que atiende la consulta), created_at, updated_at
  await knex('consultations').insert([
    {
      consultation_date: '2024-12-10T10:00:00', // Asegúrate que el formato de fecha sea adecuado
      diagnosis: 'Ear infection',
      treatment: 'Ear drops',
      fk_pet: 1,
      fk_user: 2,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      consultation_date: '2024-12-11T10:00:00',
      diagnosis: 'Fever',
      treatment: 'Antipyretic',
      fk_pet: 2,
      fk_user: 2,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      consultation_date: '2024-12-12T10:00:00',
      diagnosis: 'Fracture',
      treatment: 'Surgery',
      fk_pet: 3,
      fk_user: 2,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    }
  ])
}
