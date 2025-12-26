import Joi from 'joi';

export const placeOrderSchema = Joi.object({
  couponCode: Joi.string().optional().trim().uppercase(),
  useWalletPoints: Joi.number().optional().min(0),
});
