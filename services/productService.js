const productModel = require('../models/productModel');

const getAll = async () => {
  const produtos = await productModel.getAll();
  return produtos;
};

const findById = async (id) => {
  const produto = await productModel.findById(id);

  if (!produto.length) return false;

  return produto[0];
};

module.exports = { getAll, findById };
