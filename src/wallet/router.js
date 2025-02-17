import { Router } from "express";
import getController from "./controllers/get.js";
import postController from "./controllers/post.js";
import deleteController from "./controllers/delete.js";
import updateController from "./controllers/update.js";
import verifyToken from "../../middleware/index.js";
import getByIdController from "./controllers/getById.js"

const router = Router();

router.post("/add", verifyToken, postController)
router.get("/get", verifyToken, getController)
// router.post("/get", loginController)
// router.patch("/update", verifyToken, updateController)
// router.delete("/delete", verifyToken, deleteController)

export default router;