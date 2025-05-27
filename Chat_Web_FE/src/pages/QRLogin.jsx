import React, { useEffect, useState } from "react";
import QRCode from "qrcode";

const QRLogin = ({ onSessionIdGenerated }) => {
  const [qrCode, setQrCode] = useState(null);

  const generateSessionId = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const generateQRCode = async () => {
    try {
      const session = generateSessionId();
      onSessionIdGenerated(session);
      const qrCodeData = await QRCode.toDataURL(session);
      setQrCode(qrCodeData);
    } catch (error) {
      console.error("Lỗi tạo mã QR:", error);
    }
  };

  useEffect(() => {
    generateQRCode();
    const interval = setInterval(() => {
      generateQRCode();
    }, 30000000); // 30 phút

    return () => clearInterval(interval);
  }, []);

  const styles = {
    wrapper: {
      marginLeft: "10px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      backgroundColor: "#f3f4f6", // light gray
      textAlign: "center",
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "16px"
    },
    img: {
      marginBottom: "16px",
      width: "200px",
      height: "200px",
      borderRadius: "8px"
    },
    description: {
      fontSize: "18px"
    }
  };

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.title}>QR Code Login</h1>

      {qrCode && (
        <div>
          <img src={qrCode} alt="QR Code" style={styles.img} />
          {/* <p style={styles.description}>Mã QR chứa session ID</p> */}
        </div>
      )}
    </div>
  );
};

export default QRLogin;

