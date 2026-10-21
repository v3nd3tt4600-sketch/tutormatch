import { useEffect } from 'react';

// Sets the browser tab title, e.g. "Services | TutorMatch"
export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | TutorMatch` : 'TutorMatch';
  }, [title]);
}
