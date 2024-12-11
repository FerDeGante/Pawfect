const express = require('express')
const router = express.Router()
const userController = require('..//controllers/usersControllers')

// Definir las rutas con el router
router.post('/users', userController.createUser)
router.get('/users', userController.findAllUsers)
router.get('/users/:idUser', userController.findOneUser)
router.patch('/users/:idUser', userController.updateOneUser)
router.delete('/users/:idUser', userController.softDeleteOneUser)
router.delete('/users/destroy/:idUser', userController.destroyOneUser)

// Exportar el router
module.exports = router
