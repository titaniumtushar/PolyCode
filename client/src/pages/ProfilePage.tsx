import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SkillTags from "./SkillTagsPage";
import axios from "axios";
import { API_URL } from "../App";

// Define types for itemsBought
interface Item {
    name: string;
    amount: string;
    date: string;
    image: string;
}

const ProfilePage = () => {
    const [username, setUsername] = useState<string>("JohnDoe");
    const [verified, setVerified] = useState<boolean>(true);
    const [skills, setSkills] = useState<string[]>([]);
    const [user, setUser] = useState<any>({
        name: username,
        rank: "Beginner",
        views: 1200,
        solution_count: 25,
        reputation_count: 350,
        problems_solved_count: 50,
        easy_problems_count: 100,
        medium_problems_count: 50,
        hard_problems_count: 30,
        problems_solved_easy: 45,
        problems_solved_medium: 30,
        problems_solved_hard: 20,
    });
    const [certificates, setCertificates] = useState<string[]>([]);
    const [profilePic, setProfilePic] = useState<string>("");
    const [resumeUrl, setResumeUrl] = useState<string>("");
    const [tag, setTag] = useState<string>("");

    const { name } = useParams();
    const [itemsBought, setItemsBought] = useState<Item[]>([
        {
            name: "Premium Membership",
            amount: "$50",
            date: "2024-12-05",
            image: "https://example.com/item1.pdf",
        },
        {
            name: "Exclusive Contest Access",
            amount: "$20",
            date: "2024-11-20",
            image: "https://example.com/item2.pdf",
        },
    ]);
    const [selectedItem, setSelectedItem] = useState<number | null>(null);
    const [showAll, setShowAll] = useState<boolean>(false);

    // Fetch user assets from the API
    useEffect(() => {
        const fetchUserAssets = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${API_URL}/api/user/assets`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log(response.data);

                const data = response.data;

                // Set profile pic, resume, and certificates
                setProfilePic(data.profilePic);
                setResumeUrl(data.resumeUrl);
                setUsername(data.username);
                setTag(data.tag);

                // If certificates is a single URL string, put it into an array
                setCertificates([data.certificates]); // Wrap in array for consistency
            } catch (error) {
                console.error("Error fetching user assets:", error);
            }
        };

        fetchUserAssets();
    }, []);

    const handleResumeDownload = () => {
        window.open(resumeUrl, "_blank");
    };

    const handleSeeMore = () => {
        setShowAll(!showAll);
    };

    const toggleItem = (index: number) => {
        if (selectedItem === index) {
            setSelectedItem(null);
        } else {
            setSelectedItem(index);
        }
    };

    function handleRemoveSkill(skill: string): void {
        // Placeholder implementation
    }

    function handleAddSkill(skill: string): void {
        // Placeholder implementation
    }

    return (
        <div>
            <>
                <div>
                    <SkillTags
                        skills={skills}
                        onRemoveSkill={handleRemoveSkill}
                        onAddSkill={handleAddSkill}
                    />
                </div>

                {/* User Profile Section */}
                <div className="w-[calc(100%-72px)] h-[260px] sm:h-[160px] bg-black mx-auto mt-[8px] rounded-lg border border-borders">
                    <div id="main" className="flex flex-col sm:flex-row h-fit">
                        <div id="profile-pic">
                            <div className="w-[80px] h-[80px] mt-[40px] border border-borders sm:ml-[50px] mx-auto rounded-lg">
                                <img
                                    src={profilePic}
                                    alt="Profile Pic"
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col w-[280px] text-center sm:text-left mx-auto sm:ml-0">
                            <div
                                id="username"
                                className="text-[28px] font-bold mt-[20px] sm:mt-[40px] text-white sm:ml-[30px] ml-0"
                            >
                                {username}
                            </div>
                            <div
                                id="rank"
                                className="text-[18px] mt-[6px] text-text_2 sm:ml-[30px] ml-0"
                            >
                                Tag : {tag}
                            </div>
                        </div>
                        <div className="right-[45px] justify-centre mt-[10px] flex flex-col relative ml-[8px] font-bold inline-block rounded-md text-black text-[18px]">
                            <button
                                className="py-2 px-6 mt-[50px] mb-[50px] rounded-lg bg-white text-black py-[6px] px-[16px] rounded-[6px] border border-black hover:bg-[#00000000] hover:border-[#00000000] hover:text-black transition active:bg-red-700 hover:bg-gradient-to-r from-orange-500 to-purple-600"
                                onClick={handleResumeDownload}
                            >
                                Download Resume
                            </button>
                        </div>
                    </div>
                </div>

                {/* Certificates Section */}
                <div className="w-[calc(100%-72px)] mx-auto mt-8">
                    <div className="h-[auto] bg-black rounded-lg border border-borders">
                        <div className="text-[22px] font-bold mt-[40px] text-white ml-[50px]">
                            Certificates
                        </div>
                        <div className="grid grid-cols-4 gap-6 px-6 py-4 sm:grid-cols-2 xs:grid-cols-1">
                            {/* Map certificates from API */}
                            {certificates
                                .slice(0, showAll ? certificates.length : 6)
                                .map((certificate, index) => (
                                    <div
                                        key={index}
                                        className="w-full h-[200px] sm:h-[180px] xs:h-[150px] border border-borders rounded-lg p-2"
                                    >
                                        <img
                                            src={certificate}
                                            alt={`Certificate ${index + 1}`}
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    </div>
                                ))}
                        </div>

                        {/* See More Button */}
                        {certificates.length > 6 && !showAll && (
                            <div className="text-center mb-4">
                                <button
                                    onClick={handleSeeMore}
                                    className="text-white text-lg font-semibold py-2 px-4 border border-borders rounded-lg hover:bg-borders transition duration-300"
                                >
                                    See More
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Items Bought Section */}
                <div className="w-[calc(100%-72px)] mx-auto mt-8 mb-8">
                    <div className="bg-black rounded-lg border border-borders">
                        <h2 className="text-2xl font-bold text-white mb-4 px-6 py-4">
                            Items Bought
                        </h2>
                        <div className="bg-black p-6 rounded-lg border border-borders">
                            {itemsBought.length > 0 ? (
                                itemsBought.map((item, index) => (
                                    <div key={index} className="mb-4">
                                        <div
                                            className="text-white text-lg cursor-pointer"
                                            onClick={() => toggleItem(index)}
                                        >
                                            {item.name}
                                        </div>
                                        {selectedItem === index && (
                                            <div className="bg-gray-900 p-4 rounded-lg mt-2">
                                                <p>
                                                    <strong>Amount:</strong>{" "}
                                                    {item.amount}
                                                </p>
                                                <p>
                                                    <strong>Date:</strong>{" "}
                                                    {item.date}
                                                </p>
                                                <p>
                                                    <strong>Invoice:</strong>{" "}
                                                    <a
                                                        href={item.image}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        View PDF
                                                    </a>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400">
                                    No items bought yet.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </>
        </div>
    );
};

export default ProfilePage;
