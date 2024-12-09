import React, { useEffect, useState } from 'react';
import { API_URL } from '../App';
import ProblemSet from './ProblemSet';
import {  useNavigate, } from 'react-router-dom';
import ProblemPage from './ProblemPage';
import { decodeContest } from '../ts/utils/decodeToken';
import { decode } from 'punycode';


const UserQuestionDashBoard: React.FC = () => {

    const navigate = useNavigate();
  const [contest, setContest] = useState({});
  const [token, setToken] = useState<string | null>(null); // Store token after authentication
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // State to check if user is authenticated
  const contestId = window.location.pathname.split('/').pop(); // Extract contest_id from the URL
  

  // Function to check user authentication

  
  const checkAuthentication = async () => {
    try {
      const response = await fetch(`${API_URL}/api/user/auth`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          authorization: `BEARER ${localStorage.getItem("token")}` // Send the user's token
        },
      });

      if (response.ok) {
        setIsAuthenticated(true); // User is authenticated
        const data = await response.json();
        if (data.token) {
          setToken(data.token); 
        }
      } else {
        setIsAuthenticated(false); // User is not authenticated
        console.error('User authentication failed');
      }
    } catch (error) {
      console.error('Error during authentication:', error);
    }
  };

  useEffect(() => {
    // First, check if the user is authenticated

    if(!localStorage.getItem(`contest_${contestId}`)){
        navigate("/user")
    }

    
    setToken(localStorage.getItem(`contest_${contestId}`))
    checkAuthentication();
    
  }, []);


  const mockProblemData = {
  problemName: "Find the Largest Number",
  description: `You are given an array of integers. Your task is to write a function that returns the largest number in the array.
  
  **Constraints:**
  - The array will always have at least one element.
  - All elements in the array are integers.
  - Do not use built-in functions like \`Math.max()\`.
  `,
  testCases: [
    "Test Case 1: Input: [1, 2, 3, 4, 5] → Expected Output: 5",
    "Test Case 2: Input: [-10, -20, -3, -4] → Expected Output: -3",
    "Test Case 3: Input: [99] → Expected Output: 99",
    "Test Case 4: Input: [0, 0, 0, 0] → Expected Output: 0",
  ],
  initialCode: `function findLargestNumber(arr) {
  // Write your code here
}`,
  onSubmit: async (code: string) => {
    console.log("Submitted Code:", code);
    // Simulate a mock success response
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (code.includes("return")) {
          resolve();
        } else {
          reject(new Error("Your code must include a return statement."));
        }
      }, 1000);
    });
  },
};

  useEffect(() => {

    
    
    if (isAuthenticated && token) {
      
      const eventSource = new EventSource(`${API_URL}/api/user/join/${token}`);

      eventSource.onmessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        console.log(data, "this is data");

        // Assuming 'question_set' contains the questions
        if (data.contest) {
          setContest(data.contest);
          console.log(data.contest);
        }
      };

      eventSource.onerror = (err) => {
        console.error('SSE connection error:', err);
        eventSource.close();
      };

      // Cleanup the connection when the component unmounts
      return () => {
        eventSource.close();
      };
    }
  }, [isAuthenticated, token]);

  return (
    <div>
      
      {contest && <ProblemSet questions={contest.question_set || [] } token = {token}/>}
      


      
    </div>
  );
};

export default UserQuestionDashBoard;
