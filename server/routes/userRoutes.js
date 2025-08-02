import express from "express";
import { getUserProfile, updateUserProfile } from "../controller/userController.js";
import { registerUser, verifyUserOTP, loginUser, logoutUser, getMe } from "../controller/authController.js";
import auth from "../middleware/auth.js";

const router = express.Router();
// User registration route
router.post("/register", registerUser)
//User otp verification route
router.post("/verify-otp", verifyUserOTP);
// User login route
router.post("/login", loginUser);
// User logout route
router.get("/logout", logoutUser);
// Get user profile route
router.get("/profile", auth, getUserProfile);
// Update user profile route
router.put("/profile", auth, updateUserProfile);
router.get('/getme', auth, getMe)


export default router;

