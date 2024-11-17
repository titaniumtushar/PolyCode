import express from "express";
import { transaction } from "../controllers/transaction";

require("dotenv");

const wallet = express.Router();

wallet.get("/pay/:id/:amount",(req:any,res:any)=>{
    transaction(req.params.id,Number(req.params.amount),req,res);

})

export {wallet}