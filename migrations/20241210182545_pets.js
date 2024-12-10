/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  // pet_id (PK), name, type, breed, bithdate, fk_user_id (FK hacia users, solo para role 'owner'), created at, updated_at
  return knex.schema.hasTable('pets').then(function (exists) {
    if (!exists) {
      return knex.schema.createTable('pets', function (table) {
        table.increments('pet_id').primary()
        table.string('name', 255).notNullable()
        table.string('type', 255).notNullable()
        table.string('breed', 255).notNullable()
        table.integer('birthdate').notNullable()
        table.integer('fk_user_id').unsigned().references('users.user_id').onDelete('CASCADE').onUpdate('CASCADE')
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
  // Borro la tabla pets
  return knex.schema.hasTable('pets').then(function (exists) {
    if (exists) {
      return knex.schema.dropTable('pets')
    }
  })
}
