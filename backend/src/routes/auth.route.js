import express from 'express'
import { register, login, logout, getAllUsers, getCurrentUser } from '../controller/auth.controller.js'
import authenticate from '../middleware/auth.middleware.js'

const router = express.Router();

// Auth
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Users
// router.get("/getAllUsers", authenticate, getAllUsers);
router.get("/me", authenticate, getCurrentUser);


export default router;