// Dependiendo de la variable de entorno del sistema se va a cambiar la configuración de la base de datos
// Voy a tomar la configuración del entorno de Node, si no existe voy a usar development

const env = process.env.NODE_ENV || 'development'
const knexfile = require('./knexfile')
const knex = require('knex')

// Mando a llamar a Knex con la configuración adecuada
module.exports = knex(knexfile[env])
