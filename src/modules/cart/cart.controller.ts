import { Response } from 'express';
import cartService from './cart.service';
import { asyncHandler } from '../../middlewares/asyncHandler';
import { AuthRequest } from '../../types';

export const addToCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { productId, quantity } = req.body;
  const userId = req.user!.id;

  const cart = await cartService.addItem(userId, productId, quantity);

  return res.status(200).json({
    success: true,
    message: 'Item added to cart',
    data: cart,
  });
});

export const getCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const cart = await cartService.getCart(userId);

  return res.status(200).json({
    success: true,
    message: 'Cart retrieved successfully',
    data: cart,
  });
});

export const calculateTotal = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { couponCode, useWalletPoints } = req.body;
  const userId = req.user!.id;

  const total = await cartService.calculateTotal(userId, couponCode, useWalletPoints);

  return res.status(200).json({
    success: true,
    message: 'Total calculated successfully',
    data: total,
  });
});
