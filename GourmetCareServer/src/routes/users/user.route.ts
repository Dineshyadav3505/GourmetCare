import {createUser, getUserById, getUserByEmail, updateUser, deleteUser } from '../../controllers/users/user.controller'; 

import { Router, RequestHandler } from 'express';

const router = Router();


router.post('/user', createUser as RequestHandler);
router.get('/user', getUserByEmail as RequestHandler);
router.get('/user/:id', getUserById as RequestHandler);
router.put('/user/:id', updateUser as RequestHandler);
router.delete('/user/:id', deleteUser as RequestHandler);

export default router;