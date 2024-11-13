import { useEffect, useState } from "react";
import ProblemPage from "./pages/ProblemPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProblemSet from "./pages/ProblemSet";
import LandingPage from "./pages/LandingPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ErrorPage from "./pages/ErrorPage";
import ProfilePage from "./pages/ProfilePage";
import SettingPage from "./pages/SettingPage";
import AdminPage from "./pages/AdminPage";
import MarketplacePage from "./pages/MarketplacePage";
import ListProductPage from "./pages/ListProductPage";
import AdminProblemListPage from "./pages/AdminProblemListPage";

export const TOKEN_STORAGE_KEY = "authToken";
export const ID_STORAGE_KEY = "id";
// export const API_URL = "https://fire-code-api.vercel.app";
export const API_URL = "http://localhost:8080";

function App() {
    const [token, setToken] = useState(localStorage.getItem(TOKEN_STORAGE_KEY));
    const [id, setId] = useState(localStorage.getItem(ID_STORAGE_KEY));

    const changeToken = (string: string) => {
        setToken(string);
    };
    const changeId = (string: string) => {
        setId(string);
    };

    useEffect(() => {
        if (token) {
            localStorage.setItem(TOKEN_STORAGE_KEY, token);
        } else {
            localStorage.removeItem(TOKEN_STORAGE_KEY);
        }
        if (id) {
            localStorage.setItem(ID_STORAGE_KEY, id);
        } else {
            localStorage.removeItem(ID_STORAGE_KEY);
        }


        
    }, [token, id]);

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={<LandingPage />}
                    />
                    <Route
                        path="/problemset"
                        element={<ProblemSet token={token} id={id} />}
                    />
                    <Route
    path="/problem/:name"
    element={
        <ProblemPage
            problemName="Two Sum"
            description={`
                Given an array of integers \`nums\` and an integer \`target\`, 
                return indices of the two numbers such that they add up to the target.
                You may assume that each input would have exactly one solution, 
                and you may not use the same element twice.
                You can return the answer in any order.
            `}
            testCases={[
                "Input: nums = [2,7,11,15], target = 9 | Output: [0,1]",
                "Input: nums = [3,2,4], target = 6 | Output: [1,2]",
                "Input: nums = [3,3], target = 6 | Output: [0,1]",
            ]}
            initialCode={`
                function twoSum(nums, target) {
                    // Write your solution here
                }
            `}
            onSubmit={(code) => {
                console.log("Submitted Code:", code);
                // Add submission logic here
            }}
        />
    }
/>

                   
                    <Route
                        path="/signup"
                        element={
                            <SignupPage
                                Data={{
                                    token: token || "",
                                    setTokenFunction: changeToken,
                                    id: id || "",
                                    setIdFunction: changeId,
                                }}
                            />
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            <LoginPage
                                Data={{
                                    token: token || "",
                                    setTokenFunction: changeToken,
                                    id: id || "",
                                    setIdFunction: changeId,
                                }}
                            />
                        }
                    />
                    <Route
                        path="/sorry"
                        element={
                            <ErrorPage
                                data={{
                                    header: "Sorry :(",
                                    message:
                                        "If you already have an account, please log in. If you don't, please sign up.",
                                    links: [
                                        {
                                            text: "Login",
                                            link_path: "/login",
                                        },
                                        {
                                            text: "Signup",
                                            link_path: "/signup",
                                        },
                                    ],
                                }}
                            />
                        }
                    />
                    <Route
                        path="/settings"
                        element={<SettingPage token={"ndjn"} id={"ksk"} />}
                    />
                    <Route
                        path="/accounts/:name"
                        element={<ProfilePage token={"kdmskdmmkd"} id={"dmdkm"} />}
                    />

                    <Route path="/admin" element={<AdminPage />} />

                    <Route path="/marketplace" element={<MarketplacePage />} />
                    <Route path="/listproduct" element={<ListProductPage />} />

                    <Route
                        path="/listproblems"
                        element={<AdminProblemListPage />}
                    />

                    <Route
                        path="*"
                        element={
                            <ErrorPage
                                data={{
                                    header: "404",
                                    message: "Page not found.",
                                    links: [
                                        { text: "Main Page", link_path: "/" },
                                        {
                                            text: "Problem List",
                                            link_path: "/problemset",
                                        },
                                    ],
                                }}
                            />
                        }
                    />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
