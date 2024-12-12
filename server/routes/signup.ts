import { CommunityModel, UserModel } from "../models/user";
import { WalletModel } from "../models/wallet";
import { hashedPassword } from "../utils/hash";

type role = "C" | "U";

interface wallet {
  wallet_id: string;
  role: string;
  current_balance: number;
}

export async function signup(req: any, res: any, role: role) {
  try {
    const { name, password, email } = req.body;

    if (!name || !password || !email) {
      return res.status(400).json({ message: "Invalid Input." });
    }

    if (role === "C") {
      const existingCommunity = await CommunityModel.findOne({ email: email });
      if (existingCommunity) {
        return res.status(403).json({ message: "Community already exists." });
      }
    } else if (role === "U") {
      const existingUser = await UserModel.findOne({ email: email });
      if (existingUser) {
        return res.status(403).json({ message: "User already exists." });
      }
    }

    const wallet_id = generateRandomString(16);

    let newModel: any;

    if (role === "C") {
      newModel = new CommunityModel({
        name: name,
        password: hashedPassword(password),
        email: email,
        wallet_id: wallet_id,
      });
    } else if (role === "U") {
      newModel = new UserModel({
        name: name,
        password: hashedPassword(password),
        email: email,
        wallet_id: wallet_id,
      });
    }

    await newModel.save();
    await generateWallet(wallet_id, role, 454);

    return res.status(200).json({ message: "Signup Successful." });
  } catch (error: any) {
    console.error("Error occurred:", error);
    return res.status(500).json({ message: "An error occurred during signup." });
  }
}

async function generateWallet(walletId: string, role: role, current_balance: number) {
  const walletObj: wallet = {
    wallet_id: walletId,
    role: role,
    current_balance: current_balance,
  };

  try {
    const wallet = new WalletModel(walletObj);
    await wallet.save();
  } catch (error) {
    throw new Error("Error occurred creating a wallet!");
  }
}

function generateRandomString(length: number): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}



export {generateWallet};
