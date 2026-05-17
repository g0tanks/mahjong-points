import { useState } from 'react';
import { getTile } from '../data/tileAssets.js';
import './TileImage.css';

export default function TileImage({
  tileKey,
  size = 'md',
  fallbackLabel,
  decorative = false,
}) {
  const tile = getTile(tileKey);
  const [errored, setErrored] = useState(false);
  const showPlaceholder = !tile || errored;

  const classes = ['tile', `tile-${size}`];
  if (showPlaceholder) classes.push('tile-placeholder');

  if (showPlaceholder) {
    const label = fallbackLabel || (tile && tile.shortLabel) || tileKey || '?';
    return (
      <span className={classes.join(' ')} aria-hidden={decorative || undefined}>
        <span className="tile-placeholder-label">{label}</span>
      </span>
    );
  }

  return (
    <span className={classes.join(' ')}>
      <img
        src={tile.src}
        alt={decorative ? '' : tile.alt}
        aria-hidden={decorative || undefined}
        draggable={false}
        loading="lazy"
        onError={() => setErrored(true)}
      />
    </span>
  );
}
