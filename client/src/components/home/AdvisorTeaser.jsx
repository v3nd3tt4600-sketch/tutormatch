import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function AdvisorTeaser() {
  const [text, setText] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const question = text.trim();
    navigate(question ? `/advisor?q=${encodeURIComponent(question)}` : '/advisor');
  };

  return (
    <form className="card advisor-teaser" onSubmit={handleSubmit}>
      <div className="advisor-teaser-header">
        <span className="teaser-icon">
          <Sparkles size={22} />
        </span>
        <div>
          <h2>Not sure what you need?</h2>
          <p className="text-muted">
            Describe it, and our AI Study Advisor will match you in seconds.
          </p>
        </div>
      </div>

      <label htmlFor="teaser-question" className="sr-only">
        What do you need help with?
      </label>
      <textarea
        id="teaser-question"
        className="input"
        rows={3}
        maxLength={1000}
        placeholder="I have a chemistry test on Friday and I keep getting stoichiometry wrong."
        value={text}
        onChange={(event) => setText(event.target.value)}
      />

      <button type="submit" className="btn btn-primary btn-block">
        Get my recommendations <ArrowRight size={18} />
      </button>
      <p className="advisor-teaser-note">Free with a TutorMatch account.</p>
    </form>
  );
}
