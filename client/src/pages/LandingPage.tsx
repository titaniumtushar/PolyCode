import MainHeading from "../components/MainHeading";
import { TypeAnimation } from "react-type-animation";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { API_URL } from "../App";
import Loading from "../components/Loading";

const LandingPage = () => {
    const [username, setUsername] = useState<string>("");
    
    return (
        <div className="text-[14px] overflow-hidden h-screen">
            <MainHeading
                    data={{
                        username: username,
                        status: "not-loggedin",
                    }}
                />
            <div className="w-[100vw] overflow-hidden h-[calc(100vh-60px)] absolute">
    <div className="circle-1-gamified absolute top-[6%] left-[45%] -translate-x-1/2 w-[500px] h-[500px] rounded-full filter blur-[99px] bg-gradient-to-br from-transparent to-purple-800 opacity-70 z-10 animate-pulse-rotate"></div>
    <div className="absolute circle-2-gamified top-[8%] left-[40%] -translate-x-1/2 w-[550px] h-[550px] rounded-full filter blur-[99px] bg-gradient-to-br from-transparent to-yellow-500 opacity-70 z-10 animate-pulse-move"></div>
    <div className="absolute circle-3-gamified top-[12%] left-[38%] -translate-x-1/2 w-[450px] h-[400px] rounded-full filter blur-[99px] bg-gradient-to-br from-transparent to-purple-600 opacity-70 z-10 animate-pulse-rotate"></div>
    <div className="absolute circle-4-gamified top-[10%] left-[40%] -translate-x-1/2 w-[300px] h-[300px] rounded-full filter blur-[99px] bg-gradient-to-br from-transparent to-yellow-600 opacity-70 z-10 animate-pulse-move"></div>
    <div className="absolute circle-5-gamified top-[20%] left-[35%] -translate-x-1/2 w-[500px] h-[500px] rounded-full filter blur-[99px] bg-gradient-to-br from-transparent to-purple-900 opacity-70 z-10 animate-pulse-rotate"></div>
    <div className="absolute top-[18%] left-[50%] -translate-x-1/2 w-[700px] h-[600px] rounded-full filter blur-[99px] bg-gradient-to-br from-transparent to-yellow-800 opacity-70 z-10 animate-pulse-move"></div>
    <div className="absolute circle-7-gamified top-[5%] left-[35%] -translate-x-1/2 w-[400px] h-[400px] rounded-full filter blur-[99px] bg-gradient-to-br from-transparent to-purple-700 opacity-70 z-10 animate-pulse-move"></div>
</div>

            <h1 className="absolute text-[38px] md:text-[48px] mx-auto text-center font-bold mt-[100px] z-50 inset-0 top-[100px]">
                        <TypeAnimation
                            sequence={[
                                `Welcome back ${username}!`,
                                2000,
                                `Ready for more challenges, ${username}?`,
                                2000,
                                "Let's dive in!",
                            ]}
                            wrapper="span"
                            cursor={true}
                            style={{
                                fontSize: "1em",
                                display: "inline-block",
                            }}
                        />
                    </h1>
                    <p className="absolute md:w-1/2 w-3/4 text-center mx-auto mt-[50px] z-50 inset-0 md:top-[300px] top-[400px]">
                        Ready to conquer complex challenges? Explore our Problem
                        List now!
                    </p>
                    <div className="absolute md:top-[450px] top-[550px] left-1/2 -translate-x-1/2 z-50">
                        <Link
                            to="/problemset"
                            className="relative ml-[8px] font-bold inline-block bg-gradient-to-r from-orange-500 to-purple-600 rounded-md text-black text-[18px] hover:bg-purple-800"
                        >
                            <div className="w-full h-full bg-black text-white py-[6px] px-[16px] rounded-[6px] border border-black hover:bg-[#00000000] hover:border-[#00000000] hover:text-black transition active:bg-red-700">
                                Problem List
                            </div>
                        </Link>
                    </div>
        </div>
    );
};

export default LandingPage;
