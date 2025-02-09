import {sendVerificationCode, createUser, currentUser, updateUser, deleteUser, login, logout, getUserById, getAllUsers } from '../../controllers/users/user.controller'; 
import {verifyJWT} from '../../middleware/auth.middleware';
import { Router, RequestHandler } from 'express';

const router = Router();


router.post('/verify', sendVerificationCode as RequestHandler);
router.post('/user', createUser as RequestHandler);
router.post('/login', login as RequestHandler);
router.get('/logout', logout as RequestHandler);
router.get('/user', verifyJWT, currentUser as RequestHandler);
router.put('/user', verifyJWT, updateUser as RequestHandler);
router.delete('/user', verifyJWT, deleteUser as RequestHandler);

//Admin routes
router.get('/users/:id', verifyJWT, getUserById as RequestHandler);
router.get('/users', verifyJWT, getAllUsers as RequestHandler);
// router.get('/user/:id', verifyJWT, getUserById as RequestHandler);
// router.put('/user/:id', verifyJWT, updateUserById as RequestHandler);
// router.delete('/user/:id', verifyJWT, deleteUserById as RequestHandler);

export default router; 