import React, { useEffect, useState } from "react";
import { generateQRCode, checkQRStatus } from "../services/AuthService";

const QRLogin = () => {
    const [qrCode, setQrCode] = useState(null);
    const [sessionId, setSessionId] = useState(null);
    const [status, setStatus] = useState("PENDING");
    const [token, setToken] = useState(null);

    useEffect(() => {
        generateQRCode()
            .then((response) => {
                setQrCode(response.data.qrCode);
                setSessionId(response.data.sessionId);
            })
            .catch((error) => console.error("Error generating QR code:", error));
    }, []);

    useEffect(() => {
        if (sessionId && status === "PENDING") {
            const interval = setInterval(() => {
                checkQRStatus(sessionId)
                    .then((response) => {
                        if (response.data.status === "APPROVED") {
                            setStatus("APPROVED");
                            setToken(response.data.token);
                            clearInterval(interval);
                            // Lưu token vào localStorage hoặc context để sử dụng
                            localStorage.setItem("token", response.data.token);
                        }
                    })
                    .catch((error) => console.error("Error checking status:", error));
            }, 2000);
            return () => clearInterval(interval);
        }
    }, [sessionId, status]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">QR Code Login</h1>
            {qrCode && status === "PENDING" && (
                <div className="text-center">
                    <img src={qrCode} alt="QR Code" className="mb-4" />
                    <p className="text-lg">Scan the QR code with your mobile app</p>
                </div>
            )}
            {status === "APPROVED" && (
                <div className="text-center">
                    <p className="text-lg text-green-600">Login successful!</p>
                    <p className="text-sm">Token: {token}</p>
                </div>
            )}
        </div>
    );
};

export default QRLogin;