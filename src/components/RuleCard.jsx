import TileHand from './TileHand.jsx';
import TileImage from './TileImage.jsx';
import './RuleCard.css';

const CATEGORY_LABELS = {
  small: 'Small',
  medium: 'Medium',
  big: 'Big',
};

export default function RuleCard({ rule }) {
  const exampleHand = Array.isArray(rule.exampleHand) ? rule.exampleHand : null;
  const examples = exampleHand ? [] : (rule.tileExamples || []).slice(0, 8);

  return (
    <article className={`rule-card rule-card-${rule.category}`}>
      <header className="rule-card-head">
        <span className={`tag tag-${rule.category}`}>
          {CATEGORY_LABELS[rule.category]} hand
        </span>
        <span className="rule-card-points" aria-label={`${rule.pointsLabel} points`}>
          {rule.pointsLabel}
        </span>
      </header>
      <h3 className="rule-card-name">{rule.name}</h3>
      <p className="rule-card-desc">{rule.description}</p>

      {exampleHand && (
        <div className="rule-card-hand">
          <span className="rule-card-hand-eyebrow">Example hand</span>
          <TileHand sets={exampleHand} size="sm" showLabels />
        </div>
      )}

      {!exampleHand && examples.length > 0 && (
        <div className="rule-card-tiles" aria-hidden="true">
          {examples.map((tileKey, idx) => (
            <TileImage
              key={`${rule.id}-${tileKey}-${idx}`}
              tileKey={tileKey}
              size="sm"
              decorative
            />
          ))}
        </div>
      )}

      {rule.type === 'multiSelect' && (
        <p className="rule-card-hint">Each set adds its own points.</p>
      )}
    </article>
  );
}
