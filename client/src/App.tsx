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
import { Layout, LayoutTwo } from "./Layout";

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
                    <Route path="/" element={<LandingPage  />} />

                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    

                    <Route element={<Layout />}>

                        <Route element={<PrivateRoutes role={"C"} />}>
                            <Route path="/admin" element={<AdminPage />} />
                            <Route
                            path="/problemset"
                            element={<ProblemSet token={token} id={id} />}
                        />
                        <Route
                            path="/listproduct"
                            element={<ListProductPage />}
                        />
                        </Route>

                        

                        
                    </Route>

                    <Route element={<LayoutTwo />}>
                        <Route element={<PrivateRoutes role={"U"} />}>
                            <Route
                                path="/marketplace"
                                element={<MarketplacePage />}
                            />
                        </Route>
                    </Route>

                    
                    

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
