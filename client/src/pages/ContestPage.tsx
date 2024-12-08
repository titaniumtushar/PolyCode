import React, { useEffect, useState } from "react";
import { API_URL } from "../App";
import { useNavigate } from "react-router-dom";

// Modal Component for Invitation Code
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (invitationCode: string) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
  const [invitationCode, setInvitationCode] = useState<string>("");

  const handleSubmit = () => {
    if (invitationCode.trim() === "") {
      alert("Please enter an invitation code.");
      return;
    }
    onSubmit(invitationCode);
    onClose(); // Close the modal after submission
  };

  if (!isOpen) return null; // Ensure `null` is returned when modal is not open

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-black p-6 rounded-lg w-1/3">
        <h2 className="text-xl font-semibold mb-4">Enter Invitation Code</h2>
        <input
          type="text"
          className="w-full p-2 border text-black border-gray-300 rounded mb-4"
          placeholder="Enter Invitation Code"
          value={invitationCode}
          onChange={(e) => setInvitationCode(e.target.value)}
        />
        <div className="flex justify-end gap-4">
          <button
            className="py-2 px-4 bg-gray-600 text-white rounded hover:bg-gray-700"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

const ContestPage: React.FC = () => {
  const [contests, setContests] = useState<any[]>([]);
  const [selectedContest, setSelectedContest] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [contestToRegister, setContestToRegister] = useState<any | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await fetch(`${API_URL}/api/user/contest`, {
          headers: {
            "Content-Type": "application/json",
            authorization: `BEARER ${localStorage.getItem("token")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setContests(data.data);
        } else {
          console.error("Failed to fetch contests");
        }
      } catch (error) {
        console.error("Error fetching contests:", error);
      }
    };

    fetchContests();
  }, []);

  const handleJoinContest = (contest: any) => {
    navigate(`/user/join/${contest._id}`);
  };

  const handleRegisterContest = (contest: any) => {
    setContestToRegister(contest); // Track contest for registration
    setIsModalOpen(true); // Open the modal
  };

  const handleBackToList = () => {
    setSelectedContest(null);
  };

  const handleRegisterSubmit = async (invitationCode: string) => {
    if (!contestToRegister) {
      alert("No contest selected for registration.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/user/contest/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `BEARER ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          invitation_code: invitationCode,
          contest_id: contestToRegister._id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem(`contest_${contestToRegister._id}`, data.token);
        setIsModalOpen(false);
        alert("You have successfully registered for the contest.");
      } else {
        alert("Registration failed. Please check the invitation code.");
      }
    } catch (error) {
      console.error("Error registering contest:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-black text-white min-h-screen">
      {!selectedContest ? (
        <>
          <h1 className="text-2xl font-bold mb-4">Available Contests</h1>
          {contests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contests.map((contest, index) => (
                <div
                  key={index}
                  className="border border-gray-700 rounded-lg shadow-md p-4 bg-gray-800 cursor-pointer hover:bg-gray-700"
                  onClick={() => setSelectedContest(contest)}
                >
                  <h2 className="text-xl font-semibold">{contest.meta.contest_name}</h2>
                  <p className="text-sm text-gray-400">
                    Start: {new Date(contest.start_time * 1000).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-400">
                    End: {new Date(contest.end_time * 1000).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-300">
                    Prize Distribution: {contest.meta.prize_distribution.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>No contests available at the moment.</p>
          )}
        </>
      ) : (
        <div>
          <button
            className="mb-4 py-2 px-4 bg-gray-600 text-white rounded hover:bg-gray-700"
            onClick={handleBackToList}
          >
            Back to List
          </button>
          <h1 className="text-2xl font-bold mb-4">
            {selectedContest.meta.contest_name}
          </h1>
          <p className="text-sm text-gray-400">
            Start: {new Date(selectedContest.start_time * 1000).toLocaleString()}
          </p>
          <p className="text-sm text-gray-400">
            End: {new Date(selectedContest.end_time * 1000).toLocaleString()}
          </p>
          <p className="text-sm text-gray-300">
            Prize Distribution: {selectedContest.meta.prize_distribution.join(", ")}
          </p>
          <p className="mt-4 text-gray-300">
            Description: {selectedContest.meta.description || "No description available."}
          </p>
          <div className="mt-4 flex justify-start gap-4">
            <button
              className="py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={() => handleJoinContest(selectedContest)}
            >
              Join
            </button>
            <button
              className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => handleRegisterContest(selectedContest)}
            >
              Register
            </button>
          </div>
        </div>
      )}

      {/* Modal for entering invitation code */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleRegisterSubmit}
      />
    </div>
  );
};

export default ContestPage;
