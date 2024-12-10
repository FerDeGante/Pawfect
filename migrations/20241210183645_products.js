/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  // product_id (PK), name, category, quantity, price, created_at, updated_at
  return knex.schema.hasTable('products').then(function (exists) {
    if (!exists) {
      return knex.schema.createTable('products', function (table) {
        table.increments('product_id').primary()
        table.string('name', 255).notNullable()
        table.enum('category', ['medicine', 'toy', 'food', 'bath']).notNullable()
        table.integer('quantity').notNullable()
        table.decimal('price', 10, 2).notNullable() // Especificamos la precisión del precio
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
      })
    }
  })
}

/**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
exports.down = function (knex) {
  // Borro la tabla products
  return knex.schema.hasTable('products').then(function (exists) {
    if (exists) {
      return knex.schema.dropTable('products')
    }
  })
}
