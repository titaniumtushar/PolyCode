import axios, { AxiosError } from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../App";
import Loading from "../components/Loading";
import CustomNavbar from "../components/CustomNavbar";
import BackPage from "../components/BackPage";
import { Helmet } from "react-helmet"; // For SEO

interface InstituteSignUpPageProps {
  Data: {
    token: string;
    setTokenFunction: (token: string) => void;
    id: string;
    setIdFunction: (id: string) => void;
  };
}

const InstituteSignUpPage = ({ Data }: InstituteSignUpPageProps) => {
  const [username, setUsername] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Handle Sign-up process
  const handleSignUp = async () => {
    setIsLoading(true);

    try {
      if (password !== confirmPassword) {
        setMessage("Password and confirm password do not match.");
        setIsLoading(false);
        return;
      }

      const response = await axios.post(`${API_URL}/api/accounts/signup`, {
        username,
        email,
        password,
        role,
      });

      const { data } = response;

      Data.setTokenFunction(data.token);
      Data.setIdFunction(data.id);
      document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60};`;

      if (role === "participant") {
        navigate("/problemset");
      } else if (role === "admin") {
        navigate("/admin");
      }

    } catch (error: any) {
      setIsLoading(false);
      const errorMessage = (error.response?.data as { success: boolean; message: string })?.message || "Sign-up failed!";
      setMessage(errorMessage);
    }
  };

  const CustomNavData = {
    items: [
      { text: "Student SignUp", link_path: "/signup" },
      { text: "Institution SignUp", link_path: "/institute" },
    ],
  };

  return (
    <>
      {/* SEO meta tags */}
      <Helmet>
        <title>Institution Sign Up | PolyCode Arena</title>
        <meta name="description" content="Sign up as an institution to access the PolyCode Arena and start coding challenges." />
        <meta name="keywords" content="PolyCode, Arena, Institution, Sign Up, Coding Challenges" />
        <meta name="author" content="PolyCode Team" />
        <meta property="og:title" content="Institution Sign Up | PolyCode Arena" />
        <meta property="og:description" content="Sign up as an institution to access the PolyCode Arena and start coding challenges." />
        <meta property="og:url" content="https://polycode.com/institute-signup" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://polycode.com/logo.png" />
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
          <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-orange-600 px-[1px]">
            PolyCode
          </span>
          <span>Arena</span>
        </div>
      </Link>

      {/* Sign Up Form */}
      <div className="min-h-fit w-[300px] mx-auto text-[14px]">
        <div className="relative bg-black shadow-md rounded px-2 pt-6 pb-8 mb-4">
          <h2 className="text-[34px] font-bold mb-[30px] text-center mt-[60px]">
            Sign Up
          </h2>

          {/* Custom Navbar */}
          <div className="text-10px font-semibold whitespace-nowrap mb-4">
            <CustomNavbar data={CustomNavData} />
          </div>

          {/* Username Input */}
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

          {/* Email Input */}
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

          {/* Password Input */}
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

          {/* Confirm Password Input */}
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

          {/* Submit Button */}
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

          {/* Sign In Link */}
          <div className="flex items-center justify-between mt-[20px]">
            <span className="text-text_2">Already have an account? </span>
            <Link to="/login" className="text-orange-500 hover:text-red-600">
              Login
            </Link>
          </div>

          {/* Error Message */}
          <div className="text-center mt-[20px] text-red-600 w-full overflow-hidden">
            {message}
          </div>
        </div>
      </div>
    </>
  );
};

export default InstituteSignUpPage;
