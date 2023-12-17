import { Router } from "express";
const router = Router();
import handleLogout from "../../controllers/logoutController.js";

router.get("/", handleLogout);

export {router as logoutRouter};