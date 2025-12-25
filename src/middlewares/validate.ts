import { Request, Response, NextFunction, RequestHandler } from 'express';
import Joi from 'joi';
import { ValidationSchema } from '../types';

const validate = (schema: ValidationSchema): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validationOptions = {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    };

    const errors: Record<string, string[]> = {};

    if (schema.body) {
      const { error } = schema.body.validate(req.body, validationOptions);
      if (error) {
        errors.body = error.details.map((detail) => detail.message);
      }
    }

    if (schema.query) {
      const { error } = schema.query.validate(req.query, validationOptions);
      if (error) {
        errors.query = error.details.map((detail) => detail.message);
      }
    }

    if (schema.params) {
      const { error } = schema.params.validate(req.params, validationOptions);
      if (error) {
        errors.params = error.details.map((detail) => detail.message);
      }
    }

    if (Object.keys(errors).length > 0) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors,
      });
      return;
    }

    next();
  };
};

export default validate;
