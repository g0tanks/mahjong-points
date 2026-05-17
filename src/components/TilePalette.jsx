import TileImage from './TileImage.jsx';
import { TILES } from '../data/tileAssets.js';
import './TilePalette.css';

const SUIT_GROUPS = [
  { id: 'Bamboo', label: 'Bamboo', tiles: range('Bamboo', 9) },
  { id: 'Circles', label: 'Circles', tiles: range('Circles', 9) },
  { id: 'Characters', label: 'Characters', tiles: range('Characters', 9) },
];
const HONOR_GROUPS = [
  {
    id: 'Winds',
    label: 'Winds',
    tiles: ['EastWind', 'SouthWind', 'WestWind', 'NorthWind'],
  },
  {
    id: 'Dragons',
    label: 'Dragons',
    tiles: ['RedDragon', 'GreenDragon', 'WhiteDragon'],
  },
];
const BONUS_GROUPS = [
  { id: 'Flowers', label: 'Flowers', tiles: range('Flowers', 4) },
  { id: 'Seasons', label: 'Seasons', tiles: range('Seasons', 4) },
];

function range(prefix, n) {
  return Array.from({ length: n }, (_, i) => `${prefix}${i + 1}`);
}

export default function TilePalette({ handCounts, bonusCounts, onAdd }) {
  return (
    <section className="palette" aria-labelledby="palette-title">
      <header className="palette-head">
        <h2 id="palette-title">Tile palette</h2>
        <p>Tap a tile to add it to your hand. Tap again on the hand tray to remove.</p>
      </header>

      <PaletteSection
        title="Flowers & Seasons (bonus)"
        groups={BONUS_GROUPS}
        counts={bonusCounts}
        maxPer={1}
        onAdd={onAdd}
        accent="bonus"
      />
      <PaletteSection
        title="Suits"
        groups={SUIT_GROUPS}
        counts={handCounts}
        maxPer={4}
        onAdd={onAdd}
      />
      <PaletteSection
        title="Honors"
        groups={HONOR_GROUPS}
        counts={handCounts}
        maxPer={4}
        onAdd={onAdd}
      />
    </section>
  );
}

function PaletteSection({ title, groups, counts, maxPer, onAdd, accent }) {
  return (
    <div className={`palette-section ${accent ? `palette-section-${accent}` : ''}`}>
      <h3 className="palette-section-title">{title}</h3>
      <div className="palette-groups">
        {groups.map((g) => (
          <div key={g.id} className="palette-group">
            <span className="palette-group-label">{g.label}</span>
            <div className="palette-tiles">
              {g.tiles.map((t) => {
                const count = counts[t] || 0;
                const disabled = count >= maxPer;
                const altText = TILES[t]?.alt || t;
                return (
                  <button
                    key={t}
                    type="button"
                    className={`palette-tile ${count > 0 ? 'has-count' : ''}`}
                    onClick={() => onAdd(t)}
                    disabled={disabled}
                    aria-label={`Add ${altText}${count ? ` (currently ${count} in hand)` : ''}`}
                  >
                    <TileImage tileKey={t} size="sm" decorative />
                    {count > 0 && (
                      <span className="palette-tile-badge" aria-hidden="true">
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
