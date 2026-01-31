import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const data = [
  { day: "Mon", value: 20 },
  { day: "Tue", value: 30 },
  { day: "Wed", value: 25 },
  { day: "Thu", value: 45 },
  { day: "Fri", value: 35 },
  { day: "Sat", value: 60 },
  { day: "Sun", value: 50 },
];

const AppointmentTrend = () => {
  return (
    <div className="chart-card">
      <h3>Appointment Trend</h3>
      <p className="sub">Weekly overview</p>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
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
    </div>
  );
};

export default AppointmentTrend;
