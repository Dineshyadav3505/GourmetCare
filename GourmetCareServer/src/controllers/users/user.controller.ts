import { Request, Response } from 'express';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../../models/user.model';

// Database connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432')
});

export class UserController {
  // Register new user
  async register(req: Request, res: Response) {
    try {
      const { name, dateOfBirth, email, password, phoneNumber, profession } = req.body;
      
      // Check if user already exists
      const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (userExists.rows.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = new User({
        name,
        dateOfBirth: new Date(dateOfBirth),
        email,
        password: hashedPassword,
        status: true,
        phoneNumber,
        profession
      });

      // Insert user into database
      const result = await pool.query(
        'INSERT INTO users (name, date_of_birth, email, password, status, phone_number, profession) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [newUser.name, newUser.dateOfBirth, newUser.email, newUser.password, newUser.status, newUser.phoneNumber, newUser.profession]
      );

      res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });
    } catch (error) {
      res.status(500).json({ message: 'Error registering user', error });
    }
  }

  // Login user
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Check if user exists
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (result.rows.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const user = result.rows[0];

      // Check password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '24h'
      });

      res.status(200).json({ message: 'Login successful', token, user });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error });
    }
  }

  // Logout user
  async logout(req: Request, res: Response) {
    try {
      // Note: With JWT, logout is typically handled client-side by removing the token
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error logging out', error });
    }
  }

  // Update user details
  async updateUser(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const { name, dateOfBirth, email, phoneNumber, profession } = req.body;

      // Check if user exists
      const userExists = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
      if (userExists.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update user
      const result = await pool.query(
        'UPDATE users SET name = $1, date_of_birth = $2, email = $3, phone_number = $4, profession = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
        [name, new Date(dateOfBirth), email, phoneNumber, profession, userId]
      );

      res.status(200).json({ message: 'User updated successfully', user: result.rows[0] });
    } catch (error) {
      res.status(500).json({ message: 'Error updating user', error });
    }
  }
}

export default new UserController();
