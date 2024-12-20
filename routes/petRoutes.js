// Importar express
const express = require('express')
const router = express.Router()

// Importar el controlador de mascotas
const petController = require('../controllers/petsController')
const { isAuth, isAdminOrOwner } = require('../middleware/authMiddleware')

// Definir las rutas con el router
router.post('/', isAuth, isAdminOrOwner, petController.createPet)
router.get('/', isAuth, isAdminOrOwner, petController.findAllPets)
router.get('/:idPet', isAuth, isAdminOrOwner, petController.findOnePet)
router.put('/:idPet', isAuth, isAdminOrOwner, petController.updatePet)
router.delete('/:idPet', isAuth, isAdminOrOwner, petController.softDeleteOnePet)
router.delete('/destroy/:idPet', isAuth, isAdminOrOwner, petController.destroyOnePet)

// Exportar el router
module.exports = router
