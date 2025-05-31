import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useDashboardContext } from "../context/Dashboard_context";
import { getUserBySessionId } from "../services/QACodeService.js";
import { getCurrentUserService } from "../services/QACodeService.js";
import formatPhoneNumber from "../utils/FormatPhoneNumber";
import { setAccessToken } from "./LocalStorageUtils";
import { toast } from "react-toastify";
import QRLogin from "../pages/QRLogin";
import { Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const [phone, setPhone] = useState("0862058920");
  const [password, setPassword] = useState("12345678a");
  const [sessionId, setSessionId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { setCurrentUser } = useDashboardContext();
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    const formLogin = { phone: formatPhoneNumber(phone), password };
    login(formLogin, {
      onSuccess: async () => {
        try {
          const user = await getCurrentUserService();
          setCurrentUser(user);
          navigate("/");
        } catch (error) {
          toast.error("Lỗi lấy thông tin người dùng", {
            position: "top-center",
          });
        }
      },
    });
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleFastLogin = async () => {
    if (!sessionId) {
      toast.error("Không tìm thấy sessionId. Vui lòng tải lại trang.", {
        position: "top-center",
      });
      return;
    }

    try {
      const data = await getUserBySessionId(sessionId);

      if (!data || !data.token) {
        toast.error("Đăng nhập nhanh thất bại. Vui lòng thử lại.", {
          position: "top-center",
        });
        return;
      }

      setAccessToken(data.token);
      const user = await getCurrentUserService();
      setCurrentUser(user);

      toast.success("Đăng nhập nhanh thành công!", { position: "top-center" });
      navigate("/");
    } catch (error) {
      console.error("Lỗi đăng nhập nhanh:", error);
      toast.error("Đã xảy ra lỗi khi đăng nhập nhanh.", {
        position: "top-center",
      });
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.loginBox}>
        <h1 style={{ color: "#0068ff" }}>Chat</h1>
        <h2 style={styles.title}>Đăng nhập</h2>

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="text"
            placeholder="Số điện thoại hoặc email"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={styles.input}
          />
          <div style={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.inputPass}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <button type="submit" style={styles.loginButton}>
            Đăng nhập
          </button>
        </form>

        <div style={styles.links}>
          <button onClick={handleForgotPassword} style={styles.linkBtn}>
            Quên mật khẩu?
          </button>
          <span>•</span>
          <button onClick={handleRegister} style={styles.linkBtn}>
            Đăng ký
          </button>
          <span>•</span>
          <button onClick={handleFastLogin} style={styles.linkBtn}>
            Đăng nhập QR code
          </button>
        </div>

        {/* {sessionId && (
          <div style={{ marginTop: "1rem", color: "#0068ff", fontSize: "0.9rem" }}>
            <strong>Session ID:</strong> {sessionId}
          </div>
        )} */}
      </div>

      <QRLogin onSessionIdGenerated={setSessionId} />
    </div>
  );
};

const styles = {
  wrapper: {
    height: "100vh",
    background: "#f0f2f5",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  loginBox: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "360px",
    textAlign: "center",
  },
  title: {
    marginBottom: "1rem",
    fontSize: "1.5rem",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "0.75rem",
    marginBottom: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    backgroundColor: "#F0F2F5",
    color: "#333",
  },
  loginButton: {
    padding: "0.75rem",
    borderRadius: "8px",
    backgroundColor: "#0068ff",
    color: "#fff",
    border: "none",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
  },
  links: {
    marginTop: "1rem",
    display: "flex",
    justifyContent: "center",
    gap: "0.5rem",
    fontSize: "0.9rem",
    flexWrap: "wrap",
  },
  linkBtn: {
    background: "none",
    border: "none",
    color: "#0068ff",
    cursor: "pointer",
    textDecoration: "underline",
    fontSize: "0.9rem",
  },
  passwordWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    marginBottom: "1rem",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#F0F2F5",
    width: "100%",
  },
  eyeButton: {
    position: "absolute",
    right: "0.75rem",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#333",
  },
  inputPass: {
    marginBottom: 0,
    width: "90%",
    padding: "0.75rem",
    borderRadius: "8px",
    fontSize: "1rem",
    color: "#333",
    backgroundColor: "#F0F2F5",
    border: "none",
    outline: "none",
  },
};

export default LoginPage;
