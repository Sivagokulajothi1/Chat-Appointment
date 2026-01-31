import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/input.css";

const Input = ({
  label,
  rightLabel,
  type = "text",
  placeholder,
  value,
  onChange,
  disabled = false,
  name,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  return (
    <div className="input-group">
      {(label || rightLabel) && (
        <div className="label-wrapper">
          {label && <label className="input-label">{label}</label>}
          {rightLabel}
        </div>
      )}

      <div className="input-wrapper">
        <input
          type={inputType}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          disabled={disabled}
          className={`custom-input ${isPassword ? "has-icon" : ""}`}
        />
        {isPassword && (
          <button
            type="button"
            className="password-toggle"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
