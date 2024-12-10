/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.hasTable('pets').then(function (exists) {
    if (exists) {
      return knex.schema.table('pets', function (table) {
        // Agregar la columna fk_user como clave foránea
        table.integer('fk_user').unsigned().notNullable() // Asegúrate de que la columna no sea nula
        table.foreign('fk_user').references('users.user_id') // Definir la clave foránea
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
      return knex.schema.table('pets', function (table) {
        table.dropColumn('fk_user') // Eliminar la columna fk_user
      })
    }
  })
}
