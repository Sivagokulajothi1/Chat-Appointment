import React from 'react';
import './AnalyticsCard.css';

const AnalyticsCard = ({ label, value, change, isPositive, icon: Icon, color }) => {
    return (
        <div className="analytics-card">
            <div className="card-top">
                <span className="card-label">{label}</span>
                {Icon && <Icon className="card-icon" style={{ color: color }} />}
            </div>
            <div className="card-bottom">
                <h2 className="card-value">{value}</h2>
                <span className={`card-change ${isPositive ? 'positive' : 'negative'}`}>
                    {isPositive ? '+' : ''}{change}
                </span>
            </div>
        </div>
    );
};

export default AnalyticsCard;
