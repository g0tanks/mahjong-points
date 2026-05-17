import RulesOverview from './RulesOverview.jsx';
import TileImage from './TileImage.jsx';
import './HomePage.css';

const HERO_TILES = [
  'EastWind',
  'Bamboo1',
  'Circles5',
  'Characters9',
  'RedDragon',
  'GreenDragon',
  'WhiteDragon',
];

export default function HomePage({ onStartManualCount, onStartAutoCount }) {
  return (
    <div className="home-page">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-content">
          <span className="section-eyebrow">麻雀 · Mahjong</span>
          <h1 id="hero-title" className="hero-title">
            Mahjong Point Counter
          </h1>
          <p className="hero-subtitle">
            Learn and count Hong Kong-style mahjong points.
          </p>
          <div className="hero-actions">
            <button
              type="button"
              className="btn btn-primary btn-lg hero-action-primary"
              onClick={onStartManualCount}
            >
              <span className="hero-action-title">
                Manually count points rule-by-rule
              </span>
              <span className="hero-action-sub">Recommended for learning</span>
            </button>
            <button
              type="button"
              className="btn btn-gold btn-lg hero-action-primary"
              onClick={onStartAutoCount}
            >
              <span className="hero-action-title">
                Input hand &amp; automatically count points
              </span>
              <span className="hero-action-sub">Faster — tap tiles to build a hand</span>
            </button>
          </div>
        </div>
        <div className="hero-tiles" aria-hidden="true">
          {HERO_TILES.map((tileKey, idx) => (
            <span
              key={tileKey}
              className="hero-tile"
              style={{
                '--tilt': `${(idx - HERO_TILES.length / 2) * 4}deg`,
                '--lift': `${Math.abs(idx - HERO_TILES.length / 2) * -6}px`,
                '--delay': `${idx * 90}ms`,
              }}
            >
              <TileImage tileKey={tileKey} size="lg" decorative />
            </span>
          ))}
        </div>
      </section>

      <hr className="divider-glow" />

      <RulesOverview />
    </div>
  );
}
