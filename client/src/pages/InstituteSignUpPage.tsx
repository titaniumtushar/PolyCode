
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../App";
import Loading from "../components/Loading";
import CustomNavbar from "../components/CustomNavbar";
import BackPage from "../components/BackPage";






const InstituteSignUpPage = ({
    Data,
}: {
    Data: {
        token: string;
        setTokenFunction: (token: string) => void;
        id: string;
        setIdFunction: (id: string) => void;
    };
}) => {


    const [username, setUsername] = useState("");
    const [role, setRole] = useState("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setisLoading] = useState<boolean>(false);
    const navigate = useNavigate();




    const handleSignUp = () => {
        setisLoading(true);

        try {
            if (password !== confirmPassword) {
                setMessage(
                    "Password and confirm password do not match. Please make sure you enter the same password in both fields."
                );
                return;
            }
            axios
                .post(`${API_URL}/api/accounts/signup`, {
                    username: username,
                    email: email,
                    password: password,
                    role: role,
                })
                .then(({ data }) => {
                    console.log(data);

                    Data.setTokenFunction(data.token);
                    Data.setIdFunction(data.id);
                    document.cookie = `token=${data.token}; path=/; max-age=${
                        7 * 24 * 60 * 60
                    };`;
                    if (role === "participant") {
                        navigate("/problemset"); // Navigate to problemset for participants
                    } else if (role === "admin") {
                        navigate("/admin"); // Navigate to admin page for admins
                    }
                })
                .catch((e: AxiosError) => {
                    setisLoading(false);
                    setMessage(
                        (
                            e.response?.data as {
                                success: boolean;
                                message: string;
                            }
                        ).message
                    );
                });
        } catch (error) {
            console.error("Sign-up failed:", error);
        }
    };

    const CustomNavData : Navbar = {
        items: [
            { text: "Student SignUp", link_path: "/signup" },
            { text: "Institution SignUp", link_path: "/institute" }
        ],
    }
    

return (
    <>
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
                <h2 className="text-[34px] font-bold mb-[30px] text-center mt-[60px]">
                    Sign Up
                </h2>

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
                        required={true}
                    />
                </div>
                <div className="mb-4">
                    <input
                        className="appearance-none border w-full py-2 px-3 placeholder:text-text_2 focus:placeholder:text-orange-500 bg-black rounded border-borders leading-tight focus:outline-none focus:border-orange-500"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required={true}
                    />
                </div>
                {/* <div className="mb-4 relative">
                    <select
                        className="appearance-none border w-full py-2 px-3 placeholder:text-text_2 focus:placeholder:text-orange-500 bg-black rounded border-borders leading-tight focus:outline-none focus:border-orange-500"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required={true}
                    >
                        <option value="" disabled>
                            Select Role
                        </option>
                        <option value="admin">Admin</option>
                        <option value="participant">Participant</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg
                            className="fill-current h-4 w-4 text-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                        >
                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                    </div>
                </div> */}

                <div className="mb-4">
                    <input
                        className="appearance-none border w-full py-2 px-3 placeholder:text-text_2 focus:placeholder:text-orange-500 bg-black rounded border-borders leading-tight focus:outline-none focus:border-orange-500"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required={true}
                    />
                </div>
                <div className="mb-6">
                    <input
                        className="appearance-none border w-full py-2 px-3 placeholder:text-text_2 focus:placeholder:text-orange-500 bg-black rounded border-borders leading-tight focus:outline-none focus:border-orange-500"
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required={true}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className="bg-orange-500 hover:bg-red-600 text-black font-bold py-[6px] px-4 rounded focus:outline-none focus:shadow-outline w-full transition"
                        type="button"
                        onClick={handleSignUp}
                    >
                        {isLoading ? (
                            <div className="w-full block h-[21px]">
                                <div className="absolute left-1/2 -translate-x-1/2">
                                    <Loading />
                                </div>
                            </div>
                        ) : (
                            "Create Account"
                        )}
                    </button>
                </div>
                <div className="flex items-center justify-between mt-[20px]">
                    <span className="text-text_2">
                        Already have an account?{" "}
                    </span>
                    <Link
                        to="/login"
                        className="text-orange-500 hover:text-red-600"
                    >
                        Login
                    </Link>
                </div>
                <div className="text-center mt-[20px] text-red-600 w-full overflow-hidden">
                    {message}
                </div>
            </div>
        </div>
    </>
);
};


export default InstituteSignUpPage;