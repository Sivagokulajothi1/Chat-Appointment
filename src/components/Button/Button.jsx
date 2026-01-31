import "./Button.css";

const Button = ({
  title,
  onClick,
  type = "button",
  disabled = false,
  fullWidth = false,
  icon,
}) => {
  return (
    <button
      type={type}
      className={`btn ${fullWidth ? "btn-full" : ""}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      <span>{title}</span>
      {icon && <span className="btn-icon">{icon}</span>}
    </button>
  );
};

export default Button;
