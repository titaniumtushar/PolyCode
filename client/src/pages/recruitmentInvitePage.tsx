import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../App";



interface User {
  _id: string;
  name: string;
  email: string;
  wallet_id: string;
  resume_url: string;
  description: string;
  tag: string;
  profile_pic: string;
  certificates: string;
}

const RecruitmentInvite: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null); // Track expanded user
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
 const { state } = useLocation();
  
  const { recruitment_id } = useParams<{ recruitment_id: string }>();


  


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_URL}/api/community/users`, {
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
        setUsers(data.users);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("An error occurred while fetching users.");
      }
    };


    if(state){
    console.log(state);

  }

    fetchUsers();
  }, []);

  const handleInvite = async (userId: string) => {
    if (!recruitment_id) {
      
      setError("Recruitment ID is missing.");
      return;
    }

   try {
    const res = await fetch(
                `${API_URL}/api/community/register/privately?user_id=${userId}&contest_id=${state.contest_id}&contest_name=${state.contest_name}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
    
            const data = await res.json();
            console.log(data);
            alert(data.message);
    
   } catch (error) {
    
   }
  };

  const toggleUserDetails = (userId: string) => {
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
        {success && (
          <h6 className="text-xl font-bold text-center mb-6 text-green-400">
            {success}
          </h6>
        )}

        <h1 className="text-3xl font-bold text-center mb-6 text-white">
          Recruitment Drive
        </h1>

        <div className="bg-black text-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Student List</h2>
          <div className="space-y-4">
            {users.map((user, index) => (
              <div
                key={user._id}
                className="bg-gray-800 p-4 rounded-lg mb-4 shadow-lg"
              >
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleUserDetails(user._id)}
                >
                  <div className="w-1/12 text-lg font-bold">{index + 1}</div>
                  <div className="w-4/12 text-xl font-semibold text-orange-400">
                    {user.name}
                    <p className="text-sm text-gray-400">{user.wallet_id}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent parent click
                      handleInvite(user._id);
                    }}
                    className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                  >
                    Invite
                  </button>
                </div>

                {expandedUserId === user._id && (
                  <div className="mt-4 bg-gray-700 p-4 rounded-lg text-sm">
                    <img
                      src={user.profile_pic}
                      alt={`${user.name}'s profile`}
                      className="w-16 h-16 rounded-full mb-4"
                    />
                    <p>
                      <strong>Email:</strong> {user.email}
                    </p>
                    <p>
                      <strong>Description:</strong> {user.description}
                    </p>
                    <p>
                      <strong>Tag:</strong> {user.tag}
                    </p>
                    <p>
                      <strong>Resume:</strong>{" "}
                      <a
                        href={user.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 underline"
                      >
                        View Resume
                      </a>
                    </p>
                    <p>
                      <strong>Certificates:</strong>{" "}
                      <a
                        href={user.certificates}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 underline"
                      >
                        View Certificates
                      </a>
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruitmentInvite;
