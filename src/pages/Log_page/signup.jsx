import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/Button/Button";
import Input from "../../components/Input";
import "./Login.css";
import { Link } from "react-router-dom";
import { FaHeartbeat } from "react-icons/fa";

const SignUp = () => {
  const { signup } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const isDisabled = !email || !password || password !== confirmPassword;

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="brand-section">
          <div className="brand-logo">
            <FaHeartbeat className="brand-icon" />
            Med<span>Sync</span> WA
          </div>
          <p className="brand-subtitle">ADMIN DASHBOARD</p>
        </div>

        <h2 className="login-title">Create an account</h2>
        <p className="login-description">Start managing your clinic efficiently today</p>

        <Input
          label="Email Address"
          type="email"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Minimum 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Repeat your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <label className="remember">
          <input
            type="checkbox"
            checked={remember}
            onChange={() => setRemember(!remember)}
          />
          <span>I agree to the Terms and Conditions</span>
        </label>

        <Button
          title="Create Account"
          onClick={signup}
          disabled={isDisabled}
          fullWidth
        />

        <p className="signup-text">
          Already have an account? <Link to="/" replace>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;

