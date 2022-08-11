const productService = require('../services/productService');

const getAll = async (_req, res) => {
  const produtos = await productService.getAll();

  res.status(200).json(produtos);
};

module.exports = { getAll };
