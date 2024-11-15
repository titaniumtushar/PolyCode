import { useState, useEffect } from "react";
import CustomNavbar from "../components/CustomNavbar";
import MainHeading from "../components/MainHeading";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../App";

const ProblemSet = ({
    token,
    id,
}: {
    token: string | null;
    id: string | null;
}) => {
    const [username, setUsername] = useState<string>("");
    const [verified, setVerified] = useState<boolean>(false);
    const [problemStatements, setProblemStatements] = useState<string[]>(["one","two"]);
    const navigate = useNavigate();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);


    const customNavData: Navbar = {
        items: [
            { text: "Problem Statements", link_path: "/problemset" },
            { text: "Leaderboard", link_path: "/problemset" },
            
        ],
    };

    

    return (
        <>
            

            {/* Problems List */}
            <div className="h-[calc(100vh-60px)] overflow-hidden bg-black">
                <div
                    id="cont"
                    className="relative flex flex-row h-[calc(100vh-60px)] w-full mt-[8px] "
                >
                    <div
                        id="problem-statements"
                        className="h-[calc(100%-16px)] bg-black border border-borders ml-[8px] rounded-lg w-[calc(100%-16px)] overflow-hidden"
                    >
                        <div className="w-full bg-black border-b border-borders">
                            <div className="ml-[9px]">
                                <CustomNavbar data={customNavData} />
                            </div>
                        </div>
                        <div className="p-4">
                            {/* Render problem statements */}
                            <h2 className="text-white text-lg mb-4">
                                Problem Statements
                            </h2>
                            <ul className="list-disc list-inside text-white">
                                {problemStatements.length > 0 ? (
                                   problemStatements.map((statement, index) => (
                    <li
                        key={index}
                        className={`p-4 bg-gray-800 text-white rounded-lg shadow-md cursor-pointer transform transition-all duration-300 hover:scale-105 hover:bg-indigo-600 ${
                            hoveredIndex === index ? "shadow-lg" : ""
                        }`}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        {statement}
                    </li>
                ))
                                ) : (
                                    <p>No problem statements available.</p>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProblemSet;
