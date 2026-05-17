import TileImage from './TileImage.jsx';
import './Header.css';

export default function Header({ currentLabel, onHome, showHomeAction }) {
  return (
    <header className="site-header">
      <button
        type="button"
        className="brand"
        onClick={onHome}
        aria-label="Back to home"
      >
        <span className="brand-mark" aria-hidden="true">
          <TileImage tileKey="RedDragon" size="sm" decorative />
        </span>
        <span className="brand-text">
          <span className="brand-name">Mahjong Point Counter</span>
          <span className="brand-tagline">Hong Kong-style scoring made simple</span>
        </span>
      </button>
      <div className="header-meta">
        <span className="header-crumb" aria-live="polite">
          {currentLabel}
        </span>
        {showHomeAction && (
          <button
            type="button"
            className="btn btn-ghost header-home-btn"
            onClick={onHome}
          >
            Home
          </button>
        )}
      </div>
    </header>
  );
}
