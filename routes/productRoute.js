const express = require('express');
const productController = require('../controllers/productController');
const productMiddleware = require('../middlewares/productMiddleware');

const productRoute = express.Router();

productRoute.get('/', productController.getAll);
productRoute.get('/search', productController.findByName);
productRoute.get('/:id', productController.findById);
productRoute.delete('/:id', productController.remove);

productRoute.use(productMiddleware.nameValidation);

productRoute.post('/', productController.create);
productRoute.put('/:id', productController.update);

module.exports = productRoute;
