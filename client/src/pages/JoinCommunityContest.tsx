import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../App";

interface Ranking {
  user_id: string;
  name: string;
  wallet_id: string;
  total_marks: number;
  marks: { [questionId: number]: number };
}

interface ContestUpdate {
  message?: string;
  rankings?: any;
  timestamp?: string;
  participants?:any
}

const JoinContestCommunity: React.FC = () => {
  const { contest_id } = useParams<{ contest_id: string }>();
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [participants, setParticipants] = useState<Ranking[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const joinContest = async () => {
      if (!contest_id) {
        setError("Contest ID is missing in the URL!");
        return;
      }

      try {
        // Make the POST request to join the contest
        const response = await fetch(`${API_URL}/api/community/join`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ contest_id }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(`Failed to join contest: ${errorData.message}`);
          return;
        }

        const data = await response.json();
        const { token } = data;

        if (!token) {
          setError("Token is missing in the server response.");
          return;
        }

        // Establish the SSE connection using the token
        const eventSource = new EventSource(
          `${API_URL}/api/community/join/${token}`
        );

        eventSource.onmessage = (event) => {
          const update: ContestUpdate = JSON.parse(event.data);
          console.log("Received update:", update);
          if(update.rankings){
            setRankings(Object.values(update.rankings));

          }
          else if(update.participants){
            setParticipants(update.participants);

          }
          
           // Update list of all participants
        };

        eventSource.onerror = () => {
          setError(
            "Failed to connect to the live updates. Please try again later."
          );
          eventSource.close();
        };

        return () => {
          eventSource.close();
        };
      } catch (err) {
        console.error("Error joining contest:", err);
        setError("An error occurred while joining the contest.");
      }
    };

    joinContest();
  }, [contest_id]);

  if (error) {
    return <div className="error-message text-white">{error}</div>;
  }

  return (
    <div className="contest-community bg-black text-white min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Contest Community: {contest_id}</h1>
      <div className="flex space-x-8">
        {/* Leaderboard on Left */}
        <div className="w-1/3 bg-black text-white p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Leaderboard</h2>
          <ul className="space-y-4">
            {rankings.map((ranking, index) => (
              <li key={ranking.user_id} className="flex justify-between items-center border-b py-2">
                <span>{index + 1}. {ranking.name}</span>
                <span>Total Marks: {ranking.total_marks}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Participants List on Right */}
        <div className="w-2/3 bg-black text-white p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Participants</h2>
          <ul className="space-y-4">
            {participants.map((participant) => (
              <li key={participant.user_id} className="flex justify-between items-center border-b py-2">
                
                <span>User ID: {participant.user_id}</span>
                
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default JoinContestCommunity;
