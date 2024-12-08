import React, { Dispatch, SetStateAction, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ConfirmModal from "./ConfirmModal";
import { TOKEN_STORAGE_KEY, ID_STORAGE_KEY } from "../App";
import { deleteTokenAndId } from "../ts/utils/utils";

// SidePanelItem component for rendering individual links
const SidePanelItem = ({
    text,
    to,
    style,
}: {
    text: string;
    to: string;
    style?: React.CSSProperties;
    
}) => {
    return (
        <Link
            to={to}
            className="block w-[88%] mx-auto my-[8px] rounded-md hover:bg-borders py-[6px] px-[10px] text-[14px] text-text_2 hover:text-white"
            style={style}
        >
            <div>{text}</div>
        </Link>
    );
};

// SidePanel component with role-based links for admin and user
const SidePanel = ({
    displayFn,
    display,
    data,
}: {
    display: boolean;
    displayFn: Dispatch<SetStateAction<boolean>>;
    data: SidePanelData;
}) => {
    const [logoutState, setLogoutState] = useState<boolean>(false);

    const navigate = useNavigate();
    const onLogout = () => {
        deleteTokenAndId(TOKEN_STORAGE_KEY, ID_STORAGE_KEY);
        navigate("/");
        window.location.reload();
    };

    // Mock links for admin and user
    const adminLinks = [
        { text: "Contests", to: "/community/contest" },
        { text: "Marketplace", to: "/community/marketplace" },
        { text: "Wallet", to: "/community/wallet" },
        { text: "Settings", to: "/community/settings" },
    ];

    const userLinks = [
        { text: "Wallet", to: "/user/wallet" },
        { text: "Contests", to: "/user/contests" },
        { text: "Profile", to: "/user/profile" },
    ];

    // Conditionally select links based on user role

    {console.log(data.role)};
    const links = data.role ==="C" ? adminLinks : userLinks;

    return (
        <>
            <div
                onClick={() => displayFn(false)}
                className={`w-screen h-screen ${display ? "fixed" : "hidden"} top-0 left-0 z-[80] backdrop-blur-sm`}
            ></div>
            <div
                className={`fixed z-[90] ${display ? "translate-x-[-100%]" : "translate-x-[0]"} left-full top-[-1px] rounded-l-lg bg-black h-[calc(100vh+2px)] w-[320px] transition ease-in-out border border-borders border-r-0`}
            >
                <div className="relative h-[100px]">
                    <div className="absolute top-[13px] left-[16px] w-[32px] h-[32px] border border-borders rounded-[99px]"></div>
                    <div className="absolute top-[17px] left-[64px] text-[14px]">
                        {data.username}
                    </div>
                    <button
                        onClick={() => displayFn(false)}
                        className="relative w-[30px] h-[30px] text-borders hover:text-white hover:bg-borders rounded-md left-[274px] top-[13px]"
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
                <hr className="border-borders w-[88%] mx-auto" />

                {/* Render the appropriate links based on user role */}
                {links.map((link, index) => (
                    <SidePanelItem key={index} text={link.text} to={link.to} />
                ))}

                <hr className="border-borders w-[88%] mx-auto" />
                <div
                    className="block w-[88%] mx-auto my-[8px] rounded-md hover:bg-borders py-[6px] px-[10px] text-[14px] text-text_2 hover:text-white hover:bg-red-600 cursor-pointer"
                    onClick={() => setLogoutState(!logoutState)}
                >
                    Log out
                </div>

                <ConfirmModal
                    display={logoutState}
                    displayFn={setLogoutState}
                    onOkFn={onLogout}
                    title="Log Out"
                    message={`Are you sure you want to log out of ${data.username}?`}
                />
            </div>
        </>
    );
};

export default SidePanel;
