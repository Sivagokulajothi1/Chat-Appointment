import "./ActivityItem.css";

const ActivityItem = ({ icon: Icon, text, time }) => {
  return (
    <div className="activity-item">
      <div className="activity-icon">
        {Icon && <Icon />}
      </div>

      <div className="activity-content">
        <p className="activity-text">{text}</p>
        <span className="activity-time">{time}</span>
      </div>
    </div>
  );
};

export default ActivityItem;
