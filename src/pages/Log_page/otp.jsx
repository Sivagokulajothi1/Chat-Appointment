import { useEffect, useRef, useState } from "react";
import Button from "../../components/Button/Button";
import "./Login.css";
import { FaHeartbeat } from "react-icons/fa";
import { useToast } from "../../context/ToastContext";
// import { verifyOtp, resendOtp } from "../../services/auth.service"; // ✅ add when you create
import { useNavigate } from "react-router-dom";
import { verifyOtp } from "../../services/auth.service";
import { useAuth } from "../../context/AuthContext";

const OTP_SECONDS = 10 * 60;

const formatMMSS = (sec) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

const OtpScreen = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { setSession  } = useAuth();

  const email = localStorage.getItem("pendingEmail") || "";

  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [secondsLeft, setSecondsLeft] = useState(OTP_SECONDS);
  const [loading, setLoading] = useState(false);

  const inputsRef = useRef([]);

  const expired = secondsLeft <= 0;
  const otp = digits.join("");
  const canVerify = otp.length === 6 && !expired && !loading && email;

  // ✅ timer countdown
  useEffect(() => {
    if (expired) return;
    const t = setInterval(() => setSecondsLeft((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [expired]);

  // ✅ autofocus first box
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    const v = value.replace(/\D/g, "").slice(-1); // only 1 digit
    const next = [...digits];
    next[index] = v;
    setDigits(next);

    if (v && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const next = [...digits];
        next[index] = "";
        setDigits(next);
        return;
      }
      if (index > 0) inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const text = e.clipboardData.getData("text");
    const only = text.replace(/\D/g, "").slice(0, 6);
    if (!only) return;

    const next = ["", "", "", "", "", ""];
    for (let i = 0; i < only.length; i++) next[i] = only[i];
    setDigits(next);

    const last = Math.min(only.length - 1, 5);
    inputsRef.current[last]?.focus();
  };

  const handleVerify = async () => {
    try {
      if (!email) {
        showToast("Email not found. Please signup again.", "error");
        navigate("/signup");
        return;
      }

      if (otp.length !== 6) {
        showToast("Enter 6 digit OTP", "error");
        return;
      }

      setLoading(true);

      // ✅ CALL YOUR API HERE
      await verifyOtp({ email, otp });

      showToast("OTP Verified", "success");
      localStorage.removeItem("pendingEmail");
      // setSession(token, user);
      navigate("/dashboard");
    } catch (err) {
      showToast(err?.response?.data?.message || "OTP verification failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      if (!expired) return;

      setLoading(true);

      // ✅ CALL YOUR API HERE
      // await resendOtp({ email });

      showToast("OTP resent ✅", "success");
      setDigits(["", "", "", "", "", ""]);
      setSecondsLeft(OTP_SECONDS);
      inputsRef.current[0]?.focus();
    } catch (err) {
      showToast(err?.response?.data?.message || "Resend failed", "error");
    } finally {
      setLoading(false);
    }
  };

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

        <h2 className="login-title">Verify OTP</h2>
        <p className="login-description">
          Enter the 6-digit code sent to your email
        </p>

        {/* TIMER */}
        <div className="otp-timer">
          {expired ? (
            <span style={{ color: "#991b1b" }}>OTP expired. Please resend.</span>
          ) : (
            <>
              Time left: <span>{formatMMSS(secondsLeft)}</span>
            </>
          )}
        </div>

        {/* OTP INPUT BOXES */}
        <div className="otp-boxes" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              className="otp-input"
              maxLength="1"
              inputMode="numeric"
              value={d}
              ref={(el) => (inputsRef.current[i] = el)}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
            />
          ))}
        </div>

        {/* VERIFY BUTTON */}
        <Button
          title={loading ? "Verifying..." : "Verify OTP"}
          onClick={handleVerify}
          disabled={!canVerify}
          fullWidth
        />

        {/* RESEND */}
        <div className="otp-actions">
          <button
            className="otp-link"
            type="button"
            onClick={handleResend}
            disabled={!expired || loading}
          >
            Resend OTP
          </button>

          <p className="otp-hint">Didn’t receive the code? Check spam folder</p>
        </div>
      </div>
    </div>
  );
};

export default OtpScreen;
