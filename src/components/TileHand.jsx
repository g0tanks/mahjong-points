import TileImage from './TileImage.jsx';
import './TileHand.css';

const SET_LABEL = {
  chow: 'Chow',
  pung: 'Pung',
  kong: 'Kong',
  pair: 'Pair',
  honors: 'Honors',
  terminals: 'Terminals',
};

export default function TileHand({
  sets,
  size = 'sm',
  showLabels = false,
  ariaLabel,
}) {
  if (!Array.isArray(sets) || sets.length === 0) return null;

  return (
    <div
      className={`tile-hand tile-hand-${size}`}
      aria-label={ariaLabel}
      role={ariaLabel ? 'img' : undefined}
      aria-hidden={ariaLabel ? undefined : true}
    >
      {sets.map((set, setIdx) => {
        const tiles = Array.isArray(set?.tiles) ? set.tiles : [];
        return (
          <div className="tile-hand-set" key={`set-${setIdx}`}>
            <div className="tile-hand-set-tiles">
              {tiles.map((t, i) => (
                <TileImage
                  key={`${setIdx}-${i}`}
                  tileKey={t}
                  size={size}
                  decorative
                />
              ))}
            </div>
            {showLabels && set?.type && (
              <span className="tile-hand-set-label">
                {SET_LABEL[set.type] || set.type}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
