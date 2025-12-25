import mongoose, { Schema } from 'mongoose';
import { ISeller } from '../../types';

const sellerSchema = new Schema<ISeller>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lastLoginAttempt: {
      type: Date,
    },
    lockUntil: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Seller = mongoose.model<ISeller>('Seller', sellerSchema);

export default Seller;
