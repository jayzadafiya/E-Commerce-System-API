import Joi from 'joi';
import { Request } from 'express';
import mongoose, { Document } from 'mongoose';

export interface Config {
  port: number;
  nodeEnv: string;
  mongodbUri: string;
  apiVersion: string;
  jwt: {
    secret: string;
    expiresIn: string | number;
  };
}
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationMetadata {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
}

export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export interface ValidationSchema {
  body?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role?: string;
  };
}

export interface JwtPayload {
  id: string;
  email: string;
  role?: string;
}

// Model Interfaces

export interface ISeller extends Document {
  name: string;
  email: string;
  password: string;
  loginAttempts: number;
  lastLoginAttempt?: Date;
  lockUntil?: Date;
  createdAt: Date;
}

export interface IBrand extends Document {
  name: string;
  description?: string;
  website?: string;
  sellerId: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BrandFilterParams extends PaginationParams {
  search?: string;
  isActive?: boolean;
  sellerId?: string;
}

export interface CreateBrandPayload {
  name: string;
  description?: string;
  website?: string;
  sellerId: string;
}

export interface PaginatedBrands {
  brands: IBrand[];
  pagination: PaginationMetadata;
}
