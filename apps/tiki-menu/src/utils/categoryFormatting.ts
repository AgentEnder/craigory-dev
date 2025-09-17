import { Category } from '../services/ingredientLibraryService';

export interface CategoryOption {
  id: string;
  label: string;
  backtrace: string;
  category: Category;
}

export function formatCategoriesForDropdown(categories: Category[]): CategoryOption[] {
  const sortedCategories = [...categories].sort((a, b) => {
    // Sort by path to maintain hierarchy
    return a.path.join('/').localeCompare(b.path.join('/'));
  });

  return sortedCategories.map((category) => {
    let prefix = '';

    if (category.level > 0) {
      // Get all siblings (categories with same parent and level) in their sorted order
      const siblings = sortedCategories.filter(cat =>
        cat.parentId === category.parentId &&
        cat.level === category.level
      );

      // Find the current category's position among siblings (using the original sorted order)
      const currentIndex = siblings.indexOf(category);
      const isLast = currentIndex === siblings.length - 1;

      // Build proper tree indentation for each level using non-breaking spaces
      for (let level = 1; level <= category.level; level++) {
        if (level === category.level) {
          // This is the current level - add the tree connector
          prefix += isLast ? '└──\u00A0' : '├──\u00A0';
        } else {
          // This is a parent level - we need to determine if we should show a vertical line
          // Find the ancestor at this level
          const ancestorPath = category.path.slice(0, level);
          const ancestor = sortedCategories.find(cat =>
            cat.level === level - 1 &&
            cat.path.join('/') === ancestorPath.slice(0, -1).join('/')
          );

          if (ancestor) {
            // Check if this ancestor has more siblings after it
            const ancestorSiblings = sortedCategories.filter(cat =>
              cat.parentId === ancestor.parentId &&
              cat.level === ancestor.level
            );
            const ancestorIndex = ancestorSiblings.indexOf(ancestor);
            const ancestorIsLast = ancestorIndex === ancestorSiblings.length - 1;

            prefix += ancestorIsLast ? '\u00A0\u00A0\u00A0\u00A0' : '│\u00A0\u00A0\u00A0';
          } else {
            prefix += '\u00A0\u00A0\u00A0\u00A0';
          }
        }
      }
    }

    // Check if this category has children
    const hasChildren = sortedCategories.some(cat => cat.parentId === category.id);
    const suffix = (category.level === 0 && hasChildren) ? '/' : '';

    // Build backtrace (reverse path for display)
    const backtrace = [...category.path].reverse().join(' ');

    return {
      id: category.id,
      label: prefix + category.name + suffix,
      backtrace,
      category,
    };
  });
}