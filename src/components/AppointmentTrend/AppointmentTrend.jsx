import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import { getAppointmentTrend } from '../../services/dashboard.service';

const AppointmentTrend = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrend = async () => {
      try {
        const res = await getAppointmentTrend();
        const { labels, data } = res.data;
        const formatted = labels.map((day, i) => ({ day, value: data[i] || 0 }));
        setChartData(formatted);
      } catch (err) {
        // fallback empty
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTrend();
  }, []);

  return (
    <div className="chart-card">
      <h3>Appointment Trend</h3>
      <p className="sub">Weekly overview</p>

      {loading ? (
        <p style={{ padding: 16 }}>Loading chart...</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="day" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#14b8a6"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default AppointmentTrend;
