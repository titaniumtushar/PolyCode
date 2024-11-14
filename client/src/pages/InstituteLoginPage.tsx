import axios, { AxiosError } from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../App";
import Loading from "../components/Loading";
import CustomNavbar from "../components/CustomNavbar";
import BackPage from "../components/BackPage";
import { Helmet } from "react-helmet"; // Import Helmet for SEO

// Defining the types for Props to improve clarity
interface LoginPageProps {
  Data: {
    token: string;
    setTokenFunction: (token: string) => void;
    id: string;
    setIdFunction: (id: string) => void;
  };
}

const LoginPage = ({ Data }: LoginPageProps) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Handle login process
  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/accounts/login`, {
        username_or_email: usernameOrEmail,
        password,
      });

      if (response.data.success === false) {
        setMessage(response.data.message);
        setIsLoading(false);
        return;
      }

      Data.setTokenFunction(response.data.token);
      Data.setIdFunction(response.data.id);

      // Navigate based on user role
      if (response.data.role === "participant") {
        navigate("/problemset"); // Participant's dashboard
      } else if (response.data.role === "admin") {
        navigate("/admin"); // Admin dashboard
      }
    } catch (error: any) {
      setIsLoading(false);
      const errorMessage = (error.response?.data as { message: string })?.message || "An error occurred!";
      setMessage(errorMessage);
    }
  };

  const CustomNavData = {
    items: [
      { text: "Student Login", link_path: "/login" },
      { text: "Institution Login", link_path: "/institutelogin" }
    ]
  };

  return (
    <>
      {/* SEO Optimized Meta Tags */}
      <Helmet>
        <title>Login | PolyCode Arena</title>
        <meta name="description" content="Login to PolyCode Arena to access coding challenges, problems, and more. Enter your username or email and password to get started." />
        <meta name="keywords" content="PolyCode, Arena, Login, Coding Challenges, Programming Problems, Coding Arena" />
        <meta name="author" content="PolyCode Team" />
        <meta property="og:title" content="Login | PolyCode Arena" />
        <meta property="og:description" content="Login to PolyCode Arena to access coding challenges, problems, and more." />
        <meta property="og:url" content="https://polycode.com/login" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://polycode.com/logo.png" /> {/* Replace with actual logo */}
      </Helmet>

      {/* Back Link & Logo */}
      <Link to={"/"}>
        <div>
          <BackPage />
        </div>
        <div
          id="logo-cont"
          className="inline-block relative text-[24px] left-1/2 -translate-x-1/2 font-bold italic mx-auto mt-[12px]"
        >
          <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 px-[1px]">
            PolyCode
          </span>
          <span>Arena</span>
        </div>
      </Link>

      {/* Login Form */}
      <div className="min-h-fit w-[300px] mx-auto text-[14px]">
        <div className="relative bg-black shadow-md rounded px-5 pt-6 pb-8 mb-4">
          <h2 className="text-[34px] font-bold mb-[30px] text-center mt-[60px]">
            Log In
          </h2>

          {/* Custom Navbar */}
          <div className="text-10px font-semibold whitespace-nowrap mb-4">
            <CustomNavbar data={CustomNavData} />
          </div>

          {/* Username or Email Input */}
          <div className="mb-4">
            <input
              className="appearance-none border w-full py-2 px-3 placeholder:text-text_2 focus:placeholder:text-orange-500 bg-black rounded border-borders leading-tight focus:outline-none focus:border-orange-500"
              type="text"
              placeholder="Username or Email"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              required={true}
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <input
              className="appearance-none border w-full py-2 px-3 placeholder:text-text_2 focus:placeholder:text-orange-500 bg-black rounded border-borders leading-tight focus:outline-none focus:border-orange-500"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={true}
            />
          </div>

          {/* Login Button */}
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

          {/* Sign-up Link */}
          <div className="flex items-center justify-between mt-[20px]">
            <span className="text-text_2">Don't have an account? </span>
            <Link to="/signup" className="text-orange-500 hover:text-red-600">
              Signup
            </Link>
          </div>

          {/* Error/Success Message */}
          <div className="text-center mt-[20px] text-red-600 w-full overflow-hidden">
            {message}
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
