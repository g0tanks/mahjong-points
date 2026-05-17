import { useMemo } from 'react';
import TileImage from './TileImage.jsx';
import {
  getCountedBreakdown,
  getTotalPoints,
} from '../data/scoringRules.js';
import './ResultsPage.css';

export default function ResultsPage({
  selections,
  onCountAnother,
  onBackToRules,
}) {
  const total = useMemo(() => getTotalPoints(selections), [selections]);
  const counted = useMemo(
    () => getCountedBreakdown(selections),
    [selections],
  );

  return (
    <section className="results-page" aria-labelledby="results-title">
      <header className="results-head">
        <span className="section-eyebrow">Final score</span>
        <h1 id="results-title" className="results-total">
          <span className="results-total-number">{total}</span>
          <span className="results-total-unit">points</span>
        </h1>
        <p className="results-sub">
          {counted.length === 0
            ? 'No scoring rules counted. This may be a chicken hand.'
            : `You counted ${counted.length} rule${counted.length === 1 ? '' : 's'}.`}
        </p>
      </header>

      <div className="results-card">
        <h2 className="results-section-title">Breakdown</h2>
        {counted.length === 0 ? (
          <p className="results-empty">
            Nothing was added this round. Mahjong scoring varies — check the
            rules overview if you think something should have counted.
          </p>
        ) : (
          <ul className="results-list">
            {counted.map((item, idx) => (
              <li key={`${item.ruleId}-${item.label}-${idx}`} className="results-item">
                <span className="results-item-tile" aria-hidden="true">
                  {item.tile ? (
                    <TileImage tileKey={item.tile} size="sm" decorative />
                  ) : (
                    <span className="results-item-dot" />
                  )}
                </span>
                <span className="results-item-label">{item.label}</span>
                <span
                  className={`results-item-points ${
                    item.points === 0 ? 'is-zero' : ''
                  }`}
                >
                  {item.points > 0 ? `+${item.points}` : item.points}
                </span>
              </li>
            ))}
            <li className="results-item results-item-total">
              <span className="results-item-label">Total</span>
              <span className="results-item-points results-item-points-total">
                {total}
              </span>
            </li>
          </ul>
        )}
      </div>

      <p className="results-note">
        Always confirm house rules before playing — mahjong scoring varies by
        table.
      </p>

      <div className="results-actions">
        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={onCountAnother}
        >
          Count another hand
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-lg"
          onClick={onBackToRules}
        >
          Back to rules overview
        </button>
      </div>
    </section>
  );
}
