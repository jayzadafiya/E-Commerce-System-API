import Joi from 'joi';

export const createBrandSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'Brand name is required',
    'string.min': 'Brand name must be at least 2 characters',
    'string.max': 'Brand name must not exceed 100 characters',
  }),
  description: Joi.string().trim().max(500).optional().messages({
    'string.max': 'Description must not exceed 500 characters',
  }),
  website: Joi.string().trim().uri().optional().messages({
    'string.uri': 'Website must be a valid URL',
  }),
});

export const listBrandsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).optional(),
  limit: Joi.number().integer().min(1).max(100).default(10).optional(),
  search: Joi.string().trim().optional(),
  isActive: Joi.boolean().optional(),
  sortBy: Joi.string().valid('name', 'createdAt', 'updatedAt').default('createdAt').optional(),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc').optional(),
});
