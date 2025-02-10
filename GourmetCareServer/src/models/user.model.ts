import { QueryResult } from 'pg';
import pool from '../db/dataConnection';
import { ApiError } from '../utils/apiError';

export interface User {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  dateOfBirth?: Date;
  phone_number?: string;
  role?: string;
  created_at?: Date;
  updated_at?: Date;
}

      // role VARCHAR(20) ENUM('user', 'technician', 'manager', 'admin', 'superAdmin') DEFAULT 'user',

// Create users table if it doesn't exist
export const createUsersTable = async (): Promise<void> => {
  const createTypeQuery = `
    DO $$ BEGIN
      CREATE TYPE user_role AS ENUM ('user', 'technician', 'manager', 'admin', 'superAdmin');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `;

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      date_of_birth DATE DEFAULT '2000-01-01'::DATE, 
      phone_number VARCHAR(20),
      role user_role DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(createTypeQuery);
    await pool.query(createTableQuery);
    console.log('Users table created successfully');
  } catch (error) {
    console.error('Error creating users table:', error);
    throw error;
  }
};


// Create a new user
export const createUserModel = async (user: User): Promise<User> => {
  const { first_name, last_name, email, phone_number} = user;
  const createUserQuery = `
    INSERT INTO users (first_name, last_name, email, phone_number)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  try {
    const { rows }: QueryResult = await pool.query(createUserQuery, [first_name, last_name, email, phone_number]);
    return rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Get a user by email
export const getUserByEmailModel = async (email: string): Promise<User | null> => {
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

// Update a user
export const updateUserModel = async (id: number, user: Partial<User>): Promise<User | null> => {
  const { first_name, last_name, email, phone_number, dateOfBirth} = user;
  const updateUserQuery = `
    UPDATE users
    SET 
      first_name = COALESCE($1, first_name), 
      last_name = COALESCE($2, last_name), 
      email = COALESCE($3, email), 
      phone_number = COALESCE($4, phone_number), 
      date_of_birth = COALESCE($5, date_of_birth),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $6
    RETURNING *;
  `;

  try {
    const { rows }: QueryResult = await pool.query(updateUserQuery, [first_name, last_name, email, phone_number, dateOfBirth, id]);
    return rows[0] || null;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Delete a user
export const deleteUserModel = async (id: number): Promise<User | null> => {
  const deleteUserQuery = `
    DELETE FROM users
    WHERE id = $1
    RETURNING *;
  `;

  try {
    const { rows }: QueryResult = await pool.query(deleteUserQuery, [id]);
    return rows[0] || null;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Get a user by id
export const getUserByIdModel = async (id: number): Promise<User | null> => {
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
};


// ADMIN 
// Get all users
export const getAllUsersMode = async (): Promise<User[]> => {
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

// Update a user by Admin
export const updateUserByAdminModel = async (id: number, user: Partial<User>): Promise<User | null> => {
  const { first_name, last_name, email, phone_number, dateOfBirth, role} = user;
  const updateUserQuery = `
    UPDATE users
    SET 
      first_name = COALESCE($1, first_name), 
      last_name = COALESCE($2, last_name), 
      email = COALESCE($3, email), 
      phone_number = COALESCE($4, phone_number), 
      date_of_birth = COALESCE($5, date_of_birth),
      role = COALESCE($6, role),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $7
    RETURNING *;
  `;

  try {
    const { rows }: QueryResult = await pool.query(updateUserQuery, [first_name, last_name, email, phone_number, dateOfBirth, role, id]);
    return rows[0] || null;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

