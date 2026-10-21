import { Search, X } from 'lucide-react';
import { SUBJECTS, LEVELS } from '../../utils/constants';

export default function ServiceFilters({
  searchInput,
  onSearchChange,
  subject,
  level,
  onFilterChange,
  onClear,
  hasFilters,
}) {
  return (
    <div className="filters card">
      <div className="filters-search">
        <label htmlFor="search" className="sr-only">Search services</label>
        <Search size={18} />
        <input
          id="search"
          type="search"
          className="input"
          placeholder="Search by topic, like derivatives or essays"
          value={searchInput}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="subject" className="sr-only">Subject</label>
        <select
          id="subject"
          className="input"
          value={subject}
          onChange={(event) => onFilterChange('subject', event.target.value)}
        >
          <option value="">All subjects</option>
          {SUBJECTS.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="level" className="sr-only">Level</label>
        <select
          id="level"
          className="input"
          value={level}
          onChange={(event) => onFilterChange('level', event.target.value)}
        >
          <option value="">All levels</option>
          {LEVELS.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </div>

      {hasFilters && (
        <button type="button" className="btn btn-secondary filters-clear" onClick={onClear}>
          <X size={16} />
          Clear
        </button>
      )}
    </div>
  );
}
