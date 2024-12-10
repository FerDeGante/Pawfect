/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  // atributos son - employee_id (PK)
  // - first_name
  // - last_name
  // - email (unique)
  // - phone
  // - hire_date
  // - role (e.g., 'receptionist', 'veterinarian')
  // - licence (nullable, para veterinarios)
  // - years_experience (nullable, para veterinarios)
  // - password (si necesitas autenticación para empleados)
  // - timestamp
  return knex.schema.hasTable('employees').then(function (exists) {
    if (!exists) {
      return knex.schema.createTable('employees', function (table) {
        table.increments('employee_id').primary()
        table.string('first_name', 255).notNullable()
        table.string('last_name', 255).notNullable()
        table.string('email', 255).notNullable().unique()
        table.string('phone', 255).notNullable()
        table.date('hire_date').notNullable()
        table.string('role', 255).notNullable()
        table.string('licence', 255)
        table.integer('years_experience')
        table.string('password', 255)
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
  return knex.schema.hasTable('employees').then(function (exists) {
    if (exists) {
      return knex.schema.dropTable('employees')
    }
  })
}
