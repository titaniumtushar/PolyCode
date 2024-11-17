import { WalletModel } from "../models/wallet";

export async function transaction(tailId:string,amount:number,req:any,res:any){


    try {

        const headId = req.decoded.wallet_id
    const wallets = await WalletModel.find({
    $or: [
      { wallet_id:  tailId},
      { wallet_id: headId },
    ],
  });

  // Check if both exist
  const head = wallets.find(wallet => wallet.wallet_id === headId);
  const tail = wallets.find(wallet => wallet.wallet_id === tailId);


  if (!head || !tail) {

    return res.status(404).json({message:"Either head or tail is not found!"});
  }


  console.log(head,tail);
  if(amount>tail.current_balance){
       return res.json({message:"Your current balance is unsufficient!"});

  }

  const newTransaction:any = {
    head:head.wallet_id,
    tail:tail.wallet_id,
    amount:amount
  }

  head.transactions.push(newTransaction);
  tail.transactions.push(newTransaction);


  head.current_balance -= amount
  tail.current_balance += amount
  await head.save();
  await tail.save();





   return res.json({message:"Transaction completed!",receipt:newTransaction});
 
        
    } catch (error) {

        console.log(error);


    return res.status(500).json({message:"Something went wrong!"});
        
    }
    





}