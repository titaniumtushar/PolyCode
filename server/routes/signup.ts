import { CommunityModel, UserModel } from "../models/user";
import { WalletModel } from "../models/wallet";
import { hashedPassword } from "../utils/hash";

type role = "C" | "U";

interface Wallet {
  wallet_id: string;
  role: string;
  current_balance: number;
  transactions?: object[];
}

export async function signup(req: any, res: any, role: role) {
  try {
    const { name, password, email } = req.body;

    // Validation for name, password, and email
    if (!name || !password || !email) {
      return res.status(400).json({ message: "Invalid Input. All fields are required." });
    }

    // Check if the email already exists based on the role
    let existingUser;
    if (role === "C") {
      existingUser = await CommunityModel.findOne({ email: email });
      if (existingUser) {
        return res.status(403).json({ message: "Community already exists." });
      }
    } else if (role === "U") {
      existingUser = await UserModel.findOne({ email: email });
      if (existingUser) {
        return res.status(403).json({ message: "User already exists." });
      }
    }

    // Generate a random wallet ID
    const wallet_id = generateRandomString(16);

    let newModal: any;

    // Create a new user or community depending on the role
    if (role === "C") {
      newModal = new CommunityModel({
        name: name,
        password: hashedPassword(password),
        email: email,
        wallet_id: wallet_id
      });
    } else if (role === "U") {
      newModal = new UserModel({
        name: name,
        password: hashedPassword(password),
        email: email,
        wallet_id: wallet_id
      });
    }

    // Save the new model to the database
    await newModal.save();
    await generateWallet(wallet_id, role, 454); // Create wallet

    return res.status(200).json({ message: "Signup Successful." });
  } catch (error: any) {
    console.error("Error occurred during signup:", error);
    return res.status(500).json({ message: "An error occurred. Please try again." });
  }
}

async function generateWallet(walletId: string, role: role, current_balance: number) {
  const walletObj: Wallet = {
    wallet_id: walletId,
    role: role,
    current_balance: current_balance,
  };

  try {
    const wallet = new WalletModel(walletObj);
    await wallet.save();
  } catch (error) {
    console.error("Error occurred while creating wallet:", error);
    throw new Error("Error occurred creating a wallet.");
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
