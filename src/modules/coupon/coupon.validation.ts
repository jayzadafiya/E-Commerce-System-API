import Joi from 'joi';

export const createCouponSchema = Joi.object({
  code: Joi.string().required().trim().uppercase().min(3).max(50),
  discountType: Joi.string().required().valid('percentage', 'fixed'),
  discountValue: Joi.number().required().min(0),
  minPurchase: Joi.number().optional().min(0).default(0),
  maxDiscount: Joi.number().optional().min(0),
  validFrom: Joi.date().required().greater('now'),
  validUntil: Joi.date().required().greater(Joi.ref('validFrom')),
  usageLimit: Joi.number().optional().min(0),
});

export const listCouponsQuerySchema = Joi.object({
  page: Joi.number().optional().min(1).default(1),
  limit: Joi.number().optional().min(1).max(100).default(10),
  search: Joi.string().optional().trim(),
  discountType: Joi.string().optional().valid('percentage', 'fixed'),
  isActive: Joi.boolean().optional(),
  validOnly: Joi.boolean().optional(),
  sortBy: Joi.string().optional().valid('code', 'discountValue', 'validFrom', 'validUntil', 'createdAt').default('createdAt'),
  sortOrder: Joi.string().optional().valid('asc', 'desc').default('desc'),
});
