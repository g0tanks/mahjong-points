import { useEffect, useMemo, useRef, useState } from 'react';
import ProgressBar from './ProgressBar.jsx';
import RuleStep from './RuleStep.jsx';
import RunningTotal from './RunningTotal.jsx';
import {
  SCORING_RULES,
  getCountedBreakdown,
  getTotalPoints,
} from '../data/scoringRules.js';
import './ManualCounter.css';

export default function ManualCounter({
  selections,
  setSelections,
  onFinish,
  onCancel,
  onRestart,
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [lastDelta, setLastDelta] = useState(0);
  const [showChickenWarning, setShowChickenWarning] = useState(false);
  const autoAdvanceTimerRef = useRef(null);

  const clearAutoAdvance = () => {
    if (autoAdvanceTimerRef.current !== null) {
      window.clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  };

  useEffect(() => clearAutoAdvance, []);

  const total = useMemo(() => getTotalPoints(selections), [selections]);
  const counted = useMemo(
    () => getCountedBreakdown(selections),
    [selections],
  );

  const rule = SCORING_RULES[stepIndex];
  const isLast = stepIndex === SCORING_RULES.length - 1;

  useEffect(() => {
    if (lastDelta === 0) return undefined;
    const timer = window.setTimeout(() => setLastDelta(0), 1200);
    return () => window.clearTimeout(timer);
  }, [lastDelta]);

  useEffect(() => {
    const chickenSelected = selections.chickenHand === true;
    const otherScoringCounted = counted.some(
      (item) => item.ruleId !== 'chickenHand' && item.points > 0,
    );
    setShowChickenWarning(chickenSelected && otherScoringCounted);
  }, [selections, counted]);

  const handleSelectionChange = (nextValue) => {
    const prevTotal = total;
    setSelections((prev) => {
      const next = { ...prev, [rule.id]: nextValue };
      const nextTotal = getTotalPoints(next);
      setLastDelta(nextTotal - prevTotal);
      return next;
    });

    if (rule.type === 'boolean') {
      clearAutoAdvance();
      const wasLast = isLast;
      autoAdvanceTimerRef.current = window.setTimeout(() => {
        autoAdvanceTimerRef.current = null;
        if (wasLast) {
          onFinish();
        } else {
          setStepIndex((idx) => Math.min(idx + 1, SCORING_RULES.length - 1));
        }
      }, 280);
    }
  };

  const goNext = () => {
    clearAutoAdvance();
    if (isLast) {
      onFinish();
      return;
    }
    setStepIndex((idx) => Math.min(idx + 1, SCORING_RULES.length - 1));
  };

  const goBack = () => {
    clearAutoAdvance();
    setStepIndex((idx) => Math.max(idx - 1, 0));
  };

  const handleRestart = () => {
    clearAutoAdvance();
    setStepIndex(0);
    setLastDelta(0);
    onRestart();
  };

  const handleExit = () => {
    clearAutoAdvance();
    onCancel();
  };

  return (
    <section
      className="manual-counter"
      aria-labelledby="manual-counter-title"
    >
      <header className="manual-counter-head">
        <div>
          <span className="section-eyebrow">Manual count</span>
          <h1 id="manual-counter-title">Walk through each scoring rule</h1>
        </div>
        <div className="manual-counter-head-actions">
          <button type="button" className="btn btn-ghost" onClick={handleRestart}>
            Restart
          </button>
          <button type="button" className="btn btn-ghost" onClick={handleExit}>
            Exit
          </button>
        </div>
      </header>

      <ProgressBar
        current={stepIndex + 1}
        total={SCORING_RULES.length}
        label={`Step ${stepIndex + 1} of ${SCORING_RULES.length}`}
      />

      <div className="manual-counter-grid">
        <div className="manual-counter-step">
          {showChickenWarning && rule && rule.id !== 'chickenHand' && (
            <div className="manual-counter-warning" role="status">
              You marked <strong>Chicken Hand</strong> earlier but other scoring
              rules are also counted. A chicken hand usually means no other
              rules apply.
            </div>
          )}
          {rule && (
            <RuleStep
              key={rule.id}
              rule={rule}
              value={selections[rule.id]}
              onChange={handleSelectionChange}
            />
          )}

          <div className="manual-counter-nav">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={goBack}
              disabled={stepIndex === 0}
            >
              ← Back
            </button>
            <button
              type="button"
              className={isLast ? 'btn btn-gold' : 'btn btn-primary'}
              onClick={goNext}
            >
              {isLast ? 'Finish & see results' : 'Next →'}
            </button>
          </div>
        </div>

        <RunningTotal
          total={total}
          lastDelta={lastDelta}
          countedRules={counted.length}
        />
      </div>
    </section>
  );
}
