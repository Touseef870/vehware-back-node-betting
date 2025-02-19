import { Router } from "express";
import getController from "./controllers/get.js";
// import postController from "./controllers/post.js";
// import deleteController from "./controllers/delete.js";
import updateController from "./controllers/update.js";
import verifyToken from "../../../middleware/index.js";
const router = Router();

router.get("/get", verifyToken, getController)
router.patch("/update", verifyToken, updateController)
// router.post("/add/:id", verifyToken, postController)
// router.delete("/:id", deleteController)

export default router;