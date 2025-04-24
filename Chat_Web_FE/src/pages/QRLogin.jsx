// QRLogin.jsx
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
      onSessionIdGenerated(session); // Gửi sessionId lên LoginPage
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
    }, 30000000);// 30 phút

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">QR Code Login</h1>


      {qrCode && (
        <div className="text-center">
          <img src={qrCode} alt="QR Code" className="mb-4" />
          {/* <p className="text-lg">Mã QR chứa session ID</p> */}
        </div>
      )}
    </div>
  );
};

export default QRLogin;
