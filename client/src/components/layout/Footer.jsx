import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>© {year} TutorMatch. Find the right tutor, fast.</p>
        <p className="text-muted">Built with React, Node.js, Express and MongoDB.</p>
      </div>
    </footer>
  );
}
