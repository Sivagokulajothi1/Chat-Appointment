import React from 'react';
import './AnalyticsDonutChart.css';

const AnalyticsDonutChart = ({ title, subtitle, data }) => {
    return (
        <div className="analytics-donut-chart">
            <div className="chart-header">
                <h3>{title}</h3>
                <p>{subtitle}</p>
            </div>

            <div className="donut-container">
                <div className="donut-graphic">
                    <div className="donut-center">
                        <span className="donut-value">65%</span>
                        <span className="donut-label">WHATSAPP</span>
                    </div>
                </div>
            </div>

            <div className="donut-stats">
                {data.map((item, index) => (
                    <div key={index} className="donut-stat-item">
                        <div className="stat-left">
                            <span className="stat-dot" style={{ backgroundColor: item.color }}></span>
                            <span className="stat-name">{item.name}</span>
                        </div>
                        <span className="stat-value">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnalyticsDonutChart;
