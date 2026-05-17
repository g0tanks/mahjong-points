import './ProgressBar.css';

export default function ProgressBar({ current, total, label }) {
  const safeTotal = Math.max(total, 1);
  const safeCurrent = Math.min(Math.max(current, 0), safeTotal);
  const pct = Math.round((safeCurrent / safeTotal) * 100);

  return (
    <div
      className="progress"
      role="progressbar"
      aria-valuenow={safeCurrent}
      aria-valuemin={0}
      aria-valuemax={safeTotal}
      aria-label={label || 'Progress'}
    >
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="progress-meta">
        <span>{label || `Step ${safeCurrent} of ${safeTotal}`}</span>
        <span className="progress-pct">{pct}%</span>
      </div>
    </div>
  );
}
