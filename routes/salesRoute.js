const express = require('express');
const salesController = require('../controllers/salesController');
const salesMidlleware = require('../middlewares/salesMiddleware');

const salesRoute = express.Router();

salesRoute.post('/', salesMidlleware.saleValidation, salesController.create);

salesRoute.get('/', salesController.getAll);

salesRoute.get('/:id', salesController.findById);

module.exports = salesRoute;
