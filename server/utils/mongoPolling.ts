import { contestModel } from "../models/contest";

async function pollContest(contestId: string): Promise<any> {
  try {
    if (!contestId) {
      throw new Error("Contest ID is required.");
    }

    const contest = await contestModel.findOne({_id:contestId});

    if (!contest) {
      throw new Error("Contest not found.");
    }

    return contest;
  } catch (error) {
    console.error("Error polling contest:", error);
    throw error;
  }
}

export { pollContest };