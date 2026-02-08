import {
  FaCheckCircle,
  FaClock,
  FaCalendarCheck,
  FaTimesCircle,
  FaTimes,
  FaCheck,
  FaSearch,
  FaSyncAlt,
  FaBell
} from "react-icons/fa";

import StatCard from "../../components/statuscard/StatusCard";
import ActivityItem from "../../components/ActivityItem/ActivityItem";
import AppointmentMonitor from "../../components/AppointmentMonitor/AppointmentMonitor";
import AppointmentTrend from "../../components/AppointmentTrend/AppointmentTrend";
import "./dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard">

      {/* 🔹 SINGLE CONTAINER */}
      <div className="dashboard-container">

        {/* LEFT – 80% */}
        <div className="dashboard-left">
          <div className="dashboard-header-section">
            <h2 className="dashboard-title">Comprehensive Overview</h2>
            <div className="header-controls">
              <div className="header-search">
                <FaSearch className="search-icon" />
                <input type="text" placeholder="Search patient name" />
              </div>
              <div className="live-sync-indicator">
                <span className="sync-dot"></span>
                LIVE SYNCING
              </div>
              <button className="refresh-button">
                <FaSyncAlt className="refresh-icon" /> Refresh
              </button>
              <button className="notification-bell">
                <FaBell />
              </button>
            </div>
          </div>
          <div className="dashboard-top">
            <StatCard
              title="Confirmation"
              value={42}
              change="+12%"
              subtitle="vs last week"
              icon={FaCheckCircle}
              color="#16a34a"
            />

            <StatCard
              title="Pending / Booked"
              value={18}
              change="+5%"
              subtitle="vs last week"
              icon={FaClock}
              color="#f59e0b"
            />

            <StatCard
              title="Cancelled"
              value={6}
              change="-3%"
              subtitle="vs last week"
              icon={FaTimesCircle}
              color="#dc2626"
            />

            <StatCard
              title="Rescheduled"
              value={9}
              change="+2%"
              subtitle="vs last week"
              icon={FaCalendarCheck}
              color="#2563eb"
            />
          </div>
          <div className="dashboard-chart">
            <AppointmentTrend />
          </div>

          <AppointmentMonitor />
        </div>

        {/* RIGHT – 20% */}
        <div className="dashboard-right">
          <h3>Real-time Activity</h3>

          <div className="activity-list">
            <ActivityItem
              icon={FaCheck}
              text="A Vinothini confirmed appointment"
              time="2 minutes ago"
              bgColor="#b7f7d1"
              iconColor="#16a34a"
            />

            <ActivityItem
              icon={FaTimes}
              text="Siva cancelled slot with Dr. Mithun"
              time="15 minutes ago"
              bgColor="#eca8a8"
              iconColor="#f10101"
            />

            <ActivityItem
              icon={FaClock}
              text="Sarvesh.S rescheduled to 4 PM"
              time="1 hour ago"
              bgColor="#aa63f7"
              iconColor="#1000f0"
            />
          </div>

          <div className="automation-stats-card">
            <div className="stats-header">
              <span className="stats-title"><FaSyncAlt className="spark-icon" /> AUTOMATION STATS</span>
            </div>
            <div className="stats-body">
              <div className="stats-row">
                <span>WhatsApp Delivered</span>
                <span className="stats-percentage">98.2%</span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: '98.2%' }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
