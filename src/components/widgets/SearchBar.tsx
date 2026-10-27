import { useState, type FormEvent } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed) navigate(`/explore?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form role="search" onSubmit={handleSubmit} className="sticky top-0 z-10 bg-bg py-2">
      <label className="flex items-center gap-3 rounded-full border border-transparent bg-field px-4 py-2.5 focus-within:border-brand focus-within:bg-transparent">
        <Search className="size-5 text-muted" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search"
          aria-label="Search"
          className="w-full bg-transparent text-[15px] outline-none placeholder:text-muted"
        />
      </label>
    </form>
  );
}
