import { Router } from "express";
const router = Router();

import { getAllClients, getClientTherapistView } from "../../controllers/clientsController.js";

router.route("/").get(getClientTherapistView);

router.route("/all").get(getAllClients);

export { router as clientsRouter };
