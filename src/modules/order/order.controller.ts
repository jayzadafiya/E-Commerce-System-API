import { Response } from 'express';
import orderService from './order.service';
import { asyncHandler } from '../../middlewares/asyncHandler';
import { AuthRequest } from '../../types';

export const placeOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { couponCode, useWalletPoints } = req.body;
  const userId = req.user!.id;

  const order = await orderService.placeOrder(userId, couponCode, useWalletPoints);

  return res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    data: order,
  });
});

export const handlePayment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { paymentStatus } = req.body;

  const order = await orderService.handlePayment(id, paymentStatus);

  return res.status(200).json({
    success: true,
    message: `Payment ${paymentStatus}`,
    data: order,
  });
});
