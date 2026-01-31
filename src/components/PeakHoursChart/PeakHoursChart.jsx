import React from 'react';
import './PeakHoursChart.css';

const PeakHoursChart = ({ title, subtitle }) => {
    // Mock data for 24 hours
    const hoursData = [
        10, 8, 5, 4, 3, 2, 15, 45, 80, 100, 95, 90, 85, 88, 92, 100, 95, 80, 60, 40, 25, 20, 15, 12
    ];

    return (
        <div className="peak-hours-chart">
            <div className="chart-header">
                <div className="header-left">
                    <h3>{title}</h3>
                    <p>{subtitle}</p>
                </div>
                <div className="header-right">
                    <span className="legend-label">LOW</span>
                    <div className="legend-gradient"></div>
                    <span className="legend-label">HIGH</span>
                </div>
            </div>

            <div className="heatmap-container">
                <div className="heatmap-bars">
                    {hoursData.map((density, index) => (
                        <div
                            key={index}
                            className="hour-bar"
                            style={{ opacity: 0.1 + (density / 100) * 0.9 }}
                            title={`${index}:00 - Density: ${density}%`}
                        ></div>
                    ))}
                </div>
                <div className="heatmap-labels">
                    <span>12 AM</span>
                    <span>6 AM</span>
                    <span>12 PM</span>
                    <span>6 PM</span>
                    <span>11 PM</span>
                </div>
            </div>
        </div>
    );
};

export default PeakHoursChart;
