import TileImage from './TileImage.jsx';
import { TILES } from '../data/tileAssets.js';
import { sortTiles } from '../data/autoScore.js';
import './HandTray.css';

export default function HandTray({
  handTiles,
  bonusTiles,
  onRemoveHand,
  onRemoveBonus,
  onClear,
}) {
  const sortedHand = sortTiles(handTiles);
  const sortedBonus = sortTiles(bonusTiles);
  const handCount = handTiles.length;
  const bonusCount = bonusTiles.length;

  return (
    <section className="hand-tray" aria-labelledby="hand-tray-title">
      <header className="hand-tray-head">
        <div>
          <h2 id="hand-tray-title">Your hand</h2>
          <p className="hand-tray-count">
            {handCount} tile{handCount === 1 ? '' : 's'} in hand
            {bonusCount > 0
              ? ` · ${bonusCount} bonus tile${bonusCount === 1 ? '' : 's'}`
              : ''}
          </p>
        </div>
        {(handCount > 0 || bonusCount > 0) && (
          <button type="button" className="btn btn-ghost hand-tray-clear" onClick={onClear}>
            Clear hand
          </button>
        )}
      </header>

      <div className="hand-tray-area" aria-label="Hand tiles">
        {sortedHand.length === 0 ? (
          <p className="hand-tray-empty">
            Tap tiles in the palette below to start building your hand.
          </p>
        ) : (
          <div className="hand-tray-tiles">
            {sortedHand.map((t, idx) => {
              const altText = TILES[t]?.alt || t;
              return (
                <button
                  key={`hand-${idx}-${t}`}
                  type="button"
                  className="hand-tray-tile"
                  onClick={() => onRemoveHand(idx)}
                  aria-label={`Remove ${altText}`}
                  title={`Remove ${altText}`}
                >
                  <TileImage tileKey={t} size="md" decorative />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {sortedBonus.length > 0 && (
        <div className="hand-tray-bonus" aria-label="Bonus tiles">
          <span className="hand-tray-bonus-eyebrow">Bonus</span>
          <div className="hand-tray-tiles">
            {sortedBonus.map((t, idx) => {
              const altText = TILES[t]?.alt || t;
              return (
                <button
                  key={`bonus-${idx}-${t}`}
                  type="button"
                  className="hand-tray-tile hand-tray-tile-bonus"
                  onClick={() => onRemoveBonus(idx)}
                  aria-label={`Remove ${altText}`}
                  title={`Remove ${altText}`}
                >
                  <TileImage tileKey={t} size="sm" decorative />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
