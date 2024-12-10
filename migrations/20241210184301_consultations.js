/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  // consultation_id (PK), consultation_date, diagnosis, treatment, fk_pet (FK hacia pets), fk_user (FK hacia users, usuario que atiende la consulta), created_at, updated_at
  return knex.schema.hasTable('consultations').then(function (exists) {
    if (!exists) {
      return knex.schema.createTable('consultations', function (table) {
        table.increments('consultation_id').primary()
        table.date('consultation_date').notNullable()
        table.string('diagnosis', 255).notNullable()
        table.string('treatment', 255).notNullable()

        // FK hacia la tabla pets
        table.integer('fk_pet').unsigned().notNullable().references('pet_id').inTable('pets')

        // FK hacia la tabla users (usuario que atiende la consulta)
        table.integer('fk_user').unsigned().notNullable().references('user_id').inTable('users')

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
  // Borro la tabla consultations
  return knex.schema.hasTable('consultations').then(function (exists) {
    if (exists) {
      return knex.schema.dropTable('consultations')
    }
  })
}
