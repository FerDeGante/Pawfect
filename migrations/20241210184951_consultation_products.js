/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  // consultation_product_id (PK), fk_consultation_id (FK hacia consultations), fk_product_id (FK hacia products), quantity_used, created_at, updated_at
  return knex.schema.hasTable('consultation_products').then(function (exists) {
    if (!exists) {
      return knex.schema.createTable('consultation_products', function (table) {
        table.increments('consultation_product_id').primary() // ID único para la relación
        table.integer('fk_consultation_id').unsigned().references('consultation_id').inTable('consultations').onDelete('CASCADE').notNullable() // FK hacia consultations
        table.integer('fk_product_id').unsigned().references('product_id').inTable('products').onDelete('CASCADE').notNullable() // FK hacia products
        table.integer('quantity_used').notNullable() // Cantidad de producto usado en la consulta
        table.timestamp('created_at').defaultTo(knex.fn.now()) // Marca de tiempo de creación
        table.timestamp('updated_at').defaultTo(knex.fn.now()) // Marca de tiempo de última actualización
      })
    }
  })
}

/**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
exports.down = function (knex) {
  // Borro la tabla consultation_products si existe
  return knex.schema.hasTable('consultation_products').then(function (exists) {
    if (exists) {
      return knex.schema.dropTable('consultation_products')
    }
  })
}
