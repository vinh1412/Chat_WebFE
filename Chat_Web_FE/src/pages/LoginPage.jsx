import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useDashboardContext } from "../context/Dashboard_context";
import { getCurrentUserService } from "../services/UserService";
import formatPhoneNumber from "../utils/FormatPhoneNumber";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [phone, setPhone] = useState("0862058920");
  const [password, setPassword] = useState("12345678");
  const navigate = useNavigate();
  const { setCurrentUser } = useDashboardContext();

  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();

    const formLogin = {
      phone: formatPhoneNumber(phone),
      password,
    };

    login(formLogin, {
      onSuccess: async () => {
        try {
          const user = await getCurrentUserService();
          setCurrentUser(user);
          navigate("/");
        } catch (error) {
          toast.error("Lỗi lấy thông tin người dùng", {
            position: "top-center",
            autoClose: 3000,
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

  return (
    <div style={styles.wrapper}>
      <div style={styles.loginBox}>
        <img
          src="https://stc-zaloprofile.zdn.vn/pc/v1/images/logo.svg"
          alt="Zalo Logo"
          style={styles.logo}
        />
        <h2 style={styles.title}>Đăng nhập Zalo</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="text"
            placeholder="Số điện thoại hoặc email"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
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
        </div>
      </div>
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
    boxShadow: "0 8px 20px rgba(255, 255, 255, 0.1)",
    width: "100%",
    maxWidth: "360px",
    textAlign: "center",
  },
  logo: {
    width: "80px",
    marginBottom: "1rem",
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
    backgroundColor: "#f9f9f9",
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
    gap: "1rem",
    fontSize: "0.9rem",
  },
  linkBtn: {
    background: "none",
    border: "none",
    color: "#0068ff",
    cursor: "pointer",
    textDecoration: "underline",
    fontSize: "0.9rem",
  },
};

export default LoginPage;
