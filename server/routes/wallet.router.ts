import express from "express";
import { transaction } from "../controllers/transaction";
import { WalletModel } from "../models/wallet";


require("dotenv");

const wallet = express.Router();

wallet.post("/pay",(req:any,res:any)=>{

    const {headId,amount} = req.body;
    if(!headId || !amount){
        return res.status(400).json({message:"Bad Request"})
    }

    transaction(String(headId),Number(amount),req,res);

})


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