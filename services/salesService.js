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

  const newSaleId = await salesModel.create(vendas);

  await Promise.all(vendas.map((sale) => salesProductsModel.create(newSaleId, sale)));

  return {
    id: newSaleId,
    itemsSold: [...vendas],
  };
};

module.exports = { create };
