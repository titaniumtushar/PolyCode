import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { decodeToken } from "../ts/utils/decodeToken";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../App";

const WalletPage = () => {
    const navigate = useNavigate();
    const [walletId, setWalletId] = useState("");
    const [data, setData] = useState();
    const [isModalOpen, setModalOpen] = useState(false);
    const [receiverWalletId, setReceiverWalletId] = useState("");

    useEffect(() => {
        const decoded = decodeToken();
        const k = decoded;
        if (!decoded.wallet_id) {
            navigate("Login");
        }

        setWalletId(k.wallet_id);

        const fetchWallet = async () => {
            const res = await fetch(
                `${API_URL}/api/wallet/${k.wallet_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            const data = await res.json();
            const mainJson = data.data;
            if (!mainJson) {
                console.log("Something went wrong!");
            }
            setData(mainJson);
        };

        fetchWallet();
    }, [navigate]);

    const handlePay = () => {
        if (!receiverWalletId.trim()) {
            alert("Wallet ID cannot be empty!");
            return;
        }

        const first = window.location.pathname.split("/")[1];
        console.log(first);
        navigate(`/${first}/pay/${receiverWalletId}`);
    };

    return (
        <>
            {data && (
                <div style={styles.container}>
                    {/* Top Section */}
                    <div style={styles.topSection}>
                        {/* Left Side: Balance and Wallet ID */}
                        <div style={styles.leftPanel}>
                            <h1 style={styles.balance}>
                                {data.current_balance} arena_coins
                            </h1>
                            <p style={styles.walletId}>Wallet ID: {walletId}</p>
                        </div>

                        {/* Right Side: QR Code */}
                        <div style={styles.rightPanel}>
                            <QRCode
                                value={`${window.location.origin}/user/pay/${walletId}`}
                                bgColor="#000"
                                fgColor="#FFF"
                                size={200}
                            />
                        </div>
                    </div>

                    {/* Pay Button */}
                    <button
                        onClick={() => setModalOpen(true)}
                        style={styles.payButton}
                    >
                        Pay
                    </button>

                    

                    {/* Bottom Section: Transactions */}
                    <div style={styles.transactionsSection}>
                        <h2 style={styles.transactionsTitle}>Transactions</h2>
                        <div style={styles.transactionsList}>
                            {data.transactions &&
                                data.transactions.map((tx, index) => (
                                    <div
                                        key={index}
                                        style={styles.transactionBlock}
                                    >
                                        <p>
                                            <strong>Head:</strong> {tx.head}
                                        </p>
                                        <p>
                                            <strong>Tail:</strong> {tx.tail}
                                        </p>
                                        <p>
                                            <strong>Amount:</strong> $
                                            {tx.amount.toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <h3 style={styles.modalHeading}>Enter Wallet ID</h3>
                        <input
                            type="text"
                            value={receiverWalletId}
                            onChange={(e) =>
                                setReceiverWalletId(e.target.value)
                            }
                            placeholder="Enter Wallet ID"
                            style={styles.modalInput}
                        />
                        <div style={styles.modalButtons}>
                            <button
                                onClick={handlePay}
                                style={{
                                    ...styles.button,
                                    ...styles.confirmButton,
                                }}
                            >
                                Pay
                            </button>
                            <button
                                onClick={() => setModalOpen(false)}
                                style={{
                                    ...styles.button,
                                    ...styles.cancelButton,
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// Inline Styles
const styles = {
    container: {
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#000",
        color: "#FFF",
        minHeight: "100vh",
        padding: "5rem",
        boxSizing: "border-box",
    },
    topSection: {
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        marginBottom: "20px",
    },
    leftPanel: {
        flex: 1,
        paddingRight: "20px",
    },
    balance: {
        fontSize: "36px",
        fontWeight: "bold",
        color: "#4CAF50",
        marginBottom: "10px",
    },
    walletId: {
        fontSize: "16px",
        color: "#AAA",
    },
    rightPanel: {
        flexShrink: 0,
        width: "200px",
        height: "200px",
    },
    payButton: {
        padding: "10px 20px",
        backgroundColor: "black",
        color: "white",
        border: "dashed",
        borderRadius: "6px",
        borderWidth:"0.5px",
        fontSize: "32px",
        cursor: "pointer",
        marginTop: "20px",
    },
    transactionsSection: {
        marginTop: "20px",
    },
    transactionsTitle: {
        fontSize: "24px",
        marginBottom: "10px",
    },
    transactionsList: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    transactionBlock: {
        backgroundColor: "#222",
        padding: "10px",
        borderRadius: "5px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
    },
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    modal: {
        backgroundColor: "#1a1a1a",
        color: "#ffffff",
        padding: "20px 30px",
        borderRadius: "8px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.6)",
        width: "400px",
        textAlign: "center",
    },
    modalHeading: {
        marginBottom: "20px",
    },
    modalInput: {
        width: "100%",
        padding: "10px",
        fontSize: "16px",
        border: "1px solid #444",
        borderRadius: "4px",
        backgroundColor: "#333",
        color: "#fff",
        marginBottom: "20px",
    },
    modalButtons: {
        display: "flex",
        justifyContent: "space-between",
    },
    button: {
        padding: "10px 20px",
        border: "none",
        borderRadius: "4px",
        fontSize: "16px",
        cursor: "pointer",
    },
    confirmButton: {
        backgroundColor: "blue",
        color: "white",
    },
    cancelButton: {
        backgroundColor: "blue",
        color: "white",
    },
};

export default WalletPage;
