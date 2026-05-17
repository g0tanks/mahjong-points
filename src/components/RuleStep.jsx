import TileHand from './TileHand.jsx';
import TileImage from './TileImage.jsx';
import './RuleStep.css';

const CATEGORY_LABELS = {
  small: 'Small',
  medium: 'Medium',
  big: 'Big',
};

export default function RuleStep({ rule, value, onChange }) {
  const isMulti = rule.type === 'multiSelect';

  const toggleMulti = (optionId) => {
    const current = Array.isArray(value) ? value : [];
    const exists = current.includes(optionId);
    const next = exists
      ? current.filter((id) => id !== optionId)
      : [...current, optionId];
    onChange(next);
  };

  return (
    <article className={`rule-step rule-step-${rule.category}`}>
      <header className="rule-step-head">
        <span className={`tag tag-${rule.category}`}>
          {CATEGORY_LABELS[rule.category]} hand
        </span>
        <span className="rule-step-points">
          <span className="rule-step-points-value">{rule.pointsLabel}</span>
          <span className="rule-step-points-unit">points</span>
        </span>
      </header>

      <h2 className="rule-step-title">{rule.name}</h2>
      <p className="rule-step-desc">{rule.description}</p>

      <div className="rule-step-check">
        <span className="rule-step-check-eyebrow">How to check</span>
        <p>{rule.beginnerCheckInstructions}</p>
      </div>

      {rule.exampleHand && rule.exampleHand.length > 0 && !isMulti && (
        <div className="rule-step-hand">
          <span className="rule-step-hand-eyebrow">Example hand</span>
          <TileHand
            sets={rule.exampleHand}
            size="md"
            showLabels
            ariaLabel="Example winning hand for this rule"
          />
        </div>
      )}

      {(!rule.exampleHand || rule.exampleHand.length === 0) &&
        rule.tileExamples &&
        rule.tileExamples.length > 0 &&
        !isMulti && (
          <div className="rule-step-tiles" aria-label="Tile example">
            {rule.tileExamples.slice(0, 8).map((tileKey, idx) => (
              <TileImage
                key={`${rule.id}-ex-${idx}`}
                tileKey={tileKey}
                size="md"
                decorative
              />
            ))}
          </div>
        )}

      {rule.note && <p className="rule-step-note">{rule.note}</p>}

      {isMulti ? (
        <fieldset className="rule-step-options">
          <legend className="sr-only">{rule.name}</legend>
          {rule.options.map((option) => {
            const current = Array.isArray(value) ? value : [];
            const checked = current.includes(option.id);
            return (
              <button
                key={option.id}
                type="button"
                className={`rule-option ${checked ? 'is-checked' : ''}`}
                onClick={() => toggleMulti(option.id)}
                aria-pressed={checked}
              >
                <TileImage tileKey={option.tile} size="md" decorative />
                <span className="rule-option-text">
                  <span className="rule-option-label">{option.label}</span>
                  <span className="rule-option-points">+{option.points}</span>
                </span>
                <span className="rule-option-check" aria-hidden="true">
                  {checked ? '✓' : ''}
                </span>
              </button>
            );
          })}
          <p className="rule-step-multihint">
            Tap each pung you have. Tap again to remove.
          </p>
        </fieldset>
      ) : (
        <div className="rule-step-actions">
          <button
            type="button"
            className={`btn btn-jade choice-btn ${value === true ? 'is-selected' : ''}`}
            onClick={() => onChange(true)}
            aria-pressed={value === true}
          >
            <span className="choice-btn-icon" aria-hidden="true">
              ✓
            </span>
            Yes, add this
          </button>
          <button
            type="button"
            className={`btn btn-ghost choice-btn ${value === false ? 'is-selected' : ''}`}
            onClick={() => onChange(false)}
            aria-pressed={value === false}
          >
            <span className="choice-btn-icon" aria-hidden="true">
              ✕
            </span>
            No, skip
          </button>
        </div>
      )}
    </article>
  );
}
