import { RegisteredModel } from "../models/registered";
import { UserModel } from "../models/user";
import { sendMail } from "../utils/nodeMailer";




async function registerPrivateContest(req:any,res:any){

    const {contest_id,user_id,contest_name} = req.query;

    console.log("sdnn");


    try {
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


         const user = await UserModel.findOne({_id:user_id});
         if(!user){
            return res
            .status(200)
            .json({ message: "Something have gone wrong."});

         }
         
        sendMail(user.email,user.name,`Hey join this link http://localhost:3000/user/join/private/contest/${contest_id}`);

        
        return res
            .status(200)
            .json({ message: "User registered succesfully."});
        
    } catch (error) {

        console.log(error);
                return res
            .status(500)
            .json({ message: "Something went wrong."});


        
    }



       
            

}



async function registerPrivateQuizes(req:any,res:any){

    const {contest_id,user_id,contest_name} = req.query;

    console.log("sdnn");


    try {
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


         const user = await UserModel.findOne({_id:user_id});
         if(!user){
            return res
            .status(200)
            .json({ message: "Something have gone wrong."});

         }
         
        sendMail(user.email,user.name,`Hey join this link http://localhost:3000/user/join/private/contest/${contest_id}`);

        
        return res
            .status(200)
            .json({ message: "User registered succesfully."});
        
    } catch (error) {

        console.log(error);
                return res
            .status(500)
            .json({ message: "Something went wrong."});


        
    }



       
            

}

export {registerPrivateContest};


