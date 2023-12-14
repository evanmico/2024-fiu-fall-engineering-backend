import { Router } from "express";
const router = Router();
import handleNewAccount from '../../controllers/registerController.js';

router.post("/", handleNewAccount);

export {router as registerRouter};