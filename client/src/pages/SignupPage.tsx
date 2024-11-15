import axios, { AxiosError } from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../App";
import Loading from "../components/Loading";
import CustomNavbar from "../components/CustomNavbar";
import BackPage from "../components/BackPage";

interface DataProps {
    token: string;
    setTokenFunction: (string: string) => void;
    id: string;
    setIdFunction: (string: string) => void;
}

const SignupPage = ({ Data }: { Data: DataProps }) => {
    const [username, setUsername] = useState("");
    const [role, setRole] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleSignUp = async () => {
        setIsLoading(true);

        if (password !== confirmPassword) {
            setMessage("Password and confirm password do not match. Please ensure both fields match.");
            setIsLoading(false);
            return;
        }

        try {
            const { data } = await axios.post(`${API_URL}/api/accounts/signup`, {
                username,
                email,
                password,
                role,
            });

            Data.setTokenFunction(data.token);
            Data.setIdFunction(data.id);
            document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60};`;

            // Uncomment the navigation based on the role
            // if (role === "participant") navigate("/problemset");
            // else if (role === "admin") navigate("/admin");
        } catch (e) {
            setIsLoading(false);
            const error = e as AxiosError<{ success: boolean; message: string }>;
            setMessage(error.response?.data?.message || "An error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const CustomNavData = {
        items: [
            { text: "Student SignUp", link_path: "/signup" },
            { text: "Institution SignUp", link_path: "/institute" }
        ],
    };

    return (
        <>
            <head>
                <title>Sign Up | PolyCode Arena</title>
                <meta
                    name="description"
                    content="Join PolyCode Arena by creating an account. Sign up as a student or institution and start your journey."
                />
                <meta
                    name="keywords"
                    content="PolyCode, Sign Up, student registration, institution registration, coding arena"
                />
                <meta name="robots" content="index, follow" />
            </head>

            <Link to={"/"}>
                <div>
                    <BackPage />
                </div>
                <div
                    id="logo-cont"
                    className="inline-block relative text-[24px] left-1/2 -translate-x-1/2 font-bold italic mx-auto mt-[12px]"
                >
                    <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-orange-600 px-[1px]">
                        PolyCode
                    </span>
                    <span>Arena</span>
                </div>
            </Link>

            <div className="min-h-fit w-[300px] mx-auto text-[14px]">
                <div className="relative bg-black shadow-md rounded px-2 pt-6 pb-8 mb-4">
                    <h2 className="text-[34px] font-bold mb-[30px] text-center mt-[60px]">Sign Up</h2>

                    <div className="text-10px font-semibold whitespace-nowrap mb-4">
                        <CustomNavbar data={CustomNavData} />
                    </div>

                    <div className="mb-4">
                        <input
                            className="appearance-none border w-full py-2 px-3 placeholder:text-text_2 focus:placeholder:text-orange-500 bg-black rounded border-borders leading-tight focus:outline-none focus:border-orange-500"
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            aria-label="Username"
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            className="appearance-none border w-full py-2 px-3 placeholder:text-text_2 focus:placeholder:text-orange-500 bg-black rounded border-borders leading-tight focus:outline-none focus:border-orange-500"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            aria-label="Email"
                        />
                    </div>
                    {/* Uncomment for role selection */}
                    {/* <div className="mb-4 relative">
                        <select
                            className="appearance-none border w-full py-2 px-3 placeholder:text-text_2 focus:placeholder:text-orange-500 bg-black rounded border-borders leading-tight focus:outline-none focus:border-orange-500"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                            aria-label="Role"
                        >
                            <option value="" disabled>Select Role</option>
                            <option value="admin">Admin</option>
                            <option value="participant">Participant</option>
                        </select>
                    </div> */}

                    <div className="mb-4">
                        <input
                            className="appearance-none border w-full py-2 px-3 placeholder:text-text_2 focus:placeholder:text-orange-500 bg-black rounded border-borders leading-tight focus:outline-none focus:border-orange-500"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            aria-label="Password"
                        />
                    </div>
                    <div className="mb-6">
                        <input
                            className="appearance-none border w-full py-2 px-3 placeholder:text-text_2 focus:placeholder:text-orange-500 bg-black rounded border-borders leading-tight focus:outline-none focus:border-orange-500"
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            aria-label="Confirm Password"
                        />
                    </div>

                    <button
                        className="bg-orange-500 hover:bg-red-600 text-black font-bold py-[6px] px-4 rounded focus:outline-none focus:shadow-outline w-full transition"
                        type="button"
                        onClick={handleSignUp}
                        aria-label="Create Account"
                    >
                        {isLoading ? <Loading /> : "Create Account"}
                    </button>

                    <div className="flex items-center justify-between mt-[20px]">
                        <span className="text-text_2">Already have an account?</span>
                        <Link to="/login" className="text-orange-500 hover:text-red-600">Login</Link>
                    </div>

                    <div className="text-center mt-[20px] text-red-600 w-full overflow-hidden">
                        {message}
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignupPage;
