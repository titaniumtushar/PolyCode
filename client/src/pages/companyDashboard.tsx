import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const API_URL = "http://localhost:8080";

// Card Component
const StatCard = ({ value, label }: { value: number | string; label: string }) => (
  <div className="bg-gray-800 p-4 rounded shadow text-center">
    <h2 className="text-2xl font-bold">{value ?? "N/A"}</h2>
    <p className="text-sm text-gray-400">{label}</p>
  </div>
);

const CompanyDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    contests: 0,
    quizzes: 0,
    recruitmentDrives: 0,
    unverifiedUsers: 0,
    companies: 0,
  });
  const [unverifiedUserAlert, setUnverifiedUserAlert] = useState<{ _id: string; name: string; collegeYear: string }[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
          authorization: `BEARER ${localStorage.getItem("token")}`,
        };

        // Fetch all data concurrently
        const [usersRes, contestsRes, quizzesRes, recruitmentsRes, unverifiedRes] = await Promise.all([
          fetch(`${API_URL}/api/community/users`, { headers }),
          fetch(`${API_URL}/api/community/contest`, { headers }),
          fetch(`${API_URL}/api/community/quizzes`, { headers }),
          fetch(`${API_URL}/api/community/recruitment/all`, { headers }),
          fetch(`${API_URL}/api/community/unverified-users`, { headers }),
        ]);

        // Parse responses
        const [usersData, contestsData, quizzesData, recruitmentsData, unverifiedUsersData] = await Promise.all([
          usersRes.json(),
          contestsRes.json(),
          quizzesRes.json(),
          recruitmentsRes.json(),
          unverifiedRes.json(),
        ]);

        setStats({
          users: Array.isArray(usersData.users) ? usersData.users.length : 0,
          contests: Array.isArray(contestsData.data) ? contestsData.data.length : 0,
          quizzes: Array.isArray(quizzesData.quizzes) ? quizzesData.quizzes.length : 0,
          recruitmentDrives: Array.isArray(recruitmentsData) ? recruitmentsData.length : 0,
          unverifiedUsers: Array.isArray(unverifiedUsersData.unverifiedUsers)
            ? unverifiedUsersData.unverifiedUsers.length
            : 0,
          companies: new Set(recruitmentsData.map((r: { company_id: string }) => r.company_id)).size,
        });

        setUnverifiedUserAlert(unverifiedUsersData.unverifiedUsers || []);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const data = {
    labels: ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    datasets: [
      {
        label: "Application Sent",
        data: [30, 50, 40, 60, 70, 80, 90],
        borderColor: "green",
        backgroundColor: "rgba(0, 255, 0, 0.2)",
        tension: 0.4,
      },
      {
        label: "Interviews",
        data: [20, 40, 35, 50, 65, 75, 85],
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.2)",
        tension: 0.4,
      },
      {
        label: "Rejected",
        data: [15, 25, 20, 30, 40, 50, 60],
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "white",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "white",
        },
      },
      y: {
        ticks: {
          color: "white",
        },
      },
    },
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-4">
        <div className="text-center py-4 text-lg font-bold">MLVTEC</div>
        <ul className="space-y-4">
          <li className="text-orange-400 cursor-pointer" onClick={() => (window.location.href = "/community/dashboard")}>Dashboard</li>
          <li className="cursor-pointer" onClick={() => (window.location.href = "/community/leaderboard")}>Leaderboard</li>
          <li className="cursor-pointer" onClick={() => (window.location.href = "/community/contest")}>Contests</li>
          <li className="cursor-pointer" onClick={() => (window.location.href = "/community/quizzes")}>Quizzes</li>
          <li className="cursor-pointer" onClick={() => (window.location.href = "/community/marketplace")}>Marketplace</li>
          <li className="cursor-pointer" onClick={() => (window.location.href = "/community/wallet")}>Wallet</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex space-x-4 items-center">
            <input
              type="text"
              placeholder="Search"
              className="bg-gray-700 p-2 rounded text-white focus:outline-none"
            />
            <button className="bg-orange-500 px-4 py-2 rounded">+ Add</button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <StatCard value={stats.users} label="Total Users" />
          <StatCard value={stats.unverifiedUsers} label="Unverified Users" />
          <StatCard value={stats.companies} label="Companies" />
          <StatCard value={stats.recruitmentDrives} label="Recruitment Drives" />
          <StatCard value={stats.contests} label="Contests" />
          <StatCard value={stats.quizzes} label="Quizzes" />
        </div>

        {/* Chart */}
        <div className="bg-gray-800 p-6 rounded shadow mb-6" style={{ height: "300px" }}>
          <h2 className="text-xl font-bold mb-4">Vacancy Stats</h2>
          <div style={{ height: "250px", width: "100%" }}>
            <Line data={data} options={options} />
          </div>
        </div>

        {/* Alert */}
        {unverifiedUserAlert.length > 0 && (
          <div
            className="bg-gray-800 text-white p-4 rounded shadow mb-4 cursor-pointer"
            onClick={() => (window.location.href = "/community/verification")}
          >
            <h3 className="font-bold">Unverified Users:</h3>
            <ul>
              {unverifiedUserAlert.map((user) => (
                <li key={user._id}>
                  {user.name} (Year: {user.collegeYear})
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};

export default CompanyDashboard;
