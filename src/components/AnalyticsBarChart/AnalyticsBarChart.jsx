import React from 'react';
import './AnalyticsBarChart.css';

const AnalyticsBarChart = ({ title, subtitle, total, data }) => {
    return (
        <div className="analytics-bar-chart">
            <div className="chart-header">
                <div className="header-left">
                    <h3>{title}</h3>
                    <p>{subtitle}</p>
                </div>
                <div className="header-right">
                    <span className="total-value">{total}</span>
                    <span className="total-label">TOTAL</span>
                </div>
            </div>

            <div className="bar-container">
                {data.map((item, index) => (
                    <div key={index} className="bar-item">
                        <div className="bar-wrapper">
                            <div
                                className="bar-fill"
                                style={{
                                    height: `${(item.value / 600) * 100}%`,
                                    backgroundColor: item.color
                                }}
                            >
                                <span className="bar-value">{item.value}</span>
                            </div>
                        </div>
                        <span className="bar-label">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnalyticsBarChart;
