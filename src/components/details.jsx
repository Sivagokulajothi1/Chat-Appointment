import './details.css'

const Detail = ({ label, value }) => (
  <div className="detail-row">
    <span className="detail-label">{label}</span>
    <span className="detail-value">{value || "-"}</span>
  </div>
);

export default Detail;