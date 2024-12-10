import { contestModel } from "../models/contest";
import jwt from "jsonwebtoken";
import { CONTEST_SECRET } from "../server";

async function checkContest(req:any, res:any, next:any): Promise<any> {
    try {

        const {contest_id} = req.body;

        console.log(contest_id);
        

        
        const contest = await contestModel.findOne({ _id: contest_id });
        if (!contest) {
            return res.status(403).json({ message: "not found" });
        }
        else if(contest.meta.community_id!==req.decoded.id){
                        return res.status(403).json({ message: "Not owner." });

        }
        

        req.contest = contest;
        next();
    } catch (error) {
        
        return res.status(500).json({ message: "Something went wrong." });
    }
}

export { checkContest };
