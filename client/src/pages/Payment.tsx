import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PaymentForm= () => {
  const { receiverid } = useParams<{ receiverid: string }>(); 
  
  const navigate = useNavigate();
  const [amount, setAmount] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!receiverid) {
      alert("Receiver ID is missing!");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/wallet/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization":`Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          headId: receiverid,
          amount: amount,
        }),
      });

      
      const data = await response.json();

      alert(data.message);
      

    }
    catch(err){
      console.log(err);

      alert("Payment Unsuccesful!");

    }
  }
   

  const styles = {
    overlay: {
      position: "fixed" as const,
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
      textAlign: "center" as const,
    },
    heading: {
      marginBottom: "20px",
    },
    form: {
      display: "flex",
      flexDirection: "column" as const,
    },
    label: {
      marginBottom: "15px",
      fontSize: "16px",
      textAlign: "left" as const,
    },
    input: {
      width: "100%",
      padding: "10px",
      fontSize: "16px",
      border: "1px solid #444",
      borderRadius: "4px",
      backgroundColor: "#333",
      color: "#fff",
      marginBottom: "20px",
    },
    button: {
      padding: "10px 20px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "4px",
      fontSize: "16px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.heading}>Payment to User ID: {receiverid}</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Amount:
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter Amount"
              required
              style={styles.input}
            />
          </label>
          <button type="submit" style={styles.button}>
            Pay
          </button>
        </form>
      </div>
    </div>
  );
};

export { PaymentForm };
