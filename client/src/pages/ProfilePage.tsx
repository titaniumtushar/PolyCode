import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import MainHeading from "../components/MainHeading";
import { API_URL } from "../App";
import SkillTags from './SkillTagsPage';


const ProfilePage = ({
    token,
    id,
}: {
    token: string | null;
    id: string | null;
}) => {
    const [username, setUsername] = useState<string>("");
    const [verified, setVerified] = useState<boolean>(false);
    const [user, setUser] = useState<PublicUser>();
    const [verifiedCertain, setVerifiedCertain] = useState<boolean>(false);
    const [skills, setSkills] = useState<string[]>([]);
    const { name } = useParams();
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [eAll, setEAll] = useState<number>();
    const [mAll, setMAll] = useState<number>();
    const [hAll, setHALL] = useState<number>();

    const [eSolved, setESolved] = useState<number>();
    const [mSolved, setMSolved] = useState<number>();
    const [hSolved, setHSolved] = useState<number>();

    const [inviteCode, setInviteCode] = useState<string>("");

    // New state for "Items Bought" section
    const [itemsBought, setItemsBought] = useState<any[]>([]);
    const [selectedItem, setSelectedItem] = useState<number | null>(null);
    const navigate = useNavigate();


    useEffect(() => {
        axios
            .get(`${API_URL}/api/accounts/id/${id}`, {
                headers: {
                    Authorization: token,
                },
            })
            .then(({ data }) => {
                setUsername(data.username);
                setVerified(true);
                setVerifiedCertain(true);
            })
            .catch((e: AxiosError) => {
                console.log(e);
                setVerified(false);
                setVerifiedCertain(true);
            });
        axios
            .get<{}, { data: PublicUser }>(`${API_URL}/api/accounts/${name}`)
            .then(({ data }) => {
                setUsername(data.username);
                setUser(data);
                setEAll(data.easy_problems_count);
                setMAll(data.medium_problems_count);
                setHALL(data.hard_problems_count);
                setESolved(data.problems_solved_easy);
                setMSolved(data.problems_solved_medium);
                setHSolved(data.problems_solved_hard);
            })
            .catch((e: AxiosError) => {
                console.log(e);
            });

        // Fetch "Items Bought" (example endpoint)
        axios
            .get(`${API_URL}/api/accounts/${id}/items-bought`, {
                headers: {
                    Authorization: token,
                },
            })
            .then(({ data }) => setItemsBought(data))
            .catch((e: AxiosError) => console.log(e));
    },);
    useEffect(() => {
        // Simulate fetching skills with mock data if the backend is unavailable
        const mockSkills = ["JavaScript", "React", "CSS", "TypeScript", "HTML", "mmm", "af", "kjanlkjdbsnfjbaksdjbkcaijsbdkfcandsjcnal", "jahGSDYUcvjashyckazUDHBkzudchbk", "kjiasdhcikajsbcxkihvkzdfvcxvzdxv"]; // Mock skill tags
        setSkills(mockSkills); // Set the mock data to skills state
      }, []);

    const handleInviteSubmit = () => {
        console.log("Invite Code Submitted: ", inviteCode);
        // Add your API logic to submit the invite code
    };

    const handleResumeUpload = () => {
        navigate("/resumeupload");
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
            {verifiedCertain && verified ? (
                <MainHeading
                    data={{
                        username: username,
                        status: "loggedin",
                        items: [{ text: "Problem List", link_path: "/problemset" }],
                    }}
                />
            ) : verifiedCertain === true && verified === false ? (
                <MainHeading data={{ status: "not-loggedin" }} />
            ) : (
                <MainHeading data={{ status: "none" }} />
            )}
            {user != null ? (
                <>

                <div>
                    <SkillTags skills={skills}/>
                </div>

                        
                    {/* Existing User Profile Section */}
                    <div className="w-[calc(100%-72px)] h-[260px] sm:h-[160px] bg-black mx-auto mt-[8px] rounded-lg border border-borders">
                        <div id="main" className="flex flex-col sm:flex-row h-fit">
                            <div id="porfile-pic">
                                <div className="w-[90px] h-[90px] mt-[35px] border border-borders sm:ml-[50px] mx-auto rounded-full"></div>
                            </div>
                            <div className="flex flex-col w-[280px] text-center sm:text-left mx-auto sm:ml-0">
                                <div
                                    id="username"
                                    className="text-[28px] font-bold mt-[20px] sm:mt-[40px] text-white sm:ml-[30px] ml-0"
                                >
                                    {user.username}
                                </div>
                                <div
                                    id="username"
                                    className="text-[18px] mt-[6px] text-text_2 sm:ml-[30px] ml-0"
                                >
                                    Rank: {user.rank}
                                </div>
                            </div>

                        <div className="flex flex-col items-center mt-10">
                       
                        {/* <button
                            className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition-all"
                            onClick={handleResumeUpload}
                        >
                            Upload Resume
                        </button> */}
                        {/* {uploadMessage && <p className="text-white mt-2">{uploadMessage}</p>} */}
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
                            
                            <div className="right-[45px] justify centre mt-[10px] flex flex-col relative ml-[8px] font-bold inline-block  rounded-md text-black text-[18px]">
                            <button
                            className="py-2 px-6 mt-[50px] mb-[50px] rounded-lg bg-white text-black py-[6px] px-[16px] rounded-[6px] border border-black hover:bg-[#00000000] hover:border-[#00000000] hover:text-black transition active:bg-red-700 hover:bg-gradient-to-r from-orange-500 to-purple-600"
                            onClick={handleResumeUpload}>
                            Upload Resume
                            </button>
                            </div>
                                

                        </div>
                    </div>

                    {/* Existing Community Stats and Solved Problems Section */}
                    <div className="flex lg:flex-row sm:flex-col flex-col w-[calc(100%-72px)] mx-auto justify-between">
                        <div className="lg:w-[calc(40%-4px)] sm:w-full h-[240px] bg-black mt-[8px] rounded-lg border border-borders">
                            <div className="text-[22px] font-bold mt-[40px] text-white ml-[50px]">
                                Community Stats
                            </div>
                            <div className="mt-[18px] text-[14px] ml-[50px]">
                                <span className="text-text_2">Views:</span> {user.views}
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
                                        Solved Problems
                                    </div>
                                    <div className="text-[72px] font-bold mt-[32px] text-white ml-[50px]">
                                        {user.problems_solved_count}{" "}
                                        <span className="text-text_2 text-[14px]">
                                            {"/ "}
                                            {user.easy_problems_count + user.medium_problems_count + user.hard_problems_count}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col relative mr-[50px] mt-[40px] w-[200px] sm:w-[280px] ml-[50px] sm:ml-0">
                                    <div className="text-[14px] relative">
                                        <div className="flex flex-row justify-between">
                                            <div className="mb-[8px] text-green-500">Easy</div>
                                            <div className="mb-[8px] text-green-500">
                                                {eSolved}
                                                {" / "}
                                                {eAll}
                                            </div>
                                        </div>
                                        <div className="sm:w-[280px] w-[200px] h-[8px] bg-borders mb-[16px] relative after:absolute easy-line after:h-[8px] after:rounded rounded after:bg-green-500"></div>
                                    </div>
                                    <div className="text-[14px] relative">
                                        <div className="flex flex-row justify-between">
                                            <div className="mb-[8px] text-orange-500">Medium</div>
                                            <div className="mb-[8px] text-orange-500">
                                                {mSolved}
                                                {" / "}
                                                {mAll}
                                            </div>
                                        </div>
                                        <div className="sm:w-[280px] w-[200px] h-[8px] bg-borders mb-[16px] relative after:absolute medium-line after:h-[8px] after:rounded rounded after:bg-orange-500"></div>
                                    </div>
                                    <div className="text-[14px] relative">
                                        <div className="flex flex-row justify-between">
                                            <div className="mb-[8px] text-red-500">Hard</div>
                                            <div className="mb-[8px] text-red-500">
                                                {hSolved}
                                                {" / "}
                                                {hAll}
                                            </div>
                                        </div>
                                        <div className="sm:w-[280px] w-[200px] h-[8px] bg-borders mb-[16px] relative after:absolute hard-line after:h-[8px] after:rounded rounded after:bg-red-500"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Existing Invite Code Section */}
                    <div className="flex flex-col items-center mt-10">
                        <textarea
                            className="w-1/2 p-3 border border-borders bg-black text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
                            placeholder="Enter Invite Code"
                            value={inviteCode}
                            onChange={(e) => setInviteCode(e.target.value)}
                        />
                        <button
                            className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition-all"
                            onClick={handleInviteSubmit}
                        >
                            Join Contest
                        </button>
                    </div>

                    {/* New Items Bought Section */}
                    <div className="container mx-auto mt-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Items Bought</h2>
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
                                            <div className="bg-gray-900 p-4 rounded-lg mt-2 text-sm text-white">
                                                <p><strong>Amount Paid:</strong> {item.amount}</p>
                                                <p><strong>Date:</strong> {item.date}</p>
                                                {item.image && (
                                                    <p>
                                                        <strong>Image/PDF:</strong>{" "}
                                                        <a
                                                            href={item.image}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-500"
                                                        >
                                                            View
                                                        </a>
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-white">No items bought yet.</p>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <></>
            )}
        </div>
    );
};

export default ProfilePage;
