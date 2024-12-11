import React, { useEffect, useState } from "react";
import { API_URL } from "../App";

interface User {
  _id: string; // MongoDB ObjectId
  name: string;
  email: string;
  collegeYear: string;
  cgpa: string;
  tag?: string;
  description?: string;
  wallet_id: string;
  resume?: string;
  profile_pic?: string;
  certificates?: string;
}

const UnverifiedUsersDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnverifiedUsers = async () => {
      try {
        const response = await fetch(`${API_URL}/api/community/unverified-users`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(`Failed to fetch users: ${errorData.message}`);
          return;
        }

        const data = await response.json();
        setUsers(data.unverifiedUsers);
      } catch (err) {
        console.error("Error fetching unverified users:", err);
        setError("An error occurred while fetching users.");
      }
    };

    fetchUnverifiedUsers();
  }, []);

  const handleVerify = async (userId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/community/verify-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(`Failed to verify user: ${errorData.message}`);
        return;
      }

      setUsers(users.filter((user) => user._id !== userId));
    } catch (err) {
      console.error("Error verifying user:", err);
      setError("An error occurred while verifying the user.");
    }
  };

  const toggleExpand = (userId: string) => {
    setExpandedUserId((prevId) => (prevId === userId ? null : userId));
  };

  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-black"
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 80%)",
          zIndex: -1,
        }}
      ></div>

      <div className="relative z-10 p-6">
        {error && (
          <h6 className="text-xl font-bold text-center mb-6 text-red-400">
            {error}
          </h6>
        )}

        <h1 className="text-3xl font-bold text-center mb-6 text-white">
          Unverified Users
        </h1>

        <div className="bg-black text-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Unverified Users List</h2>
          <ul className="space-y-4">
            {users.map((user) => (
              <li
                key={user._id}
                className="border-b border-gray-700 pb-4"
              >
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleExpand(user._id)}
                >
                  <span className="text-lg font-bold">
                    {user.name} (Wallet ID: {user.wallet_id})
                  </span>
                  <span>
                    {expandedUserId === user._id ? "▲" : "▼"}
                  </span>
                </div>

                {expandedUserId === user._id && (
                  <div className="mt-4 pl-4">
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>College Year:</strong> {user.collegeYear}</p>
                    <p><strong>CGPA:</strong> {user.cgpa}</p>
                    {user.tag && <p><strong>Tag:</strong> {user.tag}</p>}
                    {user.description && (
                      <p><strong>Description:</strong> {user.description}</p>
                    )}
                    <button
                      onClick={() => handleVerify(user._id)}
                      className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                    >
                      Verify User
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UnverifiedUsersDashboard;
