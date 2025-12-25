import { Request, Response } from 'express';
import sellerService from './seller.service';
import { asyncHandler } from '../../middlewares/asyncHandler';
import { generateToken } from '../../utils/jwtHelpers';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const user = await sellerService.register({ name, email, password });

  return res.status(201).json({
    success: true,
    message: 'Registered',
    data: { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt },
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await sellerService.login(email, password);

  const token = generateToken({
    id: user._id.toString(),
    email: user.email,
    role: 'seller',
  });

  return res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      token,
    },
  });
});
