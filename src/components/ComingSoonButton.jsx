import './ComingSoonButton.css';

export default function ComingSoonButton({ label, sublabel = 'Coming soon' }) {
  return (
    <button
      type="button"
      className="coming-soon-btn"
      disabled
      aria-disabled="true"
      aria-describedby="coming-soon-hint"
    >
      <span className="coming-soon-label">{label}</span>
      <span className="coming-soon-sub" id="coming-soon-hint">
        {sublabel}
      </span>
    </button>
  );
}
