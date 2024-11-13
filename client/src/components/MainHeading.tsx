import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Tooltip from "./Tooltip";
import SidePanel from "./SidePanel";
import Notification from "./Notification";
import BackPage from "./BackPage";

const MainHeading = ({ data }: { data?: MainHeadingData }) => {
    const [sidePanelState, setSidePanelState] = useState<boolean>(false);
    const [notifDisplayState, setNotifDisplayState] = useState<boolean>(false);
    const navigate = useNavigate();

   

    return (
       


        <>
            <div className="fixed w-full h-[60px] bg-black border-b border-borders flex items-center z-[100]">
                {/* BackPage component aligned vertically with the logo */}
                <button className="ml-[20px] pb-[25px]">
                    <BackPage />
                </button>

                {/* Logo */}
                <Link to="/" className="select-none ml-[36px]">
                    <div
                        id="logo-cont"
                        className="inline-block text-[24px] font-bold italic mt-[12px]"
                    >
                        <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-yellow-600 px-[1px]">
                            PolyCode
                        </span>
                        <span>Arena</span>
                    </div>
                </Link>

                {/* Navigation Links with added gap */}
                <div className="flex-grow flex justify-start ml-[50px]">
                    {data != undefined &&
                        "items" in data &&
                        data.items != undefined &&
                        data.items.length !== 0 &&
                        data.items.map((elem) => (
                            <Link
                                to={elem.link_path}
                                className="mt-[15px] hidden md:inline-block text-[14px] h-fit p-[5px] text-[#808080] hover:text-white transition"
                            >
                                <div id={elem.text}>{elem.text}</div>
                            </Link>
                        ))}
                </div>

                {data?.status === "loggedin" || data?.status == undefined ? (
                    <div className="fixed flex flex-row right-[36px] items-center h-[60px]">
                        <div className="inline-block p-[5px] text-[14px] text-[#808080] md:hidden">
                            <div className="group w-[32px] h-[32px] border border-borders rounded-[99px] relative hover:bg-[#222] cursor-pointer">
                                <i className="bi bi-three-dots-vertical absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:text-white"></i>
                            </div>
                        </div>

                        <div
                            id="notification"
                            className="inline-block p-[5px] text-[14px] text-[#808080] "
                        >
                            <Notification
                                display={notifDisplayState}
                                displayFn={setNotifDisplayState}
                            />
                        </div>
                        <div
                            id="profile-picture"
                            className="inline-block relative p-[5px] text-[14px] text-[#808080] "
                            onClick={() => setSidePanelState(!sidePanelState)}
                        >
                            <Tooltip text={data?.username || ""}>
                                <div className="w-[32px] h-[32px] border border-borders rounded-[99px]"></div>
                            </Tooltip>
                        </div>
                        <SidePanel
                            displayFn={setSidePanelState}
                            display={sidePanelState}
                            data={{
                                username: data?.username || "",
                            }}
                        />
                    </div>
                ) : data?.status === "not-loggedin" ? (
                    <div className="fixed flex flex-row right-[36px] items-center h-[60px]">
                        <Link
                            to="/login"
                            className="inline-block font-bold py-[6px] px-[16px] bg-black hover:bg-borders border rounded-md border-borders text-white text-[14px]"
                        >
                            Log In
                        </Link>
                        <Link
                            to="/signup"
                            className="ml-[8px] font-bold inline-block py-[6px] px-[16px] bg-gradient-to-r from-orange-500 to-purple-700 border rounded-md border-borders text-black text-[14px] hover:bg-red-800"
                        >
                            Sign Up
                        </Link>
                    </div>
                ) : (
                    <></>
                )}
            </div>
            <div className="h-[60px]"></div>
        </>
    );
};

export default MainHeading;
