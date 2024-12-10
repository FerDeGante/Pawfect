/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  // atributos son consultation_id; date; diagnosis; treatment; pet_id; user_id; timestamp
  return knex.schema.hasTable('consultations').then(function (exists) {
    if (!exists) {
      return knex.schema.createTable('consultations', function (table) {
        table.increments('consultation_id').primary()
        table.date('date').notNullable()
        table.string('diagnosis', 255).notNullable()
        table.string('treatment', 255).notNullable()
        table.integer('pet_id').unsigned().notNullable()
        table.foreign('pet_id').references('pet_id').inTable('pets')
        table.integer('user_id').unsigned().notNullable()
        table.foreign('user_id').references('user_id').inTable('users')
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
  return knex.schema.hasTable('consultations').then(function (exists) {
    if (exists) {
      return knex.schema.dropTable('consultations')
    }
  })
}
