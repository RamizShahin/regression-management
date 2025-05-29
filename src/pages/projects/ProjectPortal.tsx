import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const pieData = [
  { name: "Running", value: 30 },
  { name: "Success", value: 60 },
  { name: "Unknown", value: 20 },
];

const COLORS = ["#a78bfa", "#34d399", "#fbbf24"];

const barData = [
  { month: "Jan", Success: 50, Failed: 30, Unknown: 20 },
  { month: "Feb", Success: 60, Failed: 20, Unknown: 20 },
  { month: "Mar", Success: 70, Failed: 15, Unknown: 15 },
  { month: "Apr", Success: 80, Failed: 10, Unknown: 10 },
  { month: "May", Success: 90, Failed: 5, Unknown: 5 },
];

const lineData = [
  { date: "Jan 1", value: 10 },
  { date: "Jan 8", value: 40 },
  { date: "Jan 15", value: 70 },
  { date: "Jan 22", value: 50 },
  { date: "Jan 29", value: 65 },
];

const styles = {
  container: {
    padding: "24px",
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "24px",
  },
  card: {
    background: "#1e1e2f",
    borderRadius: "12px",
    padding: "20px",
    color: "#fff",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    fontSize: "18px",
    fontWeight: "bold",
  },
  textItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
  },
  statusPassed: { color: "#34d399" },
  statusFailed: { color: "#f87171" },
  statusPending: { color: "#fbbf24" },
  button: {
    backgroundColor: "#7c3aed",
    color: "white",
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
  },
};

const ProjectPortal = () => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <PieChart width={250} height={250}>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </div>

      <div style={styles.card}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Success" fill="#34d399" />
            <Bar dataKey="Failed" fill="#f87171" />
            <Bar dataKey="Unknown" fill="#fbbf24" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={styles.card}>
        <h3 style={styles.sectionHeader}>Team Progress</h3>
        <div>
          <p>John Carter – 60%</p>
          <p>Sophie Moore – 53%</p>
          <p>Matt Carson – 75%</p>
        </div>
      </div>

      <div style={styles.card}>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={lineData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#60a5fa"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={styles.card}>
        <div style={styles.sectionHeader}>
          <span>Components</span>
          <button style={styles.button}>Create Component</button>
        </div>
        <div>
          <div style={styles.textItem}>
            <span>Sub – John Carter</span>
            <span style={styles.statusPassed}>Passed</span>
          </div>
          <div style={styles.textItem}>
            <span>Core – Sophie Moore</span>
            <span style={styles.statusFailed}>Failed</span>
          </div>
          <div style={styles.textItem}>
            <span>Infra – Matt Carson</span>
            <span style={styles.statusPending}>Pending</span>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.sectionHeader}>
          <span>Regressions</span>
          <button style={styles.button}>Create Regression</button>
        </div>
        <div>
          <div style={styles.textItem}>
            <span>#3122 – John Carter</span>
            <span>81%</span>
          </div>
          <div style={styles.textItem}>
            <span>#3123 – Sophie Moore</span>
            <span>65%</span>
          </div>
          <div style={styles.textItem}>
            <span>#3124 – Matt Carson</span>
            <span>79%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPortal;
