import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { decodeToken } from "../ts/utils/decodeToken";
import { useNavigate, useNavigation } from "react-router-dom";


// Mock Transaction Type
const WalletPage = () => {

    const navigation = useNavigate();
    const [walletId,setWalletId] = useState("");
    const [data,setData] = useState();

    useEffect(()=>{
        const decoded = decodeToken();
        const k = decoded
        console.log(k.wallet_id);
        if(!decoded.wallet_id){
            navigation("Login");
        }

        setWalletId(k.wallet_id);

        const fetchWallet = async()=>{

            
            const res = await fetch(
                `${process.env.REACT_APP_BACKEND_URI}/wallet/${k.wallet_id}`,
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
            console.log(mainJson);
            if(!mainJson){
                console.log("something went wrong!");
            }

            setData(mainJson);




        }

        fetchWallet();
        
    },[])

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
        </>
    );
};

// Inline Styles
const styles = {
    container: {
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#000", // Black theme
        color: "#FFF", // White text
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
        color: "#4CAF50", // Highlight balance in green
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
        backgroundColor: "#222", // Dark gray for transaction blocks
        padding: "10px",
        borderRadius: "5px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
    },
};

export default WalletPage;
