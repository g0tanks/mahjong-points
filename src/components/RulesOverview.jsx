import RuleCard from './RuleCard.jsx';
import { CATEGORY_LABELS, CATEGORY_ORDER, SCORING_RULES } from '../data/scoringRules.js';
import './RulesOverview.css';

export default function RulesOverview() {
  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    rules: SCORING_RULES.filter((rule) => rule.category === category),
  }));

  return (
    <section className="rules-overview" aria-labelledby="rules-overview-title">
      <header className="rules-overview-head">
        <span className="section-eyebrow">Scoring rules</span>
        <h2 id="rules-overview-title">All the scoring patterns</h2>
      </header>

      <div className="rules-overview-groups">
        {grouped.map(({ category, rules }) => (
          <div key={category} className="rules-overview-group">
            <header className="rules-group-head">
              <span className={`tag tag-${category}`}>{CATEGORY_LABELS[category]}</span>
              <h3>{CATEGORY_LABELS[category]}</h3>
            </header>
            <div className="rules-grid">
              {rules.map((rule) => (
                <RuleCard key={rule.id} rule={rule} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
