import {sendVerificationCode, createUser, getUserById, getUserByEmail, updateUser, deleteUser, login, logout } from '../../controllers/users/user.controller'; 
import {verifyJWT} from '../../middleware/auth.middleware';
import { Router, RequestHandler } from 'express';

const router = Router();


router.post('/verify', sendVerificationCode as RequestHandler);
router.post('/user', createUser as RequestHandler);
router.get('/user', getUserByEmail as RequestHandler);
router.get('/user/:id', getUserById as RequestHandler);
router.put('/user/:id', updateUser as RequestHandler);
router.delete('/user/:id', deleteUser as RequestHandler);
router.post('/login', login as RequestHandler);
router.get('/logout', verifyJWT, logout as RequestHandler);

export default router;