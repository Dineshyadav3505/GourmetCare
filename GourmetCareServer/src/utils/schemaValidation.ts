import Joi from "joi";

export const userSchema = Joi.object({
  first_name: Joi.string().required().min(2).max(50),
  last_name: Joi.string().required().min(2).max(50),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
  code: Joi.string().required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().required(),
});

export const options: {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict';
  path: string;
} = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
};