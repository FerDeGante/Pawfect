const express = require('express')
const router = express.Router()
const userController = require('..//controllers/usersControllers')

// Definir las rutas con el router
router.post('/users', userController.createUser)

// Exportar el router
module.exports = router
