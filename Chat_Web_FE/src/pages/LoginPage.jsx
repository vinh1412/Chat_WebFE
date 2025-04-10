import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const handleLogin = (e) => {
    e.preventDefault();
    // Gửi dữ liệu đăng nhập
    console.log("Đăng nhập:", username, password);
  };

  const handleForgotPassword = () => {
    alert("Chức năng quên mật khẩu đang được phát triển...");
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
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
