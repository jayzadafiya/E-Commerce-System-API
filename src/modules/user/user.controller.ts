import { Request, Response } from 'express';
import userService from './user.service';
import { asyncHandler } from '../../middlewares/asyncHandler';
import { generateToken } from '../../utils/jwtHelpers';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const user = await userService.register({ name, email, password });

  return res.status(201).json({
    success: true,
    message: 'Registered successfully with 100 wallet points',
    data: { id: user._id, name: user.name, email: user.email, walletPoints: user.walletPoints, createdAt: user.createdAt },
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await userService.login(email, password);

  const token = generateToken({
    id: user._id.toString(),
    email: user.email,
    role: 'user',
  });

  return res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      walletPoints: user.walletPoints,
      token,
    },
  });
});
