/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.table('pets', function (table) {
    table.boolean('active').defaultTo(true)
  })
}

exports.down = function (knex) {
  return knex.schema.table('pets', function (table) {
    table.dropColumn('active')
  })
}
