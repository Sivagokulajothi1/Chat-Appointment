import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/Button/Button";
import Input from "../../components/Input";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { FaHeartbeat } from "react-icons/fa";
import { adminLogin } from "../../services/auth.service";
import { useToast } from "../../context/ToastContext";

const Login = () => {
  const { setSession } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const isDisabled = !email || !password;

  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        showToast("Email and Password are required", "error");
        return;
      }

      const res = await adminLogin({
        email,
        password,
      });

      // expected backend response
      const { token, user } = res.data;

      // store auth in sessionStorage (clears on browser close → forces re-login)
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));

      showToast("Login successful", "success");

      // go to dashboard (MainLayout will load automatically)
      setSession(token, user);
      navigate("/dashboard");
    } catch (err) {
      showToast(
        err?.response?.data?.message || "Invalid email or password",
        "error"
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="brand-section">
          <div className="brand-logo">
            <FaHeartbeat className="brand-icon" />
            Mithin <span>Clinic</span>
          </div>
          <p className="brand-subtitle">ADMIN DASHBOARD</p>
        </div>

        <h2 className="login-title">Welcome back</h2>
        <p className="login-description">Please enter your details to sign in</p>

        <Input
          label="Email Address"
          type="email"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Password"
          rightLabel={<span className="forgot">Forgot Password?</span>}
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label className="remember">
          <input
            type="checkbox"
            checked={remember}
            onChange={() => setRemember(!remember)}
          />
          <span>Remember this device for 30 days</span>
        </label>

        <Button
          title="Sign in"
          onClick={handleLogin}
          disabled={isDisabled}
          fullWidth
        />

        <p className="signup-text">
          Don't have an account? <Link to="/signup" replace>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
