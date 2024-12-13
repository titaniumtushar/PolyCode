import { RegisteredModel } from "../models/registered";




async function registerPrivateContest(req:any,res:any){

    const {contest_id,user_id,contest_name} = req.query;



        const registered = await RegisteredModel.findOne({user_id:user_id,contest_id:contest_id});
        if(registered){
                    return res
            .status(200)
            .json({ message: "User already registered." });

        }
       
        const regUser = new RegisteredModel({
            contest_name: contest_name,
            contest_id: contest_id,
            user_id: user_id,
        });
        await regUser.save();
        return res
            .status(200)
            .json({ message: "User registered succesfully."});
            

}

export {registerPrivateContest};


