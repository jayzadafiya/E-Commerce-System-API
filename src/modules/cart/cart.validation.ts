import Joi from 'joi';

export const addToCartSchema = Joi.object({
  productId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
  quantity: Joi.number().required().min(1).integer(),
});
