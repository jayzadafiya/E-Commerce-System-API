import { Response } from 'express';
import brandService from './brand.service';
import { asyncHandler } from '../../middlewares/asyncHandler';
import { AuthRequest } from '../../types';

export const createBrand = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, description, website } = req.body;
  const sellerId = req.user!.id;

  const brand = await brandService.create({
    name,
    description,
    website,
    sellerId,
  });

  return res.status(201).json({
    success: true,
    message: 'Brand created successfully',
    data: brand,
  });
});

export const listBrands = asyncHandler(async (req: AuthRequest, res: Response) => {
  const query = {
    ...req.query,
    sellerId: req.user!.id,
  };

  const result = await brandService.list(query);

  return res.status(200).json({
    success: true,
    message: 'Brands retrieved successfully',
    data: result.brands,
    pagination: result.pagination,
  });
});

export const getBrand = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const brand = await brandService.findById(id);

  return res.status(200).json({
    success: true,
    message: 'Brand retrieved successfully',
    data: brand,
  });
});
