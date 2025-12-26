import Joi from 'joi';

export const createProductSchema = Joi.object({
  name: Joi.string().required().trim().min(1).max(200),
  description: Joi.string().optional().trim().max(2000),
  price: Joi.number().required().min(1),
  stock: Joi.number().optional().min(0).default(0),
  category: Joi.string().optional().trim().max(100),
  brandId: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/),
});

export const listProductsQuerySchema = Joi.object({
  page: Joi.number().optional().min(1).default(1),
  limit: Joi.number().optional().min(1).max(100).default(10),
  search: Joi.string().optional().trim(),
  category: Joi.string().optional().trim(),
  brandId: Joi.string()
    .optional()
    .regex(/^[0-9a-fA-F]{24}$/),
  minPrice: Joi.number().optional().min(0),
  maxPrice: Joi.number().optional().min(0),
  inStock: Joi.boolean().optional(),
  isActive: Joi.boolean().optional(),
  sortBy: Joi.string()
    .optional()
    .valid('name', 'price', 'stock', 'createdAt', 'updatedAt')
    .default('createdAt'),
  sortOrder: Joi.string().optional().valid('asc', 'desc').default('desc'),
});
