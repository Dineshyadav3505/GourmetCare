import {sendVerificationCode, createUser, currentUser, updateUser, deleteUser, login, logout, getUserById, getAllUsers, updateUserById, deleteUserById, updateUserByIdSuperAdmin } from '../../controllers/users/user.controller'; 
import {adminVerification, superAdminVerification, verifyJWT} from '../../middleware/auth.middleware';
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
router.get('/users', verifyJWT, adminVerification, getAllUsers as RequestHandler);
router.get('/user/:id', verifyJWT, adminVerification, getUserById as RequestHandler);
router.put('/user/:id', verifyJWT, adminVerification, updateUserById as RequestHandler);
router.delete('/user/:id', verifyJWT, adminVerification, deleteUserById as RequestHandler);

//SuperAdmin routes
router.put('/all/:id', verifyJWT, superAdminVerification, updateUserByIdSuperAdmin as RequestHandler);

export default router;         