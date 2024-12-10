/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  // atributos son id; consultation_id; product_id; quantity_used; timestamp
  return knex.schema.hasTable('consultation_products').then(function (exists) {
    if (!exists) {
      return knex.schema.createTable('consultation_products', function (table) {
        table.increments('id').primary()
        table.integer('consultation_id').unsigned().notNullable()
        table.foreign('consultation_id').references('consultation_id').inTable('consultations')
        table.integer('product_id').unsigned().notNullable()
        table.foreign('product_id').references('product_id').inTable('products')
        table.integer('quantity_used').notNullable()
        table.timestamp('timestamp').defaultTo(knex.fn.now())
      })
    }
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.hasTable('consultation_products').then(function (exists) {
    if (exists) {
      return knex.schema.dropTable('consultation_products')
    }
  })
}
