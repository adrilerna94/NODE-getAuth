// Defines Joi schemas for validating user-related requests.
// Ensures that incoming data adheres to the required structure and rules.

import Joi from 'joi';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const joiObjectId = require('joi-objectid')(Joi); // 🔹 Usar require() en lugar de import

export const userRegisterSchema = Joi.object({
  name: Joi.string().min(3).max(30).optional(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8) // Mínimo 8 caracteres
    .pattern(new RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$")) // Letras y números obligatorios
    .required()
    .messages({
      'string.pattern.base': 'La contraseña debe tener al menos 8 caracteres, incluyendo al menos una letra y un número.',
      'string.min': 'La contraseña debe tener al menos 8 caracteres.',
      'any.required': 'El campo password es obligatorio.',
    }),
  confirm_password: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only' : 'Credentials do not match',
      'any.required' : 'field confirm_password is required',
    })

}).with('password', 'confirm_password');

export const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8) // Mínimo 8 caracteres
    .pattern(new RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$")) // Letras y números obligatorios
    .required()
    .messages({
      'string.pattern.base': 'La contraseña debe tener al menos 8 caracteres, incluyendo al menos una letra y un número.',
      'string.min': 'La contraseña debe tener al menos 8 caracteres.',
      'any.required': 'El campo password es obligatorio.',
    }),
});

export const userIdSchema = Joi.object({
  id: joiObjectId().required().messages({
    'any.required': 'El campo ID es obligatorio.',
    'string.pattern.name': 'El ID debe ser un ObjectId válido de MongoDB.',
  })
});


