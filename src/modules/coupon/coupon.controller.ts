import { Response } from 'express';
import couponService from './coupon.service';
import { asyncHandler } from '../../middlewares/asyncHandler';
import { AuthRequest } from '../../types';

export const createCoupon = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { code, discountType, discountValue, minPurchase, maxDiscount, validFrom, validUntil, usageLimit } = req.body;
  const sellerId = req.user!.id;

  const coupon = await couponService.create({
    code,
    discountType,
    discountValue,
    minPurchase,
    maxDiscount,
    validFrom,
    validUntil,
    usageLimit,
    sellerId,
  });

  return res.status(201).json({
    success: true,
    message: 'Coupon created successfully',
    data: coupon,
  });
});

export const listCoupons = asyncHandler(async (req: AuthRequest, res: Response) => {
  const query = {
    ...req.query,
    sellerId: req.user!.id,
  };

  const result = await couponService.list(query);

  return res.status(200).json({
    success: true,
    message: 'Coupons retrieved successfully',
    data: result.coupons,
    pagination: result.pagination,
  });
});

export const getCoupon = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const coupon = await couponService.findById(id);

  return res.status(200).json({
    success: true,
    message: 'Coupon retrieved successfully',
    data: coupon,
  });
});
