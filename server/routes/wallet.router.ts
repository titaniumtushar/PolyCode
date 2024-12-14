import express from "express";
import { transaction } from "../controllers/transaction";
import { WalletModel } from "../models/wallet";
import { UserModel } from "../models/user";


require("dotenv");

const wallet = express.Router();

wallet.post("/pay",(req:any,res:any)=>{

    const {headId,amount} = req.body;
    const tailId = req.decoded.wallet_id;

    if(!headId || !amount){
        return res.status(400).json({message:"Bad Request"})
    }
    else if(headId===tailId){
        return res.status(403).json({message:"Bad Request"})
    }

    transaction(String(headId),String(tailId),Number(amount),req,res);

})

wallet.get("/users", async (_req: Request, res: Response) => {
    try {
        // Fetch all users with all their fields
        const users = await UserModel.find(); // No projection, fetches all fields
        res.status(200).json({ users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Failed to fetch users." });
    }
});

wallet.get("/:wallet_id",async(req,res)=>{
    console.log(req.params.wallet_id);
    try {
    const wallet = await WalletModel.findOne({wallet_id:req.params.wallet_id});
    if(!wallet){
            return res.status(404).json({message:"Wallet not found!"})

    }
    return res.status(200).json({data:{current_balance:wallet?.current_balance,transactions:wallet?.transactions},message:"Wallet found"})
        
    } catch (error) {

            return res.status(500).json({message:"Something went wrong!"});

        
    }


})

export {wallet}