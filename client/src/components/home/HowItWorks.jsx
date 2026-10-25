import { MessageSquareText, CalendarClock, LayoutDashboard } from 'lucide-react';

const STEPS = [
  {
    icon: MessageSquareText,
    title: 'Describe or browse',
    text: 'Tell the AI Study Advisor what you are struggling with, or filter sessions by subject and level.',
  },
  {
    icon: CalendarClock,
    title: 'Pick a time',
    text: 'See which slots are open in real time and book the one that fits your schedule.',
  },
  {
    icon: LayoutDashboard,
    title: 'Learn and stay on track',
    text: 'Your dashboard shows upcoming sessions, and you can reschedule or cancel if plans change.',
  },
];

export default function HowItWorks() {
  return (
    <section className="container home-section">
      <div className="section-header">
        <h2>How it works</h2>
      </div>

      <ol className="steps-grid">
        {STEPS.map(({ icon: Icon, title, text }, index) => (
          <li key={title} className="card step-card">
            <div className="step-top">
              <span className="step-icon">
                <Icon size={22} />
              </span>
              <span className="step-number">Step {index + 1}</span>
            </div>
            <h3>{title}</h3>
            <p className="text-muted">{text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
