const salesModel = require('../models/salesModel');
const salesProductsModel = require('../models/salesProductsModel');
const productModel = require('../models/productModel');

const isProductValid = async (vendas) => {
  const idList = vendas.reduce((acc, crr) => [...acc, crr.productId], []);
  const products = await productModel.getAll();
  const listaDeIds = products.reduce((acc, crr) => [...acc, crr.id], []);
  return idList.every((id) => listaDeIds.includes(id));
};

const create = async (vendas) => {
  const isValid = await isProductValid(vendas);

  if (!isValid) return { message: 'Product not found' };

  const newSaleId = await salesModel.create();

  await Promise.all(vendas.map((sale) => salesProductsModel.create(newSaleId, sale)));

  return {
    id: newSaleId,
    itemsSold: [...vendas],
  };
};

const getAll = async () => {
  const vendas = await salesModel.getAll();
  return vendas;
};

const findById = async (id) => {
  const venda = await salesModel.findById(id);

  if (!venda.length) return false;

  return venda;
};

const remove = async (id) => {
  const result = await salesModel.remove(id);

  if (!result) return false;

  return true;
};

const update = async (id, newData) => {
  const isValid = await isProductValid(newData);
  if (!isValid) return { message: 'Product not found' };

  const isSaleValid = await salesModel.findById(id);
  if (!isSaleValid.length) return { message: 'Sale not found' };

  await salesProductsModel.remove(id);

  await Promise.all(newData.map((sale) => salesProductsModel.create(id, sale)));

  return { saleId: Number(id), itemsUpdated: [...newData] };
};

module.exports = { create, isProductValid, getAll, findById, remove, update };
