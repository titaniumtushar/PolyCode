import React from "react";
import QRCode from "react-qr-code";

// Mock Transaction Type
const WalletPage = ({ qrLink, currentBalance, walletId, transactions }) => {
    return (
        <div style={styles.container}>
            {/* Top Section */}
            <div style={styles.topSection}>
                {/* Left Side: Balance and Wallet ID */}
                <div style={styles.leftPanel}>
                    <h1 style={styles.balance}>${currentBalance.toFixed(2)}</h1>
                    <p style={styles.walletId}>Wallet ID: {walletId}</p>
                </div>

                {/* Right Side: QR Code */}
                <div style={styles.rightPanel}>
                    <QRCode
                        value={qrLink}
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
                    {transactions.map((tx, index) => (
                        <div key={index} style={styles.transactionBlock}>
                            <p>
                                <strong>Head:</strong> {tx.head}
                            </p>
                            <p>
                                <strong>Tail:</strong> {tx.tail}
                            </p>
                            <p>
                                <strong>Amount:</strong> ${tx.amount.toFixed(2)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
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
