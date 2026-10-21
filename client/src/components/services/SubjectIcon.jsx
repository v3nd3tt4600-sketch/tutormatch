import {
  Calculator,
  FlaskConical,
  BookOpen,
  Code,
  Languages,
  ClipboardCheck,
  GraduationCap,
} from 'lucide-react';

const SUBJECT_STYLES = {
  Math: { icon: Calculator, color: '#4f46e5', background: '#eef2ff' },
  Science: { icon: FlaskConical, color: '#059669', background: '#d1fae5' },
  English: { icon: BookOpen, color: '#d97706', background: '#fef3c7' },
  Programming: { icon: Code, color: '#0284c7', background: '#e0f2fe' },
  Languages: { icon: Languages, color: '#db2777', background: '#fce7f3' },
  'Test Prep': { icon: ClipboardCheck, color: '#7c3aed', background: '#ede9fe' },
};

const DEFAULT_STYLE = { icon: GraduationCap, color: '#64748b', background: '#f1f5f9' };

export default function SubjectIcon({ subject, large = false }) {
  const { icon: Icon, color, background } = SUBJECT_STYLES[subject] || DEFAULT_STYLE;

  return (
    <span
      className={`subject-icon ${large ? 'subject-icon-lg' : ''}`}
      style={{ color, background }}
      aria-hidden="true"
    >
      <Icon size={large ? 28 : 20} />
    </span>
  );
}
