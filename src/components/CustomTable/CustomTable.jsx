import React from 'react';
import './CustomTable.css';

const CustomTable = ({ headers, data, renderRow }) => {
    return (
        <div className="custom-table-container">
            <table className="custom-table">
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => renderRow(item, index))}
                </tbody>
            </table>
        </div>
    );
};

export default CustomTable;
