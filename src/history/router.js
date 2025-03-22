import { Router } from "express";
import getController from "./controllers/get.js";
import postController from "./controllers/post.js";
import deleteController from "./controllers/delete.js";
import updateController from "./controllers/update.js";
import getByIdController from "./controllers/getById.js"
import { verifyToken } from "../../middleware/index.js"

const router = Router();

router.get("/get", verifyToken, getByIdController)
// router.post("/adduser", postController)
// router.delete("/:id", deleteController)
// router.put("/:id", updateController)

export default router;