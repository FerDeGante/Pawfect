/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
// sus atributos son owner_id; first_name; last_name; email; phone; timestamp
  return knex.schema.hasTable('owners').then(function (exists) {
    if (!exists) {
      return knex.schema.createTable('owners', function (table) {
        table.increments('owner_id').primary()
        table.string('first_name', 255).notNullable()
        table.string('last_name', 255).notNullable()
        table.string('email', 255).notNullable()
        table.string('phone', 255).notNullable()
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
  return knex.schema.hasTable('owners').then(function (exists) {
    if (exists) {
      return knex.schema.dropTable('owners')
    }
  })
}
