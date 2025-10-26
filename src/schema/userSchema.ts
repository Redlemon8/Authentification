import Joi from 'joi';
import { createSchema } from '../utils/schema';

const userBaseSchema = {
  name: Joi.string().min(3).messages({
    'string.base': 'Le nom doit être une chaîne de caractères',
    'string.min': 'Le nom doit contenir au moins {#limit} caractères',
    'any.required': 'Le champ nom est obligatoire',
  }),
  email: Joi.string().email().messages({
    'string.base': 'L\'email doit être une chaîne de caractères',
    'string.email': 'L\'email doit être une adresse email valide',
    'any.required': 'Le champ email est obligatoire',
  }),
  password: Joi.string().min(8).messages({
    'string.base': 'Le mot de passe doit être une chaîne de caractères',
    'string.min': 'Le mot de passe doit contenir au moins {#limit} caractères',
    'any.required': 'Le champ mot de passe est obligatoire',
  }),
};

const confirmEmailSchema = {
  token: Joi.string().required().messages({
    'string.base': 'Le token doit être une chaîne de caractères',
    'string.required': 'Le champ token est obligatoire',
  }),
};
  
export const createUserSchema = createSchema(userBaseSchema, ['name', 'email', 'password']);
export const updateUserSchema = createSchema(userBaseSchema);
export const confirmEmailValidationSchema = createSchema(confirmEmailSchema, ['token']);