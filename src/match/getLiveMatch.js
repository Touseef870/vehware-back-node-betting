import axios from "axios";

export default async function getLiveMatch(req, res) {
    try {
        const response = await axios.get('https://cricbuzz-cricket.p.rapidapi.com/matches/v1/recent', {
            headers: {
                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com',
            },
        });

        // Debug: Log कुछ matches की structure
        console.log("Sample Match:", response.data.typeMatches[0]?.seriesMatches[0]?.seriesAdWrapper?.matches[0]);

        const liveMatches = response.data.typeMatches.flatMap((matchType) =>
            matchType.seriesMatches?.flatMap((series) =>
                series.seriesAdWrapper?.matches?.filter((match) => {
                    const status = match.matchInfo?.status?.toLowerCase();
                    return status === "live" || status?.includes("in progress");
                }) || []
            ) || []
        );

        console.log("Live Matches Found:", liveMatches.length);
        return res.status(200).json({ totalLiveMatches: liveMatches.length, matches: liveMatches });
    } catch (error) {
        console.error("Full Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}