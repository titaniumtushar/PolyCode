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
import { PrivateRoutes } from "./ProtectedRoutes";

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
                        path="/signup"
                        element={
                            <SignupPage
                            />
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            <LoginPage
                                
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
                    <Route element={<PrivateRoutes />}>

                    <Route path="/admin" element={<AdminPage />} />

                    <Route path="/marketplace" element={<MarketplacePage />} />
                    
                    </Route>


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
