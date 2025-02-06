import {createUser, getUserById, getUserByEmail, updateUser, deleteUser } from '../../controllers/users/user.controller'; 

import { Router } from 'express';

const router = Router();


router.get('/user', getUserByEmail);
router.get('/user/:id', getUserById);
router.put('/user/:id', updateUser);
router.delete('/user/:id', deleteUser);

export default router;