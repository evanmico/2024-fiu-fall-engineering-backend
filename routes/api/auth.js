import { Router } from "express";
const router = Router();
import handleAccountLogin from "../../controllers/authController.js";

router.post("/", handleAccountLogin);

export {router as authRouter};