import { Router } from "express";
const router = Router();
import { createNewAccount, deleteAccount, deleteAccounts, getAccount, getAllAccounts, updateAccount } from "../../controllers/accountsController.js"

router
  .route("/")
  .get(getAllAccounts)
  .post(createNewAccount)
  .put(updateAccount)
  .delete(deleteAccounts);
router
  .route("/:id")
  .get(getAccount)
  .delete(deleteAccount);

//routes always export a router
export { router as accountsRouter };
