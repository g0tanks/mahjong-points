import './RunningTotal.css';

export default function RunningTotal({ total, lastDelta, countedRules }) {
  return (
    <aside className="running-total" aria-live="polite">
      <div className="running-total-inner">
        <div className="running-total-meta">
          <span className="running-total-eyebrow">Running total</span>
          <span className="running-total-counted">
            {countedRules} rule{countedRules === 1 ? '' : 's'} counted
          </span>
        </div>
        <div className="running-total-value">
          <span className="running-total-number">{total}</span>
          <span className="running-total-unit">pts</span>
        </div>
        {typeof lastDelta === 'number' && lastDelta !== 0 && (
          <div
            key={`${total}-${lastDelta}`}
            className={`running-total-delta ${lastDelta > 0 ? 'positive' : 'negative'}`}
          >
            {lastDelta > 0 ? `+${lastDelta}` : lastDelta}
          </div>
        )}
      </div>
    </aside>
  );
}
