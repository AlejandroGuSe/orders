const express = require('express');
const productController = require('../controllers/product');
const router = express.Router();

router.get('/products', productController.loadordenes)

router.post('/viewload', productController.viewload)


router.post('/retribuir', productController.setOrders)

router.get('/orden-retr', (req, res) => {
	res.render('ordenre', {
        path: '/orderetr'
	})
})

router.get('/ordenes', productController.getOrders)



 module.exports = router;