import { Router } from "express";
import authRoute from './../src/authentication/router.js';
import betRoute from "../src/bet/router.js"
import walletRoute from "../src/wallet/router.js";
import matchRoute from "../src/admin/create-match/router.js"
import questionsRoute from "../src/admin/add-questions/router.js"

const router = Router();

router.use('/auth', authRoute)
router.use('/bet', betRoute)
router.use('/wallet', walletRoute)

// Admin Use This Route
router.use('/matches', matchRoute)
router.use('/questions', questionsRoute)


export default router;