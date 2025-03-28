import { Router } from "express";
import authRoute from './../src/authentication/router.js';
import betRoute from "../src/bet/router.js"
import walletRoute from "../src/wallet/router.js";
import matchRoute from "../src/admin/create-match/router.js"
import questionsRoute from "../src/admin/add-questions/router.js"
import transactionRoute from "./../src/transactionRequest/router.js"
import transactionVerifyRoute from "../src/admin/verify-transaction-request/router.js"
import cricbuzz from "../src/match/router.js"
import historyRoute from "../src/history/router.js"

const router = Router();

// router.use('/', (req, res) => res.json({ message: "API route reached"}));
router.use('/auth', authRoute)
router.use('/bet', betRoute)
router.use('/upgrade-wallet', transactionRoute)
router.use('/wallet', walletRoute)
router.use('/history', historyRoute)

// Admin Use This Route
router.use('/matches', matchRoute)
router.use('/questions', questionsRoute)
router.use('/transactions-verify', transactionVerifyRoute)
router.use('/cric', cricbuzz);


export default router;