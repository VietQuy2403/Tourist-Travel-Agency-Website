import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const response = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password
      });
      
      // Lưu token và thông tin người dùng vào localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("email", email); // Lưu email để sử dụng ở ManageBooking
      
      console.log("Đăng nhập thành công! Email đã lưu:", email);
      alert("Đăng nhập thành công!");
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Lỗi khi đăng nhập. Vui lòng thử lại.");
      alert("Lỗi đăng nhập: " + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Đăng nhập</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleLogin} style={styles.form}>
        <div style={styles.inputGroup}>
          <span style={styles.icon}>📧</span>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <span style={styles.icon}>🔒</span>
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        <button 
          type="submit" 
          style={styles.button}
          disabled={isLoading}
        >
          {isLoading ? "Đang xử lý..." : "Đăng nhập"}
        </button>
      </form>
      <p style={styles.registerLink}>
        Chưa có tài khoản? <a href="/register" style={styles.link}>Đăng ký ngay</a>
      </p>
    </div>
  );
};

// CSS viết dưới dạng object JavaScript
const styles = {
  container: {
    width: "350px",
    margin: "50px auto",
    padding: "20px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  title: {
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  inputGroup: {
    display: "flex",
    alignItems: "center",
    margin: "10px 0",
    background: "#f1f1f1",
    borderRadius: "5px",
    padding: "10px",
  },
  icon: {
    marginRight: "10px",
  },
  input: {
    border: "none",
    outline: "none",
    background: "transparent",
    flex: "1",
    fontSize: "16px",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#28a745",
    color: "white",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  },
  registerLink: {
    marginTop: "10px",
    fontSize: "14px",
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginBottom: "10px"
  }
};
  
export default Login;
