/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  // Se necesita borrar las tablas en un orden específico para evitar errores de FK
  // y reiniciar la secuencia de IDs para que los registros sean consecutivos.
  await knex.raw('TRUNCATE consultation_products RESTART IDENTITY CASCADE')

  // Insertamos datos en la tabla consultation_products
  // consultation_product_id (PK), fk_consultation_id (FK hacia consultations), fk_product_id (FK hacia products), quantity_used, created_at, updated_at
  await knex('consultation_products').insert([
    {
      fk_consultation_id: 1,
      fk_product_id: 1,
      quantity_used: 1,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      fk_consultation_id: 1,
      fk_product_id: 2,
      quantity_used: 1,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      fk_consultation_id: 1,
      fk_product_id: 6,
      quantity_used: 1,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      fk_consultation_id: 2,
      fk_product_id: 1,
      quantity_used: 1,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      fk_consultation_id: 3,
      fk_product_id: 4,
      quantity_used: 1,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      fk_consultation_id: 3,
      fk_product_id: 6,
      quantity_used: 1,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      fk_consultation_id: 3,
      fk_product_id: 16,
      quantity_used: 1,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    }
  ])
}
