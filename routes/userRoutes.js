const express = require('express')
const router = express.Router()

// Asegúrate de que los controladores estén correctamente importados
const userController = require('../controllers/usersControllers')
const { isAuth } = require('../middleware/authMiddleware')

// Definir las rutas con el router
router.post('/', userController.createUser) // Sin middleware
router.get('/', isAuth, userController.findAllUsers) // Con middleware
router.get('/:idUser', userController.findOneUser)
router.patch('/:idUser', userController.updateOneUser)
router.delete('/:idUser', userController.softDeleteOneUser)
router.delete('/destroy/:idUser', userController.destroyOneUser)
router.post('/login', userController.login)

module.exports = router
