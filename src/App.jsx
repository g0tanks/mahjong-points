import { useCallback, useMemo, useState } from 'react';
import AutoCounter from './components/AutoCounter.jsx';
import Header from './components/Header.jsx';
import HomePage from './components/HomePage.jsx';
import ManualCounter from './components/ManualCounter.jsx';
import ResultsPage from './components/ResultsPage.jsx';
import { SCORING_RULES } from './data/scoringRules.js';

function buildInitialSelections() {
  const initial = {};
  for (const rule of SCORING_RULES) {
    initial[rule.id] = rule.type === 'multiSelect' ? [] : false;
  }
  return initial;
}

export default function App() {
  const [view, setView] = useState('home');
  const [selections, setSelections] = useState(buildInitialSelections);

  const resetSelections = useCallback(() => {
    setSelections(buildInitialSelections());
  }, []);

  const goHome = useCallback(() => {
    setView('home');
  }, []);

  const startCount = useCallback(() => {
    resetSelections();
    setView('counter');
  }, [resetSelections]);

  const startAutoCount = useCallback(() => {
    resetSelections();
    setView('auto');
  }, [resetSelections]);

  const finishCount = useCallback(() => {
    setView('results');
  }, []);

  const restartCount = useCallback(() => {
    resetSelections();
    setView('counter');
  }, [resetSelections]);

  const headerStep = useMemo(() => {
    if (view === 'home') return 'Rules overview';
    if (view === 'counter') return 'Manual count';
    if (view === 'auto') return 'Auto count';
    return 'Results';
  }, [view]);

  return (
    <div className="app-shell">
      <Header
        currentLabel={headerStep}
        onHome={goHome}
        showHomeAction={view !== 'home'}
      />
      <main className="app-main">
        {view === 'home' && (
          <HomePage
            onStartManualCount={startCount}
            onStartAutoCount={startAutoCount}
          />
        )}
        {view === 'counter' && (
          <ManualCounter
            selections={selections}
            setSelections={setSelections}
            onFinish={finishCount}
            onCancel={goHome}
            onRestart={() => {
              resetSelections();
            }}
          />
        )}
        {view === 'auto' && (
          <AutoCounter
            selections={selections}
            setSelections={setSelections}
            onFinish={finishCount}
            onCancel={goHome}
          />
        )}
        {view === 'results' && (
          <ResultsPage
            selections={selections}
            onCountAnother={restartCount}
            onBackToRules={goHome}
          />
        )}
      </main>
      <footer className="app-footer">
        <p>
          Tile images by{' '}
          <a
            href="https://commons.wikimedia.org/wiki/User:Cangjie6"
            target="_blank"
            rel="noopener noreferrer"
          >
            Wikipedia user Cangjie6
          </a>
          , licensed under{' '}
          <a
            href="https://creativecommons.org/licenses/by-sa/4.0/"
            target="_blank"
            rel="noopener noreferrer"
          >
            CC BY-SA 4.0
          </a>
          .
        </p>
        <p className="app-footer-credit">
          Developed by Ton Nguyen with assistance of Claude Code.
        </p>
      </footer>
    </div>
  );
}
