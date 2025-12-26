import { Response } from 'express';
import productService from './product.service';
import { asyncHandler } from '../../middlewares/asyncHandler';
import { AuthRequest } from '../../types';

export const createProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, description, price, stock, category, brandId } = req.body;
  const sellerId = req.user!.id;

  const product = await productService.create({
    name,
    description,
    price,
    stock,
    category,
    brandId,
    sellerId,
  });

  return res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: product,
  });
});

export const listProducts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const query = {
    ...req.query,
    sellerId: req.user!.id,
  };

  const result = await productService.list(query);

  return res.status(200).json({
    success: true,
    message: 'Products retrieved successfully',
    data: result.products,
    pagination: result.pagination,
  });
});

export const getProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const product = await productService.findById(id);

  return res.status(200).json({
    success: true,
    message: 'Product retrieved successfully',
    data: product,
  });
});
