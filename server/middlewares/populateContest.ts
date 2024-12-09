import { contestModel } from "../models/contest";
import jwt from "jsonwebtoken"
import { CONTEST_SECRET } from "../server";
import { community } from "../routes/community";

async function populateContest(req: any, res: any) {

    console.log(req.body);
    try {
        let contest = await contestModel.findOne({
            _id: req.body.contest_id,
        });


        if (!contest) {
            return res.status(404).json({ message: "Contest not found!" });
        } else if (contest.meta.community_id !== "673b9b9ca3f1da4fcb31b333") {
            return res.status(403).json({ message: "Forbidden to access." });
        }
        const payload = {user_id:req.decoded.user_id,contest_id:contest._id,community_id:contest.meta.community_id};
        const token = jwt.sign(contest.toObject(),CONTEST_SECRET,{ expiresIn: '1h' });
        return res.status(200).json({ message: "Access granted.", token: token});

       
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong!" });
    }
}

export { populateContest };
