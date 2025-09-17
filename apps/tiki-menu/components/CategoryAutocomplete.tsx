import { useState, useRef, useEffect } from 'react';
import { Category } from '../src/services/ingredientLibraryService';

interface CategoryAutocompleteProps {
  categories: Category[];
  onSelect: (category: Category) => void;
  placeholder?: string;
  className?: string;
  value?: string;
  onClear?: () => void;
}

export function CategoryAutocomplete({
  categories,
  onSelect,
  placeholder = "Search categories...",
  className = "",
  value = "",
  onClear
}: CategoryAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Smart search function for categories
  const searchCategories = (searchQuery: string): Category[] => {
    if (!searchQuery.trim()) return categories;

    const query = searchQuery.toLowerCase();

    return categories.filter(category => {
      // Search in category name
      if (category.name.toLowerCase().includes(query)) return true;

      // Search in description
      if (category.description?.toLowerCase().includes(query)) return true;

      // Search in path parts (for nested categories)
      if (category.path.some((part: string) => part.toLowerCase().includes(query))) return true;

      return false;
    }).slice(0, 10); // Limit to top 10 results
  };

  const filteredCategories = searchCategories(query);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowResults(true);
    setSelectedIndex(-1);
  };

  const handleSelectCategory = (category: Category) => {
    onSelect(category);
    setQuery(category.name);
    setShowResults(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < filteredCategories.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && filteredCategories[selectedIndex]) {
          handleSelectCategory(filteredCategories[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowResults(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleBlur = () => {
    // Delay hiding results to allow for clicks
    setTimeout(() => {
      setShowResults(false);
      setSelectedIndex(-1);
    }, 200);
  };

  const getCategoryDisplayPath = (categoryPath: string[]): string => {
    return categoryPath.join(' → ');
  };

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  // Update query when value prop changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowResults(true)}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`w-full px-3 py-2 bg-tiki-surface border border-tiki-carved/30 rounded-md text-tiki-text focus:outline-none focus:ring-2 focus:ring-tiki-accent focus:border-tiki-accent ${onClear && query ? 'pr-8' : ''} ${className}`}
        autoComplete="off"
      />
      {onClear && query && (
        <button
          type="button"
          onClick={() => {
            setQuery('');
            onClear();
          }}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      )}

      {showResults && filteredCategories.length > 0 && (
        <div
          ref={resultsRef}
          className="absolute z-10 w-full mt-1 bg-tiki-surface border border-tiki-carved/30 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {filteredCategories.map((category, index) => (
            <button
              key={category.id}
              type="button"
              onClick={() => handleSelectCategory(category)}
              className={`w-full text-left px-3 py-2 hover:bg-tiki-accent/10 focus:bg-tiki-accent/10 focus:outline-none transition-colors ${
                index === selectedIndex ? 'bg-tiki-accent/20 border-l-4 border-tiki-accent' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-tiki-text truncate">
                    {category.name}
                  </div>
                  <div className="text-sm text-tiki-text/70">
                    {getCategoryDisplayPath(category.path)}
                  </div>
                  {category.description && (
                    <div className="text-xs text-tiki-text/60 truncate mt-1">
                      {category.description}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-tiki-text/50 ml-2">
                  <span className="bg-tiki-accent/20 text-tiki-accent px-2 py-0.5 rounded">
                    Level {category.level}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {showResults && query.length > 0 && filteredCategories.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-tiki-surface border border-tiki-carved/30 rounded-md shadow-lg p-3">
          <div className="text-sm text-tiki-text/70 text-center">
            No categories found matching "{query}"
          </div>
        </div>
      )}
    </div>
  );
}