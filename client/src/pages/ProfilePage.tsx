import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainHeading from "../components/MainHeading";
import { useNavigate } from "react-router-dom";
import SkillTags from "./SkillTagsPage";

const ProfilePage = () => {
    const [username, setUsername] = useState<string>("JohnDoe");
    const [verified, setVerified] = useState<boolean>(true);
    const [skills, setSkills] = useState<string[]>([]);
    const [user, setUser] = useState<any>({
        username: "JohnDoe",
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
    const [certificates, setCertificates] = useState<any[]>([]); // New state to hold certificates
    const [verifiedCertain, setVerifiedCertain] = useState<boolean>(true);

    const [eAll, setEAll] = useState<number>(100);
    const [mAll, setMAll] = useState<number>(50);
    const [hAll, setHALL] = useState<number>(30);

    const [eSolved, setESolved] = useState<number>(45);
    const [mSolved, setMSolved] = useState<number>(30);
    const [hSolved, setHSolved] = useState<number>(20);

    const [inviteCode, setInviteCode] = useState<string>("");

    const navigate = useNavigate();

    // Mock data for "Items Bought"
    const [itemsBought, setItemsBought] = useState<any[]>([
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

    const { name } = useParams();
    // Function to handle skill removal
    const handleRemoveSkill = (skill: string) => {
        setSkills((prevSkills) => prevSkills.filter((s) => s !== skill));
    };

    // Function to handle adding a new skill
    const handleAddSkill = (skill: string) => {
        setSkills((prevSkills) => [...prevSkills, skill]);
    };


    useEffect(() => {
        // Simulate fetching skills with mock data if the backend is unavailable
        const mockSkills = ["JavaScript", "CSS", "TypeScript", "HTML", "mmm", "af", "kjanlkjdbsnfjbaksdjbkcaijsbdkfcandsjcnal", "jahGSDYUcvjashyckazUDHBkzudchbk", "kjiasdhcikajsbcxkihvkzdfvcxvzdxv"];
        setSkills(mockSkills); // Set the mock data to skills state

        // Simulate fetching certificates from backend
        const mockCertificates = [
            { title: "React Certification", date: "2024-11-20", issuer: "XYZ Academy", link: "https://example.com/certificate1.pdf" },
            { title: "JavaScript Mastery", date: "2024-10-15", issuer: "ABC Institute", link: "https://example.com/certificate2.pdf" },
            { title: "JavaScript Mastery", date: "2024-10-15", issuer: "ABC Institute", link: "https://example.com/certificate2.pdf" },
            { title: "JavaScript Mastery", date: "2024-10-15", issuer: "ABC Institute", link: "https://example.com/certificate2.pdf" },
            { title: "JavaScript Mastery", date: "2024-10-15", issuer: "ABC Institute", link: "https://example.com/certificate2.pdf" },
            { title: "JavaScript Mastery", date: "2024-10-15", issuer: "ABC Institute", link: "https://example.com/certificate2.pdf" },
            { title: "JavaScript Mastery", date: "2024-10-15", issuer: "ABC Institute", link: "https://example.com/certificate2.pdf" },
            { title: "JavaScript Mastery", date: "2024-10-15", issuer: "ABC Institute", link: "https://example.com/certificate2.pdf" },
            { title: "JavaScript Mastery", date: "2024-10-15", issuer: "ABC Institute", link: "https://example.com/certificate2.pdf" },
        ];
        setCertificates(mockCertificates); // Set the mock data to certificates state

    }, []);
    // State to toggle showing all certificates
    const [showAll, setShowAll] = useState(false);

    // Function to toggle the "See More" button
    const handleSeeMore = () => {
        setShowAll(!showAll);
    };

    const handleInviteSubmit = () => {
        console.log("Invite Code Submitted: ", inviteCode);
        // Add your API logic to submit the invite code
    };
    const handleResumeUpload = () => {
        navigate("/user/resumeupload");
    };

    // Toggle selected item for display
    const toggleItem = (index: number) => {
        if (selectedItem === index) {
            setSelectedItem(null); // Collapse if already selected
        } else {
            setSelectedItem(index); // Expand the clicked item
        }
    };

    return (
        <div>
        <>
            <div>
                <SkillTags skills={skills} onRemoveSkill={handleRemoveSkill} onAddSkill={handleAddSkill}/>
            </div>
            {/* User Profile Section */}
            <div className="w-[calc(100%-72px)] h-[260px] sm:h-[160px] bg-black mx-auto mt-[8px] rounded-lg border border-borders">
                <div id="main" className="flex flex-col sm:flex-row h-fit">
                    <div id="porfile-pic">
                        <div className="w-[80px] h-[80px] mt-[40px] border border-borders sm:ml-[50px] mx-auto rounded-lg"></div>
                    </div>
                    <div className="flex flex-col w-[280px] text-center sm:text-left mx-auto sm:ml-0">
                        <div id="username" className="text-[28px] font-bold mt-[20px] sm:mt-[40px] text-white sm:ml-[30px] ml-0">
                            {user.username}
                        </div>
                        <div id="username" className="text-[18px] mt-[6px] text-text_2 sm:ml-[30px] ml-0">
                            Rank: {user.rank}
                        </div>
                    </div>
                    <div className="md:flex hidden flex-row absolute right-[550px] md:right-[300px]">
                        <div className="w-[80px] h-[80px] mt-[40px] border border-borders ml-[20px] rounded-lg relative">
                            <i className="bi bi-x-lg text-borders absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"></i>
                        </div>
                        <div className="w-[80px] h-[80px] mt-[40px] border border-borders ml-[20px] rounded-lg relative">
                            <i className="bi bi-x-lg text-borders absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"></i>
                        </div>
                        <div className="w-[80px] h-[80px] mt-[40px] border border-borders ml-[20px] rounded-lg relative">
                            <i className="bi bi-x-lg text-borders absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"></i>
                        </div>
                    </div>
                    <div className="right-[45px] justify centre mt-[10px] flex flex-col relative ml-[8px] font-bold inline-block rounded-md text-black text-[18px]">
                        <button
                            className="py-2 px-6 mt-[50px] mb-[50px] rounded-lg bg-white text-black py-[6px] px-[16px] rounded-[6px] border border-black hover:bg-[#00000000] hover:border-[#00000000] hover:text-black transition active:bg-red-700 hover:bg-gradient-to-r from-orange-500 to-purple-600"
                            onClick={handleResumeUpload}
                        >
                            Upload Resume
                        </button>
                    </div>
                </div>
            </div>
    
            {/* Community Stats and Solved Problems Section */}
            <div className="flex lg:flex-row sm:flex-col flex-col w-[calc(100%-72px)] mx-auto justify-between">
                <div className="lg:w-[calc(40%-4px)] sm:w-full h-[240px] bg-black mt-[8px] rounded-lg border border-borders">
                    <div className="text-[22px] font-bold mt-[40px] text-white ml-[50px]">Community Stats</div>
                    <div className="mt-[18px] text-[14px] ml-[50px]">
                        <span className="text-text_2">Credits</span> {user.views}
                    </div>
                    <div className="mt-[18px] text-[14px] ml-[50px]">
                        <span className="text-text_2">Solutions:</span> {user.solution_count}
                    </div>
                    <div className="mt-[18px] text-[14px] ml-[50px] mb-[40px]">
                        <span className="text-text_2">Reputation:</span> {user.reputation_count}
                    </div>
                </div>
                <div className="lg:w-[calc(60%-4px)] sm:w-full sm:h-[240px] h-[450px] bg-black mt-[8px] rounded-lg border border-borders relative">
                    <div className="flex sm:flex-row flex-col justify-between">
                        <div>
                            <div className="text-[22px] font-bold mt-[40px] text-white ml-[50px]">
                                Solved Contests
                            </div>
                            <div className="text-[72px] font-bold mt-[32px] text-white ml-[50px]">
                                {user.problems_solved_count}{" "}
                                <span className="text-text_2 text-[14px]">
                                    {"/ "}{user.easy_problems_count + user.medium_problems_count + user.hard_problems_count}
                                </span>
                            </div>
                        </div>
                        {/* <div className="flex flex-col relative mr-[50px] mt-[40px] w-[200px] sm:w-[280px] ml-[50px] sm:ml-0">
                            <div className="text-[14px] relative">
                                <div className="flex flex-row justify-between">
                                    <div className="mb-[8px] text-green-500">Easy</div>
                                    <div className="mb-[8px] text-green-500">{eSolved} / {eAll}</div>
                                </div>
                                <div className="sm:w-[280px] w-[200px] h-[8px] bg-borders mb-[16px] relative after:absolute easy-line after:h-[8px] after:rounded rounded after:bg-green-500"></div>
                            </div>
                            <div className="text-[14px] relative">
                                <div className="flex flex-row justify-between">
                                    <div className="mb-[8px] text-orange-500">Medium</div>
                                    <div className="mb-[8px] text-orange-500">{mSolved} / {mAll}</div>
                                </div>
                                <div className="sm:w-[280px] w-[200px] h-[8px] bg-borders mb-[16px] relative after:absolute medium-line after:h-[8px] after:rounded rounded after:bg-orange-500"></div>
                            </div>
                            <div className="text-[14px] relative">
                                <div className="flex flex-row justify-between">
                                    <div className="mb-[8px] text-red-500">Hard</div>
                                    <div className="mb-[8px] text-red-500">{hSolved} / {hAll}</div>
                                </div>
                                <div className="sm:w-[280px] w-[200px] h-[8px] bg-borders mb-[16px] relative after:absolute hard-line after:h-[8px] after:rounded rounded after:bg-red-500"></div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
    
            {/* Certificates Section with Responsive Layout and See More Button */}
<div className="w-[calc(100%-72px)] mx-auto mt-8">
    <div className="h-[auto] bg-black rounded-lg border border-borders">
        <div className="text-[22px] font-bold mt-[40px] text-white ml-[50px]">Certificates</div>
        <div className="grid grid-cols-4 gap-6 px-6 py-4 sm:grid-cols-2 xs:grid-cols-1">
            {/* Sample Certificates - Dynamically Rendered */}
            {certificates.slice(0, showAll ? certificates.length : 6).map((certificate, index) => (
                <div key={index} className="w-full h-[200px] sm:h-[180px] xs:h-[150px] border border-borders rounded-lg p-2">
                    <img
                        src={certificate.imageUrl}
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
        <h2 className="text-2xl font-bold text-white mb-4 px-6 py-4">Items Bought</h2>
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
                                    <strong>Amount:</strong> {item.amount}
                                </p>
                                <p>
                                    <strong>Date:</strong> {item.date}
                                </p>
                                <p>
                                    <strong>Invoice:</strong>{" "}
                                    <a href={item.image} target="_blank" rel="noopener noreferrer">
                                        View PDF
                                    </a>
                                </p>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p className="text-gray-400">No items bought yet.</p>
            )}
        </div>
    </div>
</div>

        </>
    </div>
    
    );
};

export default ProfilePage;
