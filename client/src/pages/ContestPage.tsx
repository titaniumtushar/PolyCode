import React, { useEffect, useState } from "react";
import { API_URL } from "../App";
import { useNavigate } from "react-router-dom";
import CodeBlock from "../components/CodeBlock";

// Modal Component for Invitation Code


const ContestPage: React.FC = () => {
  const [contests, setContests] = useState<any[]>([]);
  const [selectedContest, setSelectedContest] = useState<any | null>(null); // Track selected contest for details view
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Track modal visibility
  const [contestToRegister, setContestToRegister] = useState<any | null>(null); // Track contest to register for

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
    console.log("Joining contest:", contest.meta.contest_name);

    navigate(`/user/join/${contest._id}`);
  };

  const handleRegisterContest = (contest: any) => {
    setIsModalOpen(true); // Open the modal
  };

  const handleBackToList = () => {
    setSelectedContest(null); // Reset to contest list view
  };

  const handleRegisterSubmit = async (invitationCode: string) => {

    try {
      const response = await fetch(`${API_URL}/api/user/contest/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `BEARER ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          invitation_code: invitationCode,
          contest_id: selectedContest._id, // Use contestToRegister to get the correct contest id
        }),
      });

      const data = await response.json();

      if (response.ok) {
        
        console.log("Successfully registered:", data);
        // Close modal after registration
        localStorage.setItem(`contest_${selectedContest._id}`,data.token);
        setIsModalOpen(false);
        setContestToRegister(null); // Reset the contest to register for
        
      } else {
        console.error("Registration failed");
      }

      alert(data.message);
    } catch (error) {
      console.error("Error registering contest:", error);
      alert("An error occurred. Please try again.");
    }
  };


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

  return (
    isOpen && (
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
    )
  );
};

  return (
    <div className="p-6 bg-black text-white min-h-screen">
      {!selectedContest ? (
        <>
          <h1 className="text-2xl font-bold mb-4">Available Contests</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contests.map((contest, index) => (
              <div
                key={index}
                className="border border-gray-700 rounded-lg shadow-md p-4 bg-gray-800 cursor-pointer hover:bg-gray-700"
                onClick={() => setSelectedContest(contest)} // Set selected contest
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

          {(selectedContest.start_time<new Date().valueOf()/1000 && selectedContest.end_time>new Date().valueOf()/1000  )?
        <>
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
          
        
        </>  
        :<CodeBlock input="This contest is not live" status="lij" />
        
        }
          
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