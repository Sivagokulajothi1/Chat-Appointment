import React, { useState, useEffect, useCallback } from "react";
import {
  FaCheckCircle, FaClock, FaCalendarCheck, FaTimesCircle,
  FaTimes, FaCheck, FaSearch, FaSyncAlt, FaBell
} from "react-icons/fa";

import StatCard from "../../components/statuscard/StatusCard";
import ActivityItem from "../../components/ActivityItem/ActivityItem";
import AppointmentMonitor from "../../components/AppointmentMonitor/AppointmentMonitor";
import AppointmentTrend from "../../components/AppointmentTrend/AppointmentTrend";
import { getDashboardStats, getRealtimeActivity } from "../../services/dashboard.service";
import "./dashboard.css";

// Icon + color config per activity status
const ACTIVITY_CONFIG = {
  confirmed: { icon: FaCheck, bgColor: "#b7f7d1", iconColor: "#16a34a" },
  cancelled: { icon: FaTimes, bgColor: "#eca8a8", iconColor: "#f10101" },
  rescheduled: { icon: FaClock, bgColor: "#aa63f7", iconColor: "#1000f0" },
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingActivity, setLoadingActivity] = useState(true);

  // Fetch stats cards
  const fetchStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      const res = await getDashboardStats();
      setStats(res.data);
    } catch {
      setStats(null);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Fetch real-time activity feed
  const fetchActivity = useCallback(async () => {
    try {
      setLoadingActivity(true);
      const res = await getRealtimeActivity(10);
      setActivity(res.data.activity || []);
    } catch {
      setActivity([]);
    } finally {
      setLoadingActivity(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchActivity();

    // Auto-refresh activity every 30 seconds
    const interval = setInterval(fetchActivity, 30000);
    return () => clearInterval(interval);
  }, [fetchStats, fetchActivity]);

  const handleRefresh = () => {
    fetchStats();
    fetchActivity();
  };

  const formatChange = (pct) => {
    if (pct === undefined || pct === null) return null;
    return pct >= 0 ? `+${pct}%` : `${pct}%`;
  };

  return (
    <div className="dashboard">
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
              <button className="refresh-button" onClick={handleRefresh}>
                <FaSyncAlt className="refresh-icon" /> Refresh
              </button>
              <button className="notification-bell">
                <FaBell />
              </button>
            </div>
          </div>

          {/* Stats Cards — live from /api/dashboard/stats */}
          <div className="dashboard-top">
            <StatCard
              title="Confirmation"
              value={loadingStats ? "..." : stats?.confirmed?.count ?? 0}
              change={!loadingStats ? formatChange(stats?.confirmed?.changePercent) : null}
              subtitle="vs last week"
              icon={FaCheckCircle}
              color="#16a34a"
            />
            <StatCard
              title="Pending / Booked"
              value={loadingStats ? "..." : stats?.pending?.count ?? 0}
              change={!loadingStats ? formatChange(stats?.pending?.changePercent) : null}
              subtitle="vs last week"
              icon={FaClock}
              color="#f59e0b"
            />
            <StatCard
              title="Cancelled"
              value={loadingStats ? "..." : stats?.cancelled?.count ?? 0}
              change={!loadingStats ? formatChange(stats?.cancelled?.changePercent) : null}
              subtitle="vs last week"
              icon={FaTimesCircle}
              color="#dc2626"
            />
            <StatCard
              title="Rescheduled"
              value={loadingStats ? "..." : stats?.rescheduled?.count ?? 0}
              change={!loadingStats ? formatChange(stats?.rescheduled?.changePercent) : null}
              subtitle="vs last week"
              icon={FaCalendarCheck}
              color="#2563eb"
            />
          </div>

          {/* Trend Chart — live from /api/dashboard/trend */}
          <div className="dashboard-chart">
            <AppointmentTrend />
          </div>

          {/* Appointment Monitoring Table — live from /api/dashboard/appointments */}
          <AppointmentMonitor />
        </div>

        {/* RIGHT – 20% */}
        <div className="dashboard-right">
          <h3>Real-time Activity</h3>

          <div className="activity-list">
            {loadingActivity && <p style={{ padding: 8 }}>Loading...</p>}

            {!loadingActivity && activity.length === 0 && (
              <p style={{ padding: 8, color: "#888" }}>No recent activity</p>
            )}

            {!loadingActivity && activity.map((item) => {
              const cfg = ACTIVITY_CONFIG[item.status] || ACTIVITY_CONFIG.confirmed;
              return (
                <ActivityItem
                  key={item.id}
                  icon={cfg.icon}
                  text={item.actionText}
                  time={item.timeAgo}
                  bgColor={cfg.bgColor}
                  iconColor={cfg.iconColor}
                />
              );
            })}
          </div>

          <div className="automation-stats-card">
            <div className="stats-header">
              <span className="stats-title">
                <FaSyncAlt className="spark-icon" /> AUTOMATION STATS
              </span>
            </div>
            <div className="stats-body">
              <div className="stats-row">
                <span>WhatsApp Delivered</span>
                <span className="stats-percentage">98.2%</span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: "98.2%" }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
