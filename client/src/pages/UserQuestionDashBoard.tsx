import React, { useEffect, useState } from "react";
import { API_URL } from "../App";
import ProblemSet from "./ProblemSet";
import { useNavigate } from "react-router-dom";

const UserQuestionDashBoard: React.FC = () => {
  const navigate = useNavigate();
  const [contest, setContest] = useState<any>({});
  const [token, setToken] = useState<string | null>(null); // Store token after authentication
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // State to check if user is authenticated
  const contestId = window.location.pathname.split("/").pop(); // Extract contest_id from the URL

  // Function to check user authentication
  const checkAuthentication = async () => {
    try {
      const response = await fetch(`${API_URL}/api/user/auth`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `BEARER ${localStorage.getItem("token")}`, // Send the user's token
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
        console.error("User authentication failed");
      }
    } catch (error) {
      console.error("Error during authentication:", error);
    }
  };

  // Handle code submission
  const handleCodeSubmit = async (code: string) => {
    try {
      console.log("Submitted Code:", code);
      // Replace this mock logic with actual API call or processing
      if (code.includes("return")) {
        alert("Code submitted successfully!");
      } else {
        alert("Your code must include a return statement.");
      }
    } catch (error) {
      console.error("Error during code submission:", error);
      alert("Failed to submit code. Please try again.");
    }
  };

  useEffect(() => {
    // First, check if the user is authenticated
    if (!localStorage.getItem(`contest_${contestId}`)) {
      navigate("/user");
    }

    setToken(localStorage.getItem(`contest_${contestId}`));
    checkAuthentication();
  }, []);

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
        console.error("SSE connection error:", err);
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
      {contest && (
        <ProblemSet
          questions={contest.question_set || []}
          onSubmit={handleCodeSubmit} // Pass the onSubmit function
        />
      )}
    </div>
  );
};

export default UserQuestionDashBoard;
