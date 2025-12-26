import User from './user.model';
import bcrypt from 'bcrypt';
import { ConflictError, UnauthorizedError } from '../../middlewares/errorHandler';
import { IUser } from '../../types';

class UserService {
  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async register(payload: { name: string; email: string; password: string }): Promise<IUser> {
    const existing = await this.findByEmail(payload.email);
    if (existing) throw new ConflictError('User already exists');

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const user = await User.create({
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      walletPoints: 100,
    });

    return user;
  }

  async login(email: string, password: string): Promise<IUser> {
    const user = await User.findOne({ email }).select('+password');
    if (!user) throw new UnauthorizedError('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedError('Invalid credentials');

    return user;
  }
}

export default new UserService();
