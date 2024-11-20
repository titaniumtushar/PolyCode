import { contestModel } from "../models/contest";



export async function findContest( req:any,res:any){
    
    try {
    const contests = await contestModel.find({});
    if(contests.length===0){
            return res.status(404).json({message:"Contest not found!"})

    }
    return res.status(200).json({data:contests,message:"Found"})
        
    } catch (error) {

            return res.status(500).json({message:"Something went wrong!"});

        
    }

}