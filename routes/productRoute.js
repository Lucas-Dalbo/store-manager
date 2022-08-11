const express = require('express');
const productController = require('../controllers/productController');
const productMiddleware = require('../middlewares/productMiddleware');

const productRoute = express.Router();

productRoute.get('/', productController.getAll);

productRoute.get('/:id', productController.findById);

productRoute.post('/', productMiddleware.nameValidation, productController.create);

module.exports = productRoute;
