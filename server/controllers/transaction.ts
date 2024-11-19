import { WalletModel } from "../models/wallet";

export async function transaction(receiverId:string,transmitterId:string,amount:number,req:any,res:any){

  if(amount<=0){
        return res.status(400).json({message:"This amount cant be transmitted"});


  }

    try {

    
    const wallets = await WalletModel.find({
    $or: [
      { wallet_id:  transmitterId},
      { wallet_id: receiverId },
    ],
  });

  // Check if both exist
  const transmitter = wallets.find(wallet => wallet.wallet_id === transmitterId);
  const receiver = wallets.find(wallet => wallet.wallet_id === receiverId);


  if (!transmitter || !receiver) {

    return res.status(404).json({message:"Either head or tail is not found!"});
  }


  
  if(amount>transmitter.current_balance){
       return res.json({message:"Your current balance is unsufficient!"});

  }

  const newTransaction:any = {
    head:receiver.wallet_id,
    tail:transmitter.wallet_id,
    amount:amount
  }

  transmitter.transactions.push(newTransaction);
  receiver.transactions.push(newTransaction);


  transmitter.current_balance = transmitter.current_balance -  amount
  receiver.current_balance = receiver.current_balance + amount
  await receiver.save();
  await transmitter.save();





   return res.json({message:"Transaction completed!",receipt:newTransaction});
 
        
    } catch (error) {

        console.log(error);


    return res.status(500).json({message:"Something went wrong!"});
        
    }
    





}