import Seller from './seller.model';
import {
  ConflictError,
  UnauthorizedError,
  TooManyRequestsError,
} from '../../middlewares/errorHandler';
import { ISeller } from '../../types';

const MAX_LOGIN_ATTEMPTS = 10;
const LOCK_TIME = 5 * 60 * 1000;

class SellerService {
  async findByEmail(email: string): Promise<ISeller | null> {
    return await Seller.findOne({ email });
  }

  async register(payload: { name: string; email: string; password: string }): Promise<ISeller> {
    const existing = await this.findByEmail(payload.email);
    if (existing) throw new ConflictError('User already exists');

    const user = await Seller.create({
      name: payload.name,
      email: payload.email,
      password: payload.password,
    });

    return user;
  }

  async login(email: string, password: string): Promise<ISeller> {
    const user = await Seller.findOne({ email }).select('+password');
    if (!user) throw new UnauthorizedError('Invalid credentials');

    if (user.lockUntil && user.lockUntil > new Date()) {
      const remainingTime = Math.ceil((user.lockUntil.getTime() - Date.now()) / 1000 / 60);
      throw new TooManyRequestsError(
        `Account is locked due to too many failed login attempts. Try again in ${remainingTime} minute(s)`
      );
    }

    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - LOCK_TIME);

    if (user.lastLoginAttempt && user.lastLoginAttempt < fiveMinutesAgo) {
      user.loginAttempts = 0;
      user.lockUntil = undefined;
    }

    if (user.password !== password) {
      user.loginAttempts += 1;
      user.lastLoginAttempt = now;

      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = new Date(now.getTime() + LOCK_TIME);
        await user.save();
        throw new TooManyRequestsError(
          `Account locked due to too many failed login attempts. Try again in 5 minutes`
        );
      }

      await user.save();
      const attemptsLeft = MAX_LOGIN_ATTEMPTS - user.loginAttempts;
      throw new UnauthorizedError(
        `Invalid credentials. ${attemptsLeft} attempt(s) remaining before account lock`
      );
    }

    user.loginAttempts = 0;
    user.lastLoginAttempt = now;
    user.lockUntil = undefined;
    await user.save();

    return user;
  }
}

export default new SellerService();
