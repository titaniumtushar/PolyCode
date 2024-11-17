import mongoose from "mongoose";
import { contestModel } from "../models/contest";

interface contest{
  contest_name: string;
  invitation_code: string;
  question_set: [object];
  prize_distribution: object;
  community_id: string;
  start_time?: number;
  end_time?: number;
}


async function createContest(req:any,res:any){
    const { contest_name, invitation_code, question_set, prize_distribution } =
        req.body;


    if(!contest_name || !invitation_code || !question_set ||  !prize_distribution){
      return res.status(400).json({message:"All param are required"});

    }

    const contest:contest= {
        contest_name:contest_name,
        invitation_code:"46546560",
        question_set:question_set,
        prize_distribution:prize_distribution,
        community_id:req.decoded.id,
    }


    try {

        const newContest = new contestModel({meta:contest});

        await newContest.save();

      return res.status(200).json({message:"Contest Created!"});

        
    } catch (error) {
        console.log(error);
        return res.status(400).json({message:"Something went wrong"});


    }


    

}


export {createContest}
