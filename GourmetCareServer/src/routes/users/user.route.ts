import { Router } from 'express';
import { Request, Response } from 'express';
import UserController from '../../controllers/users/user.controller';

const router: Router = Router();

// Register new user
router.post('/register', async (req: Request, res: Response) => {
  await UserController.register(req, res);
});

// Login user  
router.post('/login', async (req: Request, res: Response) => {
  await UserController.login(req, res);
});

// Logout user
router.post('/logout', async (req: Request, res: Response) => {
  await UserController.logout(req, res);
});

// Update user details
router.put('/:id', async (req: Request, res: Response) => {
  await UserController.updateUser(req, res);
});

router.get('/all', async (req: Request, res: Response) => {
    try {
        res.status(200).json({ users: "All users" });
    } catch (error) {
        res.status(500).json({ message: 'Error getting all users', error });
    }
});

export default router;