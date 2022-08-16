const express = require('express');
const salesController = require('../controllers/salesController');
const salesMidlleware = require('../middlewares/salesMiddleware');

const salesRoute = express.Router();

salesRoute.get('/', salesController.getAll);
salesRoute.get('/:id', salesController.findById);
salesRoute.delete('/:id', salesController.remove);

salesRoute.use(salesMidlleware.saleValidation);

salesRoute.post('/', salesController.create);
salesRoute.put('/:id', salesController.update);

module.exports = salesRoute;
