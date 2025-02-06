import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import {
  createUsersTable,
  createUser as createUserModel,
  getUserById as getUserByIdModel,
  getUserByEmail as getUserByEmailModel,
  updateUser as updateUserModel,
  deleteUser as deleteUserModel,
  User
} from '../../models/user.model';

// Validation schemas
const userSchema = Joi.object({
  first_name: Joi.string().required().min(2).max(50),
  last_name: Joi.string().required().min(2).max(50),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().pattern(/^[0-9]{10}$/).required(),
  password: Joi.string().min(8).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Helper functions
const getAccessToken = (user: Partial<User>): string => {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) throw new Error('ACCESS_TOKEN_SECRET is not defined');
  return jwt.sign({ email: user.email }, secret, { expiresIn: '7d' });
};

const verifyToken = (token: string): jwt.JwtPayload => {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) throw new Error('ACCESS_TOKEN_SECRET is not defined');
  return jwt.verify(token, secret) as jwt.JwtPayload;
};

const handleError = (res: Response, error: unknown) => {
  console.error('Error:', error);
  res.status(500).json({ message: 'Internal server error' });
};

// Controller functions
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    await createUsersTable();

    const { error, value } = userSchema.validate(req.body, { abortEarly: false });
    if (error) {
      res.status(400).json({ errors: error.details.map(detail => detail.message) });
      return;
    }

    const { first_name, last_name, email, phoneNumber, password } = value;

    const existingUser = await getUserByEmailModel(email);
    if (existingUser) {
      res.status(409).json({ message: 'User with this email already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const accessToken = getAccessToken({ email });
    const refresh_token = jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET as string);
    console.log(accessToken);
    console.log(refresh_token);
    const newUser: User = { first_name, last_name, email, phoneNumber, password: hashedPassword, refresh_token };
    const createdUser = await createUserModel(newUser);

    const { password: _, ...userWithoutPassword } = createdUser;
    res.status(201).json({ message: 'User created successfully', user: userWithoutPassword, accessToken });
  } catch (error) {
    handleError(res, error);
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);
    const user = await getUserByIdModel(userId);
    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    handleError(res, error);
  }
};

export const getUserByEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const userEmail = req.params.email;
    const user = await getUserByEmailModel(userEmail);
    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    handleError(res, error);
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);
    const updatedUserData: Partial<User> = req.body;
    const updatedUser = await updateUserModel(userId, updatedUserData);
    if (updatedUser) {
      res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);
    const result = await deleteUserModel(userId);
    res.status(200).json({ message: result });
  } catch (error) {
    handleError(res, error);
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.body.token;
    if (!refreshToken) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const payload = verifyToken(refreshToken);
    const accessToken = getAccessToken({ email: payload.email });
    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const { email, password } = value;
    const user = await getUserByEmailModel(email);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid password' });
      return;
    }

    const accessToken = getAccessToken(user);
    res.status(200).json({ accessToken });
  } catch (error) {
    handleError(res, error);
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.status(200).json({ message: 'User logged out' });
};
