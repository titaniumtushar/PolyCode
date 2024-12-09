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
  message: string;
  rankings: Ranking[];
  timestamp: string;
}

const JoinContestCommunity: React.FC = () => {
  const { contest_id } = useParams<{ contest_id: string }>();
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!contest_id) {
      setError("Contest ID is missing in the URL!");
      return;
    }

    const eventSource = new EventSource(
      `${API_URL}/api/community/join/${contest_id}`
    );

    eventSource.onmessage = (event) => {
      const data: ContestUpdate = JSON.parse(event.data);
      console.log("Received update:", data);
      setRankings(data.rankings);
    };

    eventSource.onerror = () => {
      setError("Failed to connect to the live updates. Please try again later.");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [contest_id]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="contest-community">
      <h1>Contest Community: {contest_id}</h1>
      <div className="rankings-container">
        <h2>Live Rankings</h2>
        <ul>
          {rankings.map((ranking, index) => (
            <li key={ranking.user_id} className="ranking-item">
              <span>{index + 1}. </span>
              <span>Name: {ranking.name} </span>
              <span>Wallet ID: {ranking.wallet_id} </span>
              <span>Total Marks: {ranking.total_marks}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default JoinContestCommunity;
