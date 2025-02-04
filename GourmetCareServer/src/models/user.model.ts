import { QueryResult } from 'pg';
import pool from '../db/dataConnection';

interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
  password: string;
  role?: string;
  refreshToken?: string;
  created_at?: Date;
  updated_at?: Date;
}

// Create users table if it doesn't exist
export const createUsersTable = async (): Promise<void> => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY ,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      date_of_birth DATE,
      phone_number VARCHAR(20),
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) DEFAULT 'user',
      refresh_token TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(createTableQuery);
    console.log('Users table created successfully');
  } catch (error) {
    console.error('Error creating users table:', error);
    throw error;
  }
};

// Create a new user
export const createUser = async (user: User): Promise<User> => {
  const { firstName, lastName, email, phoneNumber, password } = user;
  const createUserQuery = `
    INSERT INTO users (first_name, last_name, email, phone_number, password)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  try {
    const { rows }: QueryResult = await pool.query(createUserQuery, [firstName, lastName, email, phoneNumber, password]);
    return rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Get a user by email
export const getUserByEmail = async (email: string): Promise<User | null> => {
  const getUserByEmailQuery = `
    SELECT * FROM users
    WHERE email = $1;
  `;

  try {
    const { rows }: QueryResult = await pool.query(getUserByEmailQuery, [email]);
    return rows[0] || null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
}

// Get all users
export const getUsers = async (): Promise<User[]> => {
  const getUsersQuery = `
    SELECT * FROM users;
  `;

  try {
    const { rows }: QueryResult = await pool.query(getUsersQuery);
    return rows;
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
};

// Get a user by id
export const getUserById = async (id: number): Promise<User | null> => {
  const getUserByIdQuery = `
    SELECT * FROM users
    WHERE id = $1;
  `;

  try {
    const { rows }: QueryResult = await pool.query(getUserByIdQuery, [id]);
    return rows[0] || null;
  } catch (error) {
    console.error('Error getting user by id:', error);
    throw error;
  }
}

// Update a user
export const updateUser = async (id: number, user: Partial<User>): Promise<User | null> => {
  const { firstName, lastName, email, phoneNumber, password } = user;
  const updateUserQuery = `
    UPDATE users
    SET 
      first_name = COALESCE($1, first_name), 
      last_name = COALESCE($2, last_name), 
      email = COALESCE($3, email), 
      phone_number = COALESCE($4, phone_number), 
      password = COALESCE($5, password),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $6
    RETURNING *;
  `;

  try {
    const { rows }: QueryResult = await pool.query(updateUserQuery, [firstName, lastName, email, phoneNumber, password, id]);
    return rows[0] || null;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Delete a user
export const deleteUser = async (id: number): Promise<string> => {
  const deleteUserQuery = `
    DELETE FROM users
    WHERE id = $1;
  `;

  try {
    await pool.query(deleteUserQuery, [id]);
    return 'User deleted successfully';
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export { User };