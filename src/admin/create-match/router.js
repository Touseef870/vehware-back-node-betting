import { Router } from "express";
import getController from "./controllers/get.js";
import postController from "./controllers/post.js";
import getByIdController from "./controllers/getById.js"
import deleteController from "./controllers/delete.js";
import updateController from "./controllers/update.js";
import { verifyToken } from "../../../middleware/index.js";
const router = Router();

router.post("/create", verifyToken, postController)
router.get("/get", getController)
router.get("/get/:id", getByIdController)
router.patch("/update/:matchId", verifyToken, updateController)
// router.delete("/:id", deleteController)

export default router;