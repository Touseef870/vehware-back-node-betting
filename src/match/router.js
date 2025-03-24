import { Router } from "express";
import handleMatchFetch from './allMatches.js'
import getRecentMatches from './recentMatches.js'
import handleMatchDetails from './matchDetails.js'
import getTeamDetails from './getTeamDetails.js'
import getMatchCommentary from './commentary.js'
import getMatchScoreCard from './getMatchScoreCard.js'
import getMatchHighlightScorecard from './getMatchHighlightScorecard.js'
import getMatchLeanbackDetails from './getMatchLeanbackDetails.js'
import getLiveMatch from './getLiveMatch.js'
import getLiveMatchDetails from './liveMatchDetails.js'
 
const router = Router();

router.get("/allmatches", handleMatchFetch)
router.get("/matchdetails", handleMatchDetails)
router.get("/recent-match", getRecentMatches)
router.get("/team-details", getTeamDetails)
router.get("/commentary", getMatchCommentary)
router.get("/scores/:matchId", getMatchScoreCard)
router.get("/v2/scores", getMatchHighlightScorecard)
router.get("/lean-back-details", getMatchLeanbackDetails)

router.get('/live-matches', getLiveMatch)
router.get('/live-matches/:matchId', getLiveMatchDetails)

export default router;