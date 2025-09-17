import { useState, useRef, useEffect } from 'react';
import { Ingredient, Category } from '../src/services/ingredientLibraryService';
import { useAdminStore } from '../src/stores/adminStore';
import { formatCategoriesForDropdown } from '../src/utils/categoryFormatting';

export interface IngredientOrCategoryOption {
  type: 'ingredient' | 'category' | 'custom';
  id?: string;
  name: string;
  displayName: string;
  backtrace?: string;
  searchText: string;
  ingredient?: Ingredient;
  category?: Category;
}

interface UnifiedIngredientOrCategoryAutocompleteProps {
  availableIngredients?: Ingredient[];
  categories?: Category[];
  onSelect: (option: IngredientOrCategoryOption) => void;
  placeholder?: string;
  className?: string;
  value?: string;
  onClear?: () => void;
  showIngredients?: boolean;
  showCategories?: boolean;
  showCustom?: boolean;
}

export function UnifiedIngredientOrCategoryAutocomplete({
  availableIngredients = [],
  categories = [],
  onSelect,
  placeholder = 'Search...',
  className = '',
  value = '',
  onClear,
  showIngredients = true,
  showCategories = true,
  showCustom = true,
}: UnifiedIngredientOrCategoryAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [displayValue, setDisplayValue] = useState(value);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedOption, setSelectedOption] =
    useState<IngredientOrCategoryOption | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const getCategoryPath = useAdminStore((state) => state.getCategoryPath);

  // Build all options (ingredients, categories, custom)
  const buildAllOptions = (): IngredientOrCategoryOption[] => {
    const options: IngredientOrCategoryOption[] = [];

    // Add formatted categories if enabled
    if (showCategories && categories.length > 0) {
      const formattedCategories = formatCategoriesForDropdown(categories);
      formattedCategories.forEach((catOption) => {
        options.push({
          type: 'category',
          id: catOption.id,
          name: catOption.category.name,
          displayName: catOption.label,
          backtrace: catOption.backtrace,
          searchText:
            catOption.category.path.join(' ') + ' ' + catOption.category.name,
          category: catOption.category,
        });
      });
    }

    // Add ingredients if enabled
    if (showIngredients && availableIngredients.length > 0) {
      availableIngredients.forEach((ingredient) => {
        const categoryPath = getCategoryPath(ingredient.categoryId);
        const categoryIndent = '    '.repeat(ingredient.categoryPath.length);

        options.push({
          type: 'ingredient',
          id: ingredient.id,
          name: ingredient.name,
          displayName: `${categoryIndent}└── ${
            ingredient.displayName || ingredient.name
          }`,
          searchText: `${categoryPath} ${ingredient.name} ${
            ingredient.brand || ''
          } ${ingredient.description || ''}`.toLowerCase(),
          ingredient,
        });
      });
    }

    return options;
  };

  // Smart search function
  const searchOptions = (searchQuery: string): IngredientOrCategoryOption[] => {
    if (!searchQuery.trim()) {
      const allOptions = buildAllOptions();
      // Add "use custom" option at the end when no query (if enabled)
      if (showCustom) {
        allOptions.push({
          type: 'custom',
          name: 'Use Custom',
          displayName: 'Use Custom',
          searchText: 'use custom',
        });
      }
      return allOptions.slice(0, 15); // Limit initial results
    }

    const query = searchQuery.toLowerCase();
    const allOptions = buildAllOptions();

    const matchingOptions = allOptions.filter((option) => {
      const directMatch =
        option.searchText.toLowerCase().includes(query) ||
        option.name.toLowerCase().includes(query) ||
        option.displayName.toLowerCase().includes(query);

      // If this option directly matches, include it
      if (directMatch) return true;

      // If this is a category, also include it if any of its descendants match
      if (option.type === 'category' && option.category) {
        const hasMatchingDescendant = allOptions.some(other => {
          // Check if 'other' is a descendant of this category
          const isDescendant = other.category &&
            other.category.path.some(pathPart =>
              pathPart.toLowerCase() === option.category!.name.toLowerCase()
            );

          // Check if the descendant matches the query
          const descendantMatches = isDescendant && (
            other.searchText.toLowerCase().includes(query) ||
            other.name.toLowerCase().includes(query) ||
            other.displayName.toLowerCase().includes(query)
          );

          return descendantMatches;
        });

        return hasMatchingDescendant;
      }

      return false;
    });

    // Always add "use custom" option if there's a query (if enabled)
    if (showCustom) {
      matchingOptions.push({
        type: 'custom',
        name: searchQuery,
        displayName: `Use Custom: "${searchQuery}"`,
        searchText: 'use custom',
      });
    }

    return matchingOptions.slice(0, 15); // Limit results
  };

  const filteredOptions = searchOptions(query);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setDisplayValue(value);
    setSelectedOption(null);
    setShowResults(true);
    setSelectedIndex(-1);
  };

  const handleSelectOption = (option: IngredientOrCategoryOption) => {
    onSelect(option);
    setSelectedOption(option);

    // For categories, show the backtrace; for others, show displayName
    const backtraceDisplay =
      option.type === 'category' && option.backtrace
        ? option.backtrace
        : option.type === 'custom'
        ? option.name
        : option.displayName;

    setDisplayValue(backtraceDisplay);
    setQuery(''); // Keep query empty so it doesn't interfere with search
    setShowResults(false);
    setSelectedIndex(-1);
  };

  const handleFocus = () => {
    // When focusing, if we have a selected option, clear the display and prepare for search
    if (selectedOption) {
      setQuery(selectedOption.name); // Use the original name for searching
      setDisplayValue(selectedOption.name);
    }
    setShowResults(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && filteredOptions[selectedIndex]) {
          handleSelectOption(filteredOptions[selectedIndex]);
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
      // If we have a selected option, show its backtrace again
      if (selectedOption) {
        const backtraceDisplay =
          selectedOption.type === 'category' && selectedOption.backtrace
            ? selectedOption.backtrace
            : selectedOption.type === 'custom'
            ? selectedOption.name
            : selectedOption.displayName;
        setDisplayValue(backtraceDisplay);
        setQuery('');
      }
    }, 200);
  };

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[
        selectedIndex
      ] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  // Sync with value prop
  useEffect(() => {
    setQuery(value);
    setDisplayValue(value);
    setSelectedOption(null);
  }, [value]);

  const getOptionIcon = (option: IngredientOrCategoryOption) => {
    switch (option.type) {
      case 'ingredient':
        return '🧪';
      case 'category':
        return '📁';
      case 'custom':
        return '✏️';
      default:
        return '';
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={displayValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          onClear && query ? 'pr-8' : ''
        } ${className}`}
        autoComplete="off"
      />
      {onClear && (selectedOption || displayValue) && (
        <button
          type="button"
          onClick={() => {
            setQuery('');
            setDisplayValue('');
            setSelectedOption(null);
            onClear();
          }}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      )}

      {showResults && filteredOptions.length > 0 && (
        <div
          ref={resultsRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-y-auto"
        >
          {filteredOptions.map((option, index) => (
            <button
              key={`${option.type}-${option.id || option.name}-${index}`}
              type="button"
              onClick={() => handleSelectOption(option)}
              className={`w-full text-left px-3 py-2 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors ${
                index === selectedIndex
                  ? 'bg-blue-50 border-l-4 border-blue-500'
                  : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    <span className="mr-2">{getOptionIcon(option)}</span>
                    {option.displayName}
                  </div>
                  {option.ingredient && (
                    <div className="text-sm text-gray-600 flex items-center gap-2">
                      {option.ingredient.brand && (
                        <span className="truncate">
                          {option.ingredient.brand}
                        </span>
                      )}
                      {option.ingredient.abv && (
                        <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs">
                          {option.ingredient.abv}%
                        </span>
                      )}
                      {!option.ingredient.available && (
                        <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs">
                          Unavailable
                        </span>
                      )}
                      {!option.ingredient.inStock && (
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  )}
                  {option.category && option.category.description && (
                    <div className="text-xs text-gray-500 truncate mt-1">
                      {option.category.description}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {showResults && query.length > 0 && filteredOptions.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3">
          <div className="text-sm text-gray-500 text-center">
            No ingredients or categories found matching "{query}"
          </div>
        </div>
      )}
    </div>
  );
}
