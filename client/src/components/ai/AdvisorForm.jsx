import { Sparkles } from 'lucide-react';
import ErrorMessage from '../common/ErrorMessage';

const MAX_LENGTH = 1000;

const EXAMPLES = [
  "I have a calculus exam in 2 weeks and I don't understand derivatives.",
  "I'm a complete beginner and need to learn coding for a college class.",
  "My teacher says my essays don't have a clear argument.",
  "I'm taking the SAT soon and math is my weakest section.",
];

export default function AdvisorForm({ problem, onChange, onSubmit, loading, error }) {
  return (
    <form className="card advisor-form" onSubmit={onSubmit} noValidate>
      <label htmlFor="problem" className="advisor-label">
        What do you need help with?
      </label>
      <textarea
        id="problem"
        className="input"
        rows={4}
        maxLength={MAX_LENGTH}
        placeholder="Describe the subject, what's hard for you, your level, and any deadline."
        value={problem}
        onChange={(event) => onChange(event.target.value)}
        disabled={loading}
      />
      <span className="notes-counter">{problem.length}/{MAX_LENGTH}</span>

      <div className="advisor-examples">
        <span className="text-muted">Try an example:</span>
        {EXAMPLES.map((example) => (
          <button
            key={example}
            type="button"
            className="chip"
            onClick={() => onChange(example)}
            disabled={loading}
          >
            {example}
          </button>
        ))}
      </div>

      <ErrorMessage message={error} />

      <button type="submit" className="btn btn-primary advisor-submit" disabled={loading}>
        <Sparkles size={18} />
        {loading ? 'Finding sessions…' : 'Get recommendations'}
      </button>
    </form>
  );
}
