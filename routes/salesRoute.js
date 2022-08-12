const express = require('express');
const salesController = require('../controllers/salesController');
const salesMidlleware = require('../middlewares/salesMiddleware');

const salesRoute = express.Router();

salesRoute.post('/', salesMidlleware.saleValidation, salesController.create);

module.exports = salesRoute;
