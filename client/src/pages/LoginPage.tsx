import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

const LoginPage = () => {
    const [usernameOrEmail, setUsernameOrEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("U"); // Default role
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleLogin = async () => {
        setIsLoading(true);
        setMessage(""); // Clear previous messages

        if (!usernameOrEmail || !password) {
            setMessage("Please fill in all fields.");
            setIsLoading(false);
            return;
        }

        // Prepare payload for login request
        
        const payload = {
            email: usernameOrEmail,
            password: password,
            role: role,
        };

        try {
            // Simulate login request using POST
            let urlPoint ;
            role==="C"?urlPoint="community":urlPoint="user"
            console.log(`http://localhost:8080/api/${urlPoint}/login`);
            const res = await fetch(`http://localhost:8080/api/${urlPoint}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            // Check if the response is okay
            const data = await res.json();

            if (res.status === 200) {
                setMessage("Login successful! Redirecting...");
                localStorage.setItem("token", data.token);
                if(role==="C"){
                    navigate("/admin");

                }
                else{
                    navigate("/user/marketplace");

                }
                
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.error("Login failed:", error);
            setMessage("An error occurred. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Link to={"/"}>
                <div
                    id="logo-cont"
                    className="inline-block relative text-[24px] left-1/2 -translate-x-1/2 font-bold italic mx-auto mt-[12px]"
                >
                    <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 px-[1px]">
                        Fire
                    </span>
                    <span>Code</span>
                </div>
            </Link>
            <div className="min-h-fit w-[300px] mx-auto text-[14px]">
                <div className="relative bg-black shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h2 className="text-[34px] font-bold mb-[30px] text-center mt-[60px]">
                        Log In
                    </h2>
                    <div className="mb-4">
                        <input
                            className="appearance-none border w-full py-2 px-3 placeholder:text-text_2 focus:placeholder:text-orange-500 bg-black rounded border-borders leading-tight focus:outline-none focus:border-orange-500"
                            type="text"
                            placeholder="Username or Email"
                            value={usernameOrEmail}
                            onChange={(e) => setUsernameOrEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            className="appearance-none border w-full py-2 px-3 placeholder:text-text_2 focus:placeholder:text-orange-500 bg-black rounded border-borders leading-tight focus:outline-none focus:border-orange-500"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <select
                            className="appearance-none border w-full py-2 px-3 text-text_2 bg-black rounded border-borders focus:outline-none focus:border-orange-500"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="C">Admin</option>
                            <option value="U">Participant</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-orange-500 hover:bg-red-600 text-black font-bold py-[6px] px-4 rounded focus:outline-none focus:shadow-outline w-full transition"
                            type="button"
                            onClick={handleLogin}
                        >
                            {isLoading ? (
                                <div className="w-full block h-[21px]">
                                    <div className="absolute left-1/2 -translate-x-1/2">
                                        <Loading />
                                    </div>
                                </div>
                            ) : (
                                "Login"
                            )}
                        </button>
                    </div>
                    <div className="flex items-center justify-between mt-[20px]">
                        <span className="text-text_2">
                            Don't have an account?{" "}
                        </span>
                        <Link
                            to="/signup"
                            className="text-orange-500 hover:text-red-600"
                        >
                            Signup
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

export default LoginPage;
