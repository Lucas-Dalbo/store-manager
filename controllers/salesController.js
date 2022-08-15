const salesService = require('../services/salesService');

const create = async (req, res) => {
  const { body } = req;
  const newSale = await salesService.create(body);

  if (newSale.message) return res.status(404).json(newSale);

  res.status(201).json(newSale);
};

const getAll = async (_req, res) => {
  const vendas = await salesService.getAll();

  if (!vendas.length) res.status(404).json({ message: 'Sales not found' });

  res.status(200).json(vendas);
};

const findById = async (req, res) => {
  const { id } = req.params;
  const venda = await salesService.findById(id);

  if (!venda) return res.status(404).json({ message: 'Sale not found' });

  res.status(200).json(venda);
};

module.exports = { create, getAll, findById };
