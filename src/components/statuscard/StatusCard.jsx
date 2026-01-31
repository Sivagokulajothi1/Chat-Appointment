import "./StatusCard.css";

const StatCard = ({
  title,
  value,
  change,
  subtitle,
  icon: Icon,
  color = "#16a34a",
}) => {
  return (
    <div className="stat-card">
      <div className="stat-accent" style={{ backgroundColor: color }} />

      <div className="stat-content">
        <div className="stat-header">
          <span className="stat-title">{title}</span>
          {Icon && <Icon className="stat-icon" style={{ color }} />}
        </div>

        <div className="stat-value" style={{ color }}>
          {value}
        </div>

        <div className="stat-footer">
          <span className="stat-change" style={{ color }}>
            {change}
          </span>
          <span className="stat-subtitle">{subtitle}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
