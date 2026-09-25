import express from "express";
import auth from "../middleware/auth.middleware.js";
import { changePassword, getProfile , updateUser} from "../controllers/user.controller.js";


const router = express.Router();

router.get("/profile", auth, getProfile);
router.put("/update", auth, updateUser);
router.put("/change-password", auth, changePassword);

export default router;