import { RegisteredModel } from "../models/registered";
import { pollContest } from "../utils/mongoPolling";
import { registerContest } from "./registerContest";

async function joinContestCommunity(req: any, res: any) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    try {
        const participants = await RegisteredModel.find({
            contest_id: req.contest._id,
        });

        const data = JSON.stringify({participants:participants});
            res.write(`data: ${data}\n\n`);
        
    } catch (error) {

        console.log(error);
    }

    const sendEvent = async () => {
            let contestRankings = await pollContest(req.contest._id);
            let kapa = {
                message: "Update from Stream 1",
                rankings: contestRankings.rankings,
                timestamp: new Date().toISOString(),
            };

            const data = JSON.stringify(kapa);
            res.write(`data: ${data}\n\n`);
        };

    sendEvent();

    const interval = setInterval(sendEvent, 4000);

    req.on("close", () => {
        clearInterval(interval);
        res.end();
    });
}

export { joinContestCommunity };
