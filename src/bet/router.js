import { Router } from "express";
import postController from "./controllers/post.js";
import deleteController from "./controllers/delete.js";
import updateController from "./controllers/update.js";
import verifyToken from "../../middleware/index.js";
import getByIdController from "./controllers/getById.js"

const router = Router();

router.post("/add", verifyToken, postController)
router.get("/get", getByIdController)
// router.post("/login", loginController)
// router.patch("/update", verifyToken, updateController)
// router.delete("/delete", verifyToken, deleteController)

export default router;