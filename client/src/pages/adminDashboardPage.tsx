import React, { useEffect, useState } from "react";
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

interface Wallet {
  current_balance: number;
}

const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [walletBalances, setWalletBalances] = useState<{ [key: string]: number }>({});
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filterTag, setFilterTag] = useState<string>("");

  const tags = [
    "Backend Development",
    "UI/UX Designer",
    "Devops",
    "Data Science",
    "AI/ML",
    "Full Stack Development",
    "Frontend Development",
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_URL}/api/wallet/users`, {
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
        setFilteredUsers(data.users);

        // Fetch wallet balances
        fetchWalletBalances(data.users);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("An error occurred while fetching users.");
      }
    };

    const fetchWalletBalances = async (users: User[]) => {
      const balances: { [key: string]: number } = {};

      await Promise.all(
        users.map(async (user) => {
          if (user.wallet_id) {
            try {
              const response = await fetch(`${API_URL}/api/wallet/${user.wallet_id}`, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              });

              if (response.ok) {
                const walletData: { data: Wallet } = await response.json();
                balances[user._id] = walletData.data.current_balance;
              } else {
                balances[user._id] = 0; // Default to 0 if wallet fetch fails
              }
            } catch (err) {
              console.error(`Error fetching wallet for user ${user._id}:`, err);
              balances[user._id] = 0;
            }
          } else {
            balances[user._id] = 0;
          }
        })
      );

      setWalletBalances(balances);
    };

    fetchUsers();
  }, []);

  const handleFilterChange = (tag: string) => {
    setFilterTag(tag);
    if (tag.trim() !== "") {
      setFilteredUsers(
        users.filter((user) => user.tag?.toLowerCase() === tag.toLowerCase())
      );
    } else {
      setFilteredUsers(users);
    }
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  const sortedUsers = [...filteredUsers].sort(
    (a, b) => (walletBalances[b._id] || 0) - (walletBalances[a._id] || 0)
  );

  return (
    <div className="relative min-h-screen">
      {/* Background Gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-black"
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 80%)",
          zIndex: -1,
        }}
      ></div>

      <div className="relative z-10 p-6">
        {/* Error Message */}
        {error && (
          <h6 className="text-xl font-bold text-center mb-6 text-red-400">
            {error}
          </h6>
        )}

        <h1 className="text-3xl font-bold text-center mb-6 text-white">
          College Ranking
        </h1>

        {/* Filter Tags */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => handleFilterChange("")}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filterTag === ""
                ? "bg-orange-500 text-white"
                : "bg-gray-300 text-black"
            }`}
          >
            All Tags
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleFilterChange(tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                filterTag === tag
                  ? "bg-orange-500 text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* User List */}
        <div className="bg-black text-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Student List</h2>
          <div className="space-y-4">
            {sortedUsers.map((user, index) => (
              <div
                key={user._id}
                className="bg-gray-800 p-4 rounded-lg mb-4 shadow-lg"
              >
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => handleUserClick(user)}
                >
                  <div className="w-1/12 text-lg font-bold">{index + 1}</div>
                  <div className="w-4/12 text-xl font-semibold text-orange-400">
                    {user.name}
                    <p className="text-sm text-gray-400">ArenaScore: {walletBalances[user._id] || 0}</p>
                  </div>
                </div>

                {selectedUser?._id === user._id && (
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

export default Dashboard;
