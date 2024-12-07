import React, { useEffect, useState } from 'react';
import { API_URL } from '../App';

interface Question {
  title: string;
  description: string;
  options: string[];
}

const UserQuestionDashBoard: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const contestId = window.location.pathname.split('/').pop(); // Extract contest_id from the URL

  // Function to register for the contest
  const registerForContest = async (contestId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/user/contest/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization:`BEARER ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ contest_id: contestId }), 
      });

      const data = await response.json();
      console.log(data);
      if (response.ok && data.token) {
        setToken(data.token); // Store token from response
      } else {
        console.error('Failed to register for the contest');
      }
    } catch (error) {
      console.error('Error during contest registration:', error);
    }
  };

  useEffect(() => {
    // Register for the contest when the component mounts
    if (contestId) {
      registerForContest(contestId);
    }
  }, [contestId]);

  useEffect(() => {
    if (token) {
        console.log(token);
      const eventSource = new EventSource(`${API_URL}/api/user/join/${token}`);

      eventSource.onmessage = (event: MessageEvent) => {
        const data: Question = JSON.parse(event.data);
        setQuestions((prevQuestions) => [...prevQuestions, data]);
      };

      eventSource.onerror = (err) => {
        console.error('SSE connection error:', err);
        eventSource.close();
      };

      // Cleanup connection on unmount
      return () => {
        eventSource.close();
      };
    }
  }, [token, contestId]);

  return (
    <div>
      <h1>User Question Dashboard</h1>
      <ul>
        {questions.length > 0 ? (
          questions.map((question, index) => (
            <li key={index}>
              <h3>{question.title}</h3>
              <p>{question.description}</p>
              <strong>Options:</strong>
              <ul>
                {question.options?.map((option, optIndex) => (
                  <li key={optIndex}>{option}</li>
                ))}
              </ul>
            </li>
          ))
        ) : (
          <p>No questions available yet.</p>
        )}
      </ul>
    </div>
  );
};

export default UserQuestionDashBoard;
