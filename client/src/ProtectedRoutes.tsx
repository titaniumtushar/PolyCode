import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

type Role = "C" | "U";

export const PrivateRoutes = ({ role }: { role: Role }) => {
    const [allowed, setAllowed] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token: string | null = localStorage.getItem("token");

        if (token) {
            try {
                const decodedPayload = atob(token.split(".")[1]);
                const payload = JSON.parse(decodedPayload);

                if (payload.role === role) {
                    setAllowed(true);
                } else {
                    setAllowed(false);
                }
            } catch (error) {
                console.error("Invalid token:", error);
                localStorage.clear();
                setAllowed(false);
            }
        } else {
            setAllowed(false);
        }

        setLoading(false); // Stop the loading state
    }, [role]);

    if (loading) {
        return <div>Loading...</div>; // Optional: Replace with a proper loading spinner
    }

    return allowed ? <Outlet /> : <Navigate to="/login" />;
};
