const validateData = (sale) => {
  const isProductIdValid = sale.find((venda) => !venda.productId);
  if (isProductIdValid) return '"productId" is required';

  const isQuantityValid = sale.find((venda) => !venda.quantity && venda.quantity !== 0);
  if (isQuantityValid) return '"quantity" is required';

  return false;
};

const validateQuantity = (sale) => {
  const isQuantyLower = sale.find((venda) => venda.quantity < 1);
  if (isQuantyLower) return '"quantity" must be greater than or equal to 1';

  return false;
};

// const validateItens = (sale) => {
//   const shema = Joi.array().items({
//     productId: Joi.number(),
//     quantity: Joi.number(),
//   }).has(Joi.object({
//     productId: Joi.number().required().message({
//       'number.base': '"productId" must be a number',
//       'number.required': '"productId" is required',
//     }),
//     quantity: Joi.number().required().message({
//       'number.base': '"quantity" must be a number',
//       'number.required': '"quantity" is required',
//     }),
//   }));
//   const { error } = shema.validate(sale);
//   return error;
// };

const saleValidation = (req, res, next) => {
  const sale = req.body;
  if (!sale[0]) return res.status(400).json({ message: 'Invalid body json' });

  const invalidData = validateData(sale);
  if (invalidData) return res.status(400).json({ message: invalidData });

  const invalidQuantity = validateQuantity(sale);
  if (invalidQuantity) return res.status(422).json({ message: invalidQuantity });

  next();
};

module.exports = { saleValidation };
