require("dotenv").config();
import express from "express";
import cors from "cors";
import router from "./routes/index";
import mongoose from "mongoose";
import cookieParser from 'cookie-parser';


const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/newest";
console.log(MONGODB_URI);
export const JWT_SECRET:any = process.env.JWT_SECRET || "my secret1";
export const CONTEST_SECRET = process.env.CONTEST_SECRET || "my secret2";

mongoose.connect(MONGODB_URI);

export const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB");
});

const app: express.Application = express();
const port = process.env.PORT || 8080;

app.use(cors({
    origin:true,
    credentials: true,  
}));
app.use(express.json());
app.use(cookieParser());



app.use("/api", router);

app.listen(port, () => {
    console.log(`server listening at port: ${port}`);
});
