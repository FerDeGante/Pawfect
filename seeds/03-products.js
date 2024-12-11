/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  // Se necesita borrar las tablas en un orden específico para evitar errores de FK
  // y reiniciar la secuencia de IDs para que los registros sean consecutivos.
  await knex.raw('TRUNCATE products RESTART IDENTITY CASCADE')

  // Insertamos datos en la tabla products
  // product_id (PK), name, category, quantity, price, created_at, updated_at
  await knex('products').insert([
    // Medicine
    {
      name: 'Anti-flea Drops',
      category: 'medicine',
      quantity: 25,
      price: 15.99,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      name: 'Vitamin Supplement',
      category: 'medicine',
      quantity: 30,
      price: 10.50,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      name: 'Deworming Tablets',
      category: 'medicine',
      quantity: 40,
      price: 8.99,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      name: 'Pain Reliever Syrup',
      category: 'medicine',
      quantity: 20,
      price: 12.00,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      name: 'Ear Cleaning Solution',
      category: 'medicine',
      quantity: 15,
      price: 6.75,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    // Food
    {
      name: 'Chicken Dry Food',
      category: 'food',
      quantity: 50,
      price: 25.00,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      name: 'Salmon Wet Food',
      category: 'food',
      quantity: 30,
      price: 20.50,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      name: 'Grain-Free Dog Biscuits',
      category: 'food',
      quantity: 100,
      price: 12.99,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      name: 'Kitten Formula Milk',
      category: 'food',
      quantity: 20,
      price: 18.75,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      name: 'Dental Chews',
      category: 'food',
      quantity: 60,
      price: 14.99,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    // Toy
    {
      name: 'Chewable Bone Toy',
      category: 'toy',
      quantity: 50,
      price: 8.00,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      name: 'Catnip Ball',
      category: 'toy',
      quantity: 25,
      price: 4.99,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      name: 'Rope Tug Toy',
      category: 'toy',
      quantity: 30,
      price: 7.50,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      name: 'Squeaky Plush Dog Toy',
      category: 'toy',
      quantity: 40,
      price: 9.99,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      name: 'Laser Pointer',
      category: 'toy',
      quantity: 20,
      price: 5.75,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    // Bath
    {
      name: 'Dog Shampoo',
      category: 'bath',
      quantity: 20,
      price: 12.50,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      name: 'Flea Comb',
      category: 'bath',
      quantity: 15,
      price: 6.99,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      name: 'Paw Cleaning Foam',
      category: 'bath',
      quantity: 25,
      price: 8.99,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      name: 'Cat Bath Wipes',
      category: 'bath',
      quantity: 30,
      price: 10.75,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      name: 'Towel Set',
      category: 'bath',
      quantity: 10,
      price: 15.00,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    }
  ])
}
