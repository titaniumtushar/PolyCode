import mongoose from "mongoose";
import { contestModel } from "../models/contest";
import { specialTransactions } from "./transaction";

interface contest {
    contest_name: string;
    invitation_code: string;
    question_set: [object];
    prize_distribution: object;
    community_id: string;
    start_time?: number;
    end_time?: number;
    description?: string;
}

async function createContest(req: any, res: any) {
    const {
        contest_name,
        invitation_code,
        question_set,
        prize_distribution,
        start_time,
        end_time,
        description,
    } = req.body;

    if (
        !contest_name ||
        !question_set ||
        !prize_distribution ||
        !start_time ||
        !end_time
    ) {
        return res.status(400).json({ message: "All param are required" });
    }

    const contest: contest = {
        contest_name: contest_name,
        invitation_code: createInvitationCodes(),
        question_set: question_set,
        prize_distribution: prize_distribution,
        community_id: req.decoded.id,
        start_time: start_time,
        end_time: end_time,
        description: description,
    };

    try {
        let totalMoney = prize_distribution.reduce(
            (accumulator: any, currentValue: any) => {
                return accumulator + currentValue;
            },
            0
        );

        let CHARGE = 20;
        totalMoney = totalMoney + CHARGE;

        const newContest = new contestModel({
            meta: contest,
            start_time: start_time,
            end_time: end_time,
        });

        await newContest.save();
        const cut_money = await specialTransactions(
            "U",
            req.decoded.wallet_id,
            totalMoney,
            req,
            res
        );
        console.log(cut_money);

        return res
            .status(200)
            .json({ message: "Contest Created and money deducted!" });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Something went wrong" });
    }
}

function createInvitationCodes(length = 4, count = 2): string {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const codes = new Set();

    while (codes.size < count) {
        let code = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters[randomIndex];
        }
        codes.add(code); // Ensures uniqueness
    }

    return String(Array.from(codes));
}

export { createContest };
