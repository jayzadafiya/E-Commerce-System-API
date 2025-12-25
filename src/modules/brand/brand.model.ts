import mongoose, { Schema } from 'mongoose';
import { IBrand } from '../../types';

const brandSchema = new Schema<IBrand>(
  {
    name: {
      type: String,
      required: [true, 'Brand name is required'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: 'Seller',
      required: [true, 'Seller ID is required'],
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

brandSchema.index({ name: 1, sellerId: 1 }, { unique: true });

const Brand = mongoose.model<IBrand>('Brand', brandSchema);

export default Brand;
