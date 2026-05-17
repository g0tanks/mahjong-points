import { useEffect, useMemo, useState } from 'react';
import HandTray from './HandTray.jsx';
import TileHand from './TileHand.jsx';
import TileImage from './TileImage.jsx';
import TilePalette from './TilePalette.jsx';
import {
  computeAutoScore,
  sortTiles,
} from '../data/autoScore.js';
import {
  getCountedBreakdown,
} from '../data/scoringRules.js';
import './AutoCounter.css';

const WIND_OPTIONS = [
  { id: 'EastWind', label: 'East', seatNumber: 1 },
  { id: 'SouthWind', label: 'South', seatNumber: 2 },
  { id: 'WestWind', label: 'West', seatNumber: 3 },
  { id: 'NorthWind', label: 'North', seatNumber: 4 },
];

function isBonus(t) {
  return t.startsWith('Flowers') || t.startsWith('Seasons');
}

export default function AutoCounter({
  selections,
  setSelections,
  onFinish,
  onCancel,
}) {
  const [handTiles, setHandTiles] = useState([]);
  const [bonusTiles, setBonusTiles] = useState([]);
  const [seatWind, setSeatWind] = useState('EastWind');
  const [roundWind, setRoundWind] = useState('EastWind');
  const [selfDraw, setSelfDraw] = useState(false);

  const handCounts = useMemo(() => {
    const c = {};
    for (const t of handTiles) c[t] = (c[t] || 0) + 1;
    return c;
  }, [handTiles]);

  const bonusCounts = useMemo(() => {
    const c = {};
    for (const t of bonusTiles) c[t] = (c[t] || 0) + 1;
    return c;
  }, [bonusTiles]);

  const [result, setResult] = useState(null);

  // Any change to the hand or settings invalidates the previous calculation,
  // so the user has to click "Calculate score" again to refresh it.
  useEffect(() => {
    setResult(null);
  }, [handTiles, bonusTiles, seatWind, roundWind, selfDraw]);

  // Keep the parent's `selections` in sync once we have a valid result so
  // the existing ResultsPage just renders selections from App state.
  useEffect(() => {
    if (result && result.status === 'ok' && result.selections) {
      setSelections(result.selections);
    }
  }, [result, setSelections]);

  const handleCalculate = () => {
    const computed = computeAutoScore({
      tiles: handTiles,
      flowers: bonusTiles,
      seatWind,
      roundWind,
      selfDraw,
    });
    setResult(computed);
  };

  const breakdown = useMemo(() => {
    if (!result || result.status !== 'ok' || !result.selections) return [];
    return getCountedBreakdown(result.selections);
  }, [result]);

  const handleAdd = (tile) => {
    if (isBonus(tile)) {
      if ((bonusCounts[tile] || 0) >= 1) return;
      setBonusTiles((prev) => [...prev, tile]);
    } else {
      if ((handCounts[tile] || 0) >= 4) return;
      setHandTiles((prev) => [...prev, tile]);
    }
  };

  const handleRemoveHand = (sortedIndex) => {
    const sorted = sortTiles(handTiles);
    const tile = sorted[sortedIndex];
    if (!tile) return;
    setHandTiles((prev) => removeOne(prev, tile));
  };

  const handleRemoveBonus = (sortedIndex) => {
    const sorted = sortTiles(bonusTiles);
    const tile = sorted[sortedIndex];
    if (!tile) return;
    setBonusTiles((prev) => removeOne(prev, tile));
  };

  const handleClear = () => {
    setHandTiles([]);
    setBonusTiles([]);
  };

  const canFinish = !!result && result.status === 'ok';
  const canCalculate = handTiles.length > 0 || bonusTiles.length > 0;

  return (
    <section className="auto-counter" aria-labelledby="auto-counter-title">
      <header className="auto-counter-head">
        <div>
          <span className="section-eyebrow">Auto count</span>
          <h1 id="auto-counter-title">Input hand &amp; auto-score</h1>
        </div>
        <div className="auto-counter-head-actions">
          <button type="button" className="btn btn-ghost" onClick={handleClear}>
            Reset
          </button>
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Exit
          </button>
        </div>
      </header>

      <div className="auto-counter-settings">
        <fieldset className="auto-field">
          <legend>Your seat wind (seat number)</legend>
          <WindPicker
            name="seatWind"
            value={seatWind}
            onChange={setSeatWind}
            showSeatNumber
          />
        </fieldset>
        <fieldset className="auto-field">
          <legend>Round / table wind</legend>
          <WindPicker name="roundWind" value={roundWind} onChange={setRoundWind} />
        </fieldset>
        <label className="auto-toggle">
          <input
            type="checkbox"
            checked={selfDraw}
            onChange={(e) => setSelfDraw(e.target.checked)}
          />
          <span className="auto-toggle-box" aria-hidden="true" />
          <span className="auto-toggle-label">
            I won by self-draw (drew from the wall, not someone's discard).
          </span>
        </label>
      </div>

      <div className="auto-counter-grid">
        <aside className="auto-counter-score">
          <ScorePanel
            result={result}
            breakdown={breakdown}
            handTileCount={handTiles.length}
            bonusTileCount={bonusTiles.length}
          />

          {result && result.status === 'ok' && result.sets && (
            <div className="auto-counter-decomp">
              <span className="auto-counter-eyebrow">
                {result.isThirteen
                  ? 'Thirteen Orphans'
                  : result.isSevenPairs
                  ? 'Seven Pairs'
                  : 'Detected sets'}
              </span>
              <TileHand sets={result.sets} size="sm" showLabels />
            </div>
          )}

          <div className="auto-counter-actions">
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={handleCalculate}
              disabled={!canCalculate}
            >
              {result ? 'Recalculate score' : 'Calculate score'}
            </button>
            <button
              type="button"
              className="btn btn-gold btn-block"
              onClick={onFinish}
              disabled={!canFinish}
            >
              View detailed results
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-block"
              onClick={onCancel}
            >
              Back to overview
            </button>
          </div>

          <p className="auto-counter-disclaimer">
            Auto-scoring assumes a winning hand. House rules vary — confirm
            before recording the final score.
          </p>
        </aside>

        <div className="auto-counter-main">
          <HandTray
            handTiles={handTiles}
            bonusTiles={bonusTiles}
            onRemoveHand={handleRemoveHand}
            onRemoveBonus={handleRemoveBonus}
            onClear={handleClear}
          />
          <TilePalette
            handCounts={handCounts}
            bonusCounts={bonusCounts}
            onAdd={handleAdd}
          />
        </div>
      </div>
    </section>
  );
}

function WindPicker({ name, value, onChange, showSeatNumber = false }) {
  return (
    <div className="auto-wind-picker" role="radiogroup" aria-label={name}>
      {WIND_OPTIONS.map((opt) => {
        const selected = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={selected}
            className={`auto-wind-pick ${selected ? 'is-selected' : ''}`}
            onClick={() => onChange(opt.id)}
          >
            <TileImage tileKey={opt.id} size="xs" decorative />
            <span className="auto-wind-pick-label">
              {opt.label}
              {showSeatNumber && (
                <span className="auto-wind-pick-seat">Seat {opt.seatNumber}</span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ScorePanel({ result, breakdown, handTileCount, bonusTileCount }) {
  const tilesLine = (
    <p className="score-panel-tiles">
      {handTileCount} hand tile{handTileCount === 1 ? '' : 's'}
      {bonusTileCount > 0
        ? ` · ${bonusTileCount} bonus tile${bonusTileCount === 1 ? '' : 's'}`
        : ''}
    </p>
  );

  if (!result) {
    return (
      <div className="score-panel score-panel-info">
        <span className="score-panel-eyebrow">Score</span>
        {tilesLine}
        <p>
          {handTileCount === 0
            ? 'Add tiles to your hand, then click Calculate score.'
            : 'Click Calculate score when you\'re ready.'}
        </p>
      </div>
    );
  }

  if (result.status === 'empty') {
    return (
      <div className="score-panel score-panel-info">
        <span className="score-panel-eyebrow">Score</span>
        {tilesLine}
        <p>No tiles in the hand yet.</p>
      </div>
    );
  }
  if (result.status === 'too_few') {
    return (
      <div className="score-panel score-panel-warn">
        <span className="score-panel-eyebrow">Score</span>
        {tilesLine}
        <p>
          Need {result.missing} more tile{result.missing === 1 ? '' : 's'} to make a
          winning hand (14 minimum).
        </p>
      </div>
    );
  }
  if (result.status === 'too_many') {
    return (
      <div className="score-panel score-panel-warn">
        <span className="score-panel-eyebrow">Score</span>
        {tilesLine}
        <p>
          {result.extra} too many tile{result.extra === 1 ? '' : 's'}. Remove some
          to make a valid hand (14 + 1 per kong, max 18).
        </p>
      </div>
    );
  }
  if (result.status === 'invalid') {
    return (
      <div className="score-panel score-panel-error">
        <span className="score-panel-eyebrow">Score</span>
        {tilesLine}
        <p>
          This hand doesn't form 4 sets + 1 pair, 7 pairs, or Thirteen
          Orphans. Try adjusting your tiles.
        </p>
      </div>
    );
  }

  return (
    <div className="score-panel score-panel-ok">
      <span className="score-panel-eyebrow">Score</span>
      {tilesLine}
      <div className="score-panel-value">
        <span className="score-panel-number">{result.points}</span>
        <span className="score-panel-unit">pts</span>
      </div>
      <span className="score-panel-counted">
        {breakdown.length} rule{breakdown.length === 1 ? '' : 's'} counted
      </span>
      {breakdown.length > 0 && (
        <ul className="score-panel-list">
          {breakdown.map((item, idx) => (
            <li key={`${item.ruleId}-${idx}`} className="score-panel-item">
              <span className="score-panel-item-label">{item.label}</span>
              <span className="score-panel-item-points">
                {item.points > 0 ? `+${item.points}` : item.points}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function removeOne(arr, value) {
  const idx = arr.indexOf(value);
  if (idx < 0) return arr;
  const next = arr.slice();
  next.splice(idx, 1);
  return next;
}
