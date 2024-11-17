import { CommunityModel, UserModel } from "../models/user";
import { WalletModel } from "../models/wallet";
import { hashedPassword } from "../utils/hash";

type role = "C" | "U"

interface wallet{
   wallet_id: string;
  role: string;
  current_balance: number;
  transactions?: [object];
}



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

   const wallet_id = generateRandomString(16);


   let newModal:any ;

   if(role==="C"){
    
    newModal= new CommunityModel({
      name:name,
      password:hashedPassword(password),
      email:email,
      wallet_id:wallet_id
   });

   }
   else if(role==="U"){
    newModal =new UserModel({
      name:name,
      password:hashedPassword(password),
      email:email,
      wallet_id:wallet_id
   }); 
   }

   

   await newModal.save();
   await generateWallet(wallet_id,role,454);
    

    return res.status(200).json({message:"Signup Succesful."})

   }
   catch(error:any){
    console.log("error occured")
   }
}



async function generateWallet(walletId:string,role:role,current_balance:number){

   const walletObj:wallet = {
      wallet_id:walletId,
      role:role,
      current_balance:current_balance,
   }

   try {

      const wallet = new WalletModel(walletObj);
      await wallet.save();

      
   } catch (error) {

      throw new Error("Error occured creating a wallet!");
      
   }

   

}




function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}
