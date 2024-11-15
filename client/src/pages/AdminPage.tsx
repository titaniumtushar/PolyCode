import { useState } from "react";
import MainHeading from "../components/MainHeading";
import axios from "axios";


const AdminPage = () => {
    const [showForm, setShowForm] = useState(false);
    const [contestType, setContestType] = useState<"paid" | "credit" | null>(null);
    const [contestDetails, setContestDetails] = useState({
        contest_name: "",
        invitation_code: "",
        credit_1st: 0,
        credit_2nd: 0,
        credit_3rd: 0,
        wallet_address: "",
        amount_matic: 0,
    });
    const [step, setStep] = useState(1);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContestDetails({
            ...contestDetails,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = () => {
        const contestData = contestType === "credit"
            ? {
                  contest_name: contestDetails.contest_name,
                  invitation_code: contestDetails.invitation_code,
                  credit_to_winners: {
                      first: contestDetails.credit_1st,
                      second: contestDetails.credit_2nd,
                      third: contestDetails.credit_3rd,
                  },
              }
            : {
                  wallet_address: contestDetails.wallet_address,
                  amount_matic: contestDetails.amount_matic,
              };

        axios
            .post("/api/contest", JSON.stringify(contestData))
            .then((res) => console.log(res.data))
            .catch((err) => console.error(err));
    };

    return (
        <div>
           
            <div className="flex flex-col items-center mt-8">
                {/* Buttons for Create Contest and Your Marketplace */}
                <div className="flex space-x-4">
                    <button
                        className="w-40 h-40 bg-gradient-to-r from-purple-500 to-orange-500 text-white rounded-lg flex items-center justify-center text-lg font-bold shadow-lg"
                        onClick={() => setShowForm(true)}
                    >
                        Create Contest
                    </button>
                    <button
                        className="w-40 h-40 bg-gradient-to-r from-purple-500 to-orange-500 text-white rounded-lg flex items-center justify-center text-lg font-bold shadow-lg"
                    >
                        Your Marketplace
                    </button>
                </div>

                {showForm && (
                    <div className="bg-black text-purple-400 p-6 rounded-lg shadow-lg w-full max-w-md mt-8">
                        {contestType === null && (
                            <>
                                <h3 className="text-lg font-bold mb-4">Select Contest Type</h3>
                                <button
                                    className="bg-yellow-400 text-black py-2 px-4 rounded mr-4"
                                    onClick={() => setContestType("credit")}
                                >
                                    Credit Contest
                                </button>
                                <button
                                    className="bg-purple-600 text-white py-2 px-4 rounded"
                                    onClick={() => setContestType("paid")}
                                >
                                    Paid Contest
                                </button>
                            </>
                        )}

                        {contestType === "credit" && step === 1 && (
                            <>
                                <h3 className="text-lg font-bold mb-4">Credit Contest</h3>
                                <div className="mb-4">
                                    <label className="block mb-1">Contest Name</label>
                                    <input
                                        type="text"
                                        name="contest_name"
                                        value={contestDetails.contest_name}
                                        onChange={handleChange}
                                        className="w-full border border-gray-700 p-2 rounded bg-black text-purple-400"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1">Invitation Code</label>
                                    <input
                                        type="text"
                                        name="invitation_code"
                                        value={contestDetails.invitation_code}
                                        onChange={handleChange}
                                        className="w-full border border-gray-700 p-2 rounded bg-black text-purple-400"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1">Credit to 1st Winner</label>
                                    <input
                                        type="number"
                                        name="credit_1st"
                                        value={contestDetails.credit_1st}
                                        onChange={handleChange}
                                        className="w-full border border-gray-700 p-2 rounded bg-black text-purple-400"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1">Credit to 2nd Winner</label>
                                    <input
                                        type="number"
                                        name="credit_2nd"
                                        value={contestDetails.credit_2nd}
                                        onChange={handleChange}
                                        className="w-full border border-gray-700 p-2 rounded bg-black text-purple-400"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1">Credit to 3rd Winner</label>
                                    <input
                                        type="number"
                                        name="credit_3rd"
                                        value={contestDetails.credit_3rd}
                                        onChange={handleChange}
                                        className="w-full border border-gray-700 p-2 rounded bg-black text-purple-400"
                                    />
                                </div>
                                <button
                                    className="bg-blue-500 text-white py-2 px-4 rounded"
                                    onClick={() => setStep(2)}
                                >
                                    Next: Select Questions
                                </button>
                            </>
                        )}

                        {contestType === "paid" && step === 1 && (
                            <>
                                <h3 className="text-lg font-bold mb-4">Paid Contest</h3>
                                <div className="mb-4">
                                    <label className="block mb-1">Wallet Address</label>
                                    <input
                                        type="text"
                                        name="wallet_address"
                                        value={contestDetails.wallet_address}
                                        onChange={handleChange}
                                        className="w-full border border-gray-700 p-2 rounded bg-black text-purple-400"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1">Amount (Matic Coins)</label>
                                    <input
                                        type="number"
                                        name="amount_matic"
                                        value={contestDetails.amount_matic}
                                        onChange={handleChange}
                                        className="w-full border border-gray-700 p-2 rounded bg-black text-purple-400"
                                    />
                                </div>
                                <button
                                    className="bg-purple-600 text-white py-2 px-4 rounded"
                                    onClick={() => setStep(2)}
                                >
                                    Deposit & Submit
                                </button>
                            </>
                        )}

                        {/* Step 2: For Credit Contest */}
                        {contestType === "credit" && step === 2 && (
                            <>
                                <h3 className="text-lg font-bold mb-4">Select Questions</h3>
                                <p>Select the set of questions for your contest...</p>
                                <button
                                    className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
                                    onClick={handleSubmit}
                                >
                                    Submit Contest
                                </button>
                            </>
                        )}
                        {contestType === "paid" && step === 2 && (
                            <>
                                <h3 className="text-lg font-bold mb-4">Paid Contest</h3>
                                <div className="mb-4">
                                    <label className="block mb-1">Contest Name</label>
                                    <input
                                        type="text"
                                        name="contest_name"
                                        value={contestDetails.contest_name}
                                        onChange={handleChange}
                                        className="w-full border border-gray-700 p-2 rounded bg-black text-purple-400"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1">Invitation Code</label>
                                    <input
                                        type="text"
                                        name="invitation_code"
                                        value={contestDetails.invitation_code}
                                        onChange={handleChange}
                                        className="w-full border border-gray-700 p-2 rounded bg-black text-purple-400"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1">MATIC coins to 1st Winner</label>
                                    <input
                                        type="number"
                                        name="1st_prize"
                                        value={contestDetails.credit_1st}
                                        onChange={handleChange}
                                        className="w-full border border-gray-700 p-2 rounded bg-black text-purple-400"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1">MATIC coins to 2nd Winner</label>
                                    <input
                                        type="number"
                                        name="2nd_prize"
                                        value={contestDetails.credit_2nd}
                                        onChange={handleChange}
                                        className="w-full border border-gray-700 p-2 rounded bg-black text-purple-400"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1">MATIC coins to 3rd Winner</label>
                                    <input
                                        type="number"
                                        name="3rd_prize"
                                        value={contestDetails.credit_3rd}
                                        onChange={handleChange}
                                        className="w-full border border-gray-700 p-2 rounded bg-black text-purple-400"
                                    />
                                </div>
                                <button
                                    className="bg-blue-500 text-white py-2 px-4 rounded"
                                    onClick={() => setStep(3)}
                                >
                                    Next: Select Questions
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPage;
