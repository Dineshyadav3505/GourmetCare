import { Request, Response } from 'express';
import {
  createUsersTable,
  createUser as createUserModel,
  getUserById as getUserByIdModel,
  getUserByEmail as getUserByEmailModel,
  updateUser as updateUserModel,
  deleteUser as deleteUserModel,
  User
} from '../../models/user.model';


export const createUser = async (req: Request, res: Response) => {
  try {
    console.log("df")
    await createUsersTable();
    const {first_name, last_name, email, phoneNumber, password} = req.body;

    if (!first_name || !last_name || !email || !phoneNumber || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const newUser: User = { first_name, last_name, email, phoneNumber, password };
    const createdUser = await createUserModel(newUser);
    res.status(201).json({ message: 'User created successfully', user: createdUser });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await getUserByIdModel(userId);
    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserByEmail = async (req: Request, res: Response) => {
  try {
    const userEmail = req.params.email;
    const user = await getUserByEmailModel(userEmail);
    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const updatedUserData: Partial<User> = req.body;
    const updatedUser = await updateUserModel(userId, updatedUserData);
    if (updatedUser) {
      res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const result = await deleteUserModel(userId);
    res.status(200).json({ message: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
