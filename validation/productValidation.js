import joi from 'joi';

const createSchema = joi.object({
  name: joi.string().min(2).max(150).required(),
  description: joi.string().min(5).max(2000).required(),
  price: joi.number().precision(2).min(0).required(),
  stock: joi.number().integer().min(0).required(),
  image: joi.string().allow('', null),
  status: joi.string().valid('active', 'inactive').default('active'),
});

const updateSchema = joi.object({
  name: joi.string().min(2).max(150),
  description: joi.string().min(5).max(2000),
  price: joi.number().precision(2).min(0),
  stock: joi.number().integer().min(0),
  image: joi.string().allow('', null),
  status: joi.string().valid('active', 'inactive'),
})

export const validateCreateProduct = (data) => createSchema.validate(data, { abortEarly: false });
export const validateUpdateProduct = (data) => updateSchema.validate(data, { abortEarly: false });

export default { validateCreateProduct, validateUpdateProduct };
