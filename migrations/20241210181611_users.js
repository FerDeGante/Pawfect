/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  // Atributos user_id (PK) first_name, last_name, email (único), phone, password, role ('owner', 'employee', 'veterinarian', 'admin'), created_at, updated_at, licence (solo para 'veterinarians', puede ser nulo),  active
  return knex.schema.hasTable('users').then(function (exists) {
    if (!exists) {
      return knex.schema.createTable('users', function (table) {
        table.increments('user_id').primary()
        table.string('first_name', 255).notNullable()
        table.string('last_name', 255).notNullable()
        table.string('email', 255).notNullable().unique()
        table.string('phone', 255).notNullable()
        table.string('password', 255).notNullable()
        table.enum('role', ['owner', 'employee', 'veterinarian', 'admin']).notNullable().defaultTo('owner')
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
        table.string('licence', 255)
        table.boolean('active').notNullable().defaultTo(true)
      })
    }
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  // Borro la tabla users
  return knex.schema.hasTable('users').then(function (exists) {
    if (exists) {
      return knex.schema.dropTable('users')
    }
  })
}
