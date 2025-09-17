import { useState, useRef, useEffect } from 'react';
import { Ingredient } from '../src/services/ingredientLibraryService';
import { useAdminStore } from '../src/stores/adminStore';

interface IngredientAutocompleteProps {
  availableIngredients: Ingredient[];
  onSelect: (ingredient: Ingredient) => void;
  placeholder?: string;
  className?: string;
  value?: string;
  onClear?: () => void;
}

export function IngredientAutocomplete({
  availableIngredients,
  onSelect,
  placeholder = "Search ingredients...",
  className = "",
  value = "",
  onClear
}: IngredientAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const getCategoryPath = useAdminStore(state => state.getCategoryPath);

  // Smart search function
  const searchIngredients = (searchQuery: string): Ingredient[] => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();

    return availableIngredients.filter(ingredient => {
      // Search in ingredient name
      if (ingredient.name.toLowerCase().includes(query)) return true;

      // Search in display name
      if (ingredient.displayName?.toLowerCase().includes(query)) return true;

      // Search in brand
      if (ingredient.brand?.toLowerCase().includes(query)) return true;

      // Search in description
      if (ingredient.description?.toLowerCase().includes(query)) return true;

      // Search in category path
      if (ingredient.categoryPath.some(part => part.toLowerCase().includes(query))) return true;

      return false;
    }).slice(0, 10); // Limit to top 10 results
  };

  const filteredIngredients = searchIngredients(query);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowResults(value.length > 0);
    setSelectedIndex(-1);
  };

  const handleSelectIngredient = (ingredient: Ingredient) => {
    onSelect(ingredient);
    setQuery(ingredient.displayName || ingredient.name);
    setShowResults(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < filteredIngredients.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && filteredIngredients[selectedIndex]) {
          handleSelectIngredient(filteredIngredients[selectedIndex]);
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

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  // Sync with value prop
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
        onFocus={() => query.length > 0 && setShowResults(true)}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${onClear && query ? 'pr-8' : ''} ${className}`}
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

      {showResults && filteredIngredients.length > 0 && (
        <div
          ref={resultsRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {filteredIngredients.map((ingredient, index) => (
            <button
              key={ingredient.id}
              type="button"
              onClick={() => handleSelectIngredient(ingredient)}
              className={`w-full text-left px-3 py-2 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors ${index === selectedIndex ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {ingredient.displayName || ingredient.name}
                  </div>
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    {ingredient.brand && (
                      <span className="truncate">{ingredient.brand}</span>
                    )}
                    <span className="text-blue-600 text-xs bg-blue-100 px-2 py-0.5 rounded">
                      {getCategoryPath(ingredient.categoryId)}
                    </span>
                  </div>
                  {ingredient.description && (
                    <div className="text-xs text-gray-500 truncate mt-1">
                      {ingredient.description}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400 ml-2">
                  {ingredient.abv && (
                    <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                      {ingredient.abv}%
                    </span>
                  )}
                  {!ingredient.available && (
                    <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded">
                      Unavailable
                    </span>
                  )}
                  {!ingredient.inStock && (
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {showResults && query.length > 0 && filteredIngredients.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3">
          <div className="text-sm text-gray-500 text-center">
            No ingredients found matching "{query}"
          </div>
        </div>
      )}
    </div>
  );
}