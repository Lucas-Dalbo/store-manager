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

const create = async (name) => {
  const newProduct = await productModel.create(name);
  return newProduct;
};

const update = async (id, newName) => {
  const produto = await productModel.findById(id);
  if (!produto.length) return false;

  const updatedProduct = await productModel.update(id, newName);
  return updatedProduct;
};

const remove = async (id) => {
  const result = await productModel.remove(id);
  if (!result) return false;

  return true;
};

const findByName = async (query) => {
  const produto = await productModel.findByName(query);

  return produto;
};

module.exports = { getAll, findById, create, update, remove, findByName };
