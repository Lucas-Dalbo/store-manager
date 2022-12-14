const productService = require('../services/productService');

const getAll = async (_req, res) => {
  const produtos = await productService.getAll();

  if (!produtos.length) res.status(404).json({ message: 'Nenhum produto encontrado' });

  res.status(200).json(produtos);
};

const findById = async (req, res) => {
  const { id } = req.params;
  const produto = await productService.findById(id);

  if (!produto) return res.status(404).json({ message: 'Product not found' });

  res.status(200).json(produto);
};

const create = async (req, res) => {
  const { name } = req.body;
  const newProduct = await productService.create(name);

  res.status(201).json(newProduct);
};

const update = async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  const updatedProduct = await productService.update(id, name);

  if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });

  res.status(200).json(updatedProduct);
};

const remove = async (req, res) => {
  const { id } = req.params;
  const result = await productService.remove(id);

  if (!result) return res.status(404).json({ message: 'Product not found' });

  res.status(204).end();
};

const findByName = async (req, res) => {
  const { q } = req.query;
  const result = await productService.findByName(q);

  if (!result.length) return res.status(404).json({ message: 'Product not found' });

  res.status(200).json(result);
};

module.exports = { getAll, findById, create, update, remove, findByName };
