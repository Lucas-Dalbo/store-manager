const salesService = require('../services/salesService');

const create = async (req, res) => {
  const { body } = req;
  const newSale = await salesService.create(body);

  if (newSale.message) return res.status(404).json(newSale);

  res.status(201).json(newSale);
};

module.exports = { create };
