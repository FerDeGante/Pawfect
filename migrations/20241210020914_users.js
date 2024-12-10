/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
//     atributos - user_id (PK)
// - email (unique)
// - password
// - role (e.g., 'owner', 'employee')
// - created_at
// - updated_at
  return knex.schema.hasTable('users').then(function (exists) {
    if (!exists) {
      return knex.schema.createTable('users', function (table) {
        table.increments('user_id').primary()
        table.string('email', 255).notNullable().unique()
        table.string('password', 255).notNullable()
        table.string('role', 255).notNullable()
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
  return knex.schema.hasTable('users').then(function (exists) {
    if (exists) {
      return knex.schema.dropTable('users')
    }
  })
}
