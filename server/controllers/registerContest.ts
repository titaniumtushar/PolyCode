import { contestModel } from "../models/contest";
import { RegisteredModel } from "../models/registered";
import { CONTEST_SECRET } from "../server";
import jwt from "jsonwebtoken";
async function registerContest(req: any, res: any) {
    // /contest/register/:contest_id

    const { contest_id } = req.body;

    if (!contest_id) {
        return res.status(400).json({ message: "All params are required." });
    }

    try {
        const contest= await contestModel.findOne({ _id: contest_id });
        if (!contest) {
            return res.status(404).json({ message: "No contests are found." });
        } else if (new Date().valueOf() / 1000 > Number(contest.end_time)) {
            return res
                .status(403)
                .json({ message: "Contest already finished." });
        }

        const payload = {question_set:contest.meta.question_set,start_time:contest.start_time,end_time:contest.end_time,community_id:contest.meta.community_id};

        const regToken = jwt.sign(payload,String(CONTEST_SECRET));
        console.log(CONTEST_SECRET);
        console.log(regToken);


        const registered = await RegisteredModel.findOne({user_id:req.decoded.id,contest_id:contest_id});
        if(registered){
                    return res
            .status(400)
            .json({ message: "User already registered.",token:regToken });

        }
       
        const regUser = new RegisteredModel({
            contest_name: contest.meta.contest_name,
            contest_id: contest._id,
            user_id: req.decoded.id,
        });
        await regUser.save();
        return res
            .status(200)
            .json({ message: "User registered succesfully.",token:regToken });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong." });
    }

   
}



export { registerContest };
