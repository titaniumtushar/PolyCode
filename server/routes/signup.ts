import { CommunityModel, UserModel } from "../models/user";
import { hashedPassword } from "../utils/hash";


type role = "C" | "U"



export async function signup(req:any,res:any,role:role){
     try{
    

   const {name,password,email} = req.body;

   if(!name || !password || !email){

      return res.status(400).json({message:"Invalid Input."})
      
   }

   

   if(role==="C"){

    let k = await CommunityModel.findOne({email:email});
    if(k){
        return res.status(403).json({message:"Community already exists."})

    }

   }

   else if(role==="U"){

    let k = await UserModel.findOne({email:email});
    if(k){
        return res.status(403).json({message:"User already exists."})

    }


   }


   let newModal:any ;

   if(role==="C"){
    
    newModal= new CommunityModel({
      name:name,
      password:hashedPassword(password),
      email:email
   });

   }
   else if(role==="U"){
    newModal =new UserModel({
      name:name,
      password:hashedPassword(password),
      email:email
   }); 
   }

   

   await newModal.save();
    

    return res.status(200).json({message:"Signup Succesful."})

   }
   catch(error:any){
    console.log("error occured")
   }
}