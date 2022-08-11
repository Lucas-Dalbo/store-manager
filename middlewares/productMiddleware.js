const Joi = require('joi');

const nameValidation = (req, res, next) => {
  const { name } = req.body;
  const { error } = Joi.object({
    name: Joi.string().not().empty().required()
      .messages({
        'string.base': '"name" must be a string',
        'string.empty': '"name" cannot be an empty field',
        'any.required': '"name" is required',
      }),
  }).validate({ name });
  
  if (error) return res.status(400).json({ message: error.details[0].message });

  if (name.length < 5) {
    return res.status(422).json({ message: '"name" length must be at least 5 characters long' });
  }

  next();
};

module.exports = { nameValidation };
