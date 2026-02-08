import "./ActivityItem.css";

const ActivityItem = ({ icon: Icon, text, time, bgColor, iconColor, }) => {
  return (
    <div className="activity-item"  style={{  }}>
      <div className="activity-icon" style={{color: iconColor,backgroundColor: bgColor }} >
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
