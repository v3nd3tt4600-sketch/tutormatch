export default function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="stat-card card">
      <span className="stat-icon">
        <Icon size={20} />
      </span>
      <div>
        <p className="stat-value">{value}</p>
        <p className="stat-label">{label}</p>
      </div>
    </div>
  );
}
