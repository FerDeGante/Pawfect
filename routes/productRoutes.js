const express = require('express')
const router = express.Router()

// Asegúrate de que los controladores estén correctamente importados
const productController = require('../controllers/productsControllers')
const { isAuth, isAdminOrEmployee } = require('../middleware/authMiddleware')

// Definir las rutas con el router
router.post('/', isAuth, isAdminOrEmployee, productController.createProduct)
router.get('/', isAuth, isAdminOrEmployee, productController.findAllProducts)
router.get('/:idProduct', isAuth, isAdminOrEmployee, productController.findProductById)
router.patch('/:idProduct', isAuth, isAdminOrEmployee, productController.updateProduct)
router.delete('/softDelete/:idProduct', isAuth, productController.softDeleteProduct)
router.delete('/destroy/:idProduct', isAuth, isAdminOrEmployee, productController.destroyProduct)

// Exportar el router
module.exports = router
