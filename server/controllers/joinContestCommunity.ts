import { stringify } from "querystring";
import { RegisteredModel } from "../models/registered";
import { pollContest } from "../utils/mongoPolling";
import { registerContest } from "./registerContest";

async function joinContestCommunity(req: any, res: any) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const end = req.contest.end_time;
    const start = req.contest.start_time;

    try {
        const participants = await RegisteredModel.find({
            contest_id: req.contest._id,
        });

        const data = JSON.stringify({ participants: participants });
        res.write(`data: ${data}\n\n`);
    } catch (error) {
        res.end();

        console.log(error);
    }

    if(req.contest.start_time>new Date().valueOf()/1000){
        res.write(`data: ${JSON.stringify({show_message:"Event not started yet."})}\n\n`);
        res.end();
    }

    const sendEvent = async () => {
        let contestRankings;
        try {
            contestRankings = await pollContest(req.contest._id);
        } catch (error) {
            res.end();
        }

        let kapa: any = {
            message: "Update from Stream 1",
            rankings: contestRankings.rankings,
            timestamp: new Date().toISOString(),
        };

        const data = JSON.stringify(kapa);
        res.write(`data: ${data}\n\n`);
        let current_time = new Date().valueOf() / 1000;

        if (current_time >= end) {
            kapa = {
                message: "Update from Stream 1",
                show_message: "The contest has been ended.",
                timestamp: new Date().toISOString(),
            };
            const data = JSON.stringify(kapa);
            res.write(`data: ${data}\n\n`);

            clearInterval(interval); // Stop sending events
            res.end(); // Close the connection
        }
    };

    sendEvent();

    const interval = setInterval(sendEvent, 4000);

    req.on("close", () => {
        clearInterval(interval);
        res.end();
    });
}

export { joinContestCommunity };
