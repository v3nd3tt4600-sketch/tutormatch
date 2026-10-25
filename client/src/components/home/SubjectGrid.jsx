import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SubjectIcon from '../services/SubjectIcon';
import { SUBJECTS } from '../../utils/constants';

const SUBJECT_BLURBS = {
  Math: 'Algebra, calculus and statistics',
  Science: 'Biology, chemistry and physics',
  English: 'Essays and reading skills',
  Programming: 'Python, JavaScript and the web',
  Languages: 'Conversation practice',
  'Test Prep': 'SAT strategies and practice',
};

export default function SubjectGrid() {
  return (
    <section className="container home-section">
      <div className="section-header">
        <h2>Browse by subject</h2>
        <Link to="/services">
          See all services <ArrowRight size={16} />
        </Link>
      </div>

      <div className="subject-grid">
        {SUBJECTS.map((subject) => (
          <Link
            key={subject}
            to={`/services?subject=${encodeURIComponent(subject)}`}
            className="subject-tile"
          >
            <SubjectIcon subject={subject} />
            <div>
              <h3>{subject}</h3>
              <p>{SUBJECT_BLURBS[subject]}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
