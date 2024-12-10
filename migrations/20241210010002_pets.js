/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  // atributos sonn pet_id; name; type; breed; age; owner_id; timestamp
  return knex.schema.hasTable('pets').then(function (exists) {
    if (!exists) {
      return knex.schema.createTable('pets', function (table) {
        table.increments('pet_id').primary()
        table.string('name', 255).notNullable()
        table.string('type', 255).notNullable()
        table.string('breed', 255).notNullable()
        table.integer('age').notNullable()
        table.integer('owner_id').unsigned().notNullable()
        table.foreign('owner_id').references('owner_id').inTable('owners')
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
  return knex.schema.hasTable('pets').then(function (exists) {
    if (exists) {
      return knex.schema.dropTable('pets')
    }
  })
}
