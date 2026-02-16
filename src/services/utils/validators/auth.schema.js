import Joi from 'joi';

// 1. (Shared Validation Logic)
const username = Joi.string().required().min(4).max(20).messages({
  'string.base': 'Username must be of type string',
  'string.min': 'Invalid username (min 4 chars)',
  'string.max': 'Invalid username (max 20 chars)',
  'string.empty': 'Username is a required field',
});

const password = Joi.string().required().min(7).max(20).messages({
  'string.base': 'Password should be of type string',
  'string.min': 'Password must be at least 7 characters',
  'string.max': 'Password must be at most 20 characters',
  'string.empty': 'Password is a required field',
});

const email = Joi.string().required().email({ tlds: { allow: false } }).messages({
  'string.email': 'Email must be valid',
  'string.empty': 'Email is a required field',
});

// 2. Register Schema
export const registerSchema = Joi.object().keys({
  username,
  email,
  password,
});

// 3. Login Schema
export const loginSchema = Joi.object().keys({
  email,
  password,
  keepLoggedIn: Joi.boolean().optional(),
});
