import { useState, useEffect } from 'react';
import {
  type Ingredient,
  type CategoryHierarchy,
} from '../src/services/ingredientLibraryService';
import { useAdminStore, useCategoryHierarchy } from '../src/stores/adminStore';
import { IngredientFormModal } from './IngredientFormModal';
import { CategoryFormModal } from './CategoryFormModal';

interface EditingCategory {
  name: string;
  description?: string;
  parentId: string | null;
}

interface EditingIngredient {
  id?: string;
  name: string;
  brand: string;
  displayName?: string;
  description?: string;
  abv?: number;
  available?: boolean;
  inStock?: boolean;
  categoryId: string;
}

export function InventoryManagement() {
  // Get state and actions from Zustand store
  const {
    categories,
    ingredients,
    isLoadingIngredients,
    error,
    createCategory,
    deleteCategory,
    createIngredient,
    updateIngredient,
    deleteIngredient,
    moveIngredient,
    toggleIngredientAvailability,
    toggleIngredientStock,
    clearError,
  } = useAdminStore();

  const categoryHierarchy = useCategoryHierarchy();

  // Local component state
  const [editingCategory, setEditingCategory] = useState<EditingCategory | null>(null);
  const [editingIngredient, setEditingIngredient] = useState<EditingIngredient | null>(null);
  const [collapsedFieldsets, setCollapsedFieldsets] = useState<Set<string>>(new Set());

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const startEditingIngredient = (categoryId: string, ingredient?: Ingredient) => {
    if (ingredient) {
      // Editing existing ingredient
      setEditingIngredient({
        id: ingredient.id,
        name: ingredient.name,
        brand: ingredient.brand,
        displayName: ingredient.displayName,
        description: ingredient.description,
        abv: ingredient.abv,
        available: ingredient.available,
        inStock: ingredient.inStock,
        categoryId: ingredient.categoryId,
      });
    } else {
      // Creating new ingredient
      setEditingIngredient({
        name: '',
        brand: '',
        displayName: '',
        description: '',
        available: true,
        inStock: true,
        categoryId,
      });
    }
  };

  const startEditingCategory = (parentId: string | null) => {
    setEditingCategory({
      name: '',
      description: '',
      parentId,
    });
  };

  const cancelEditing = () => {
    setEditingIngredient(null);
    setEditingCategory(null);
  };


  // Count total ingredients in a hierarchy
  const getIngredientCount = (hierarchy: CategoryHierarchy): number => {
    let count = hierarchy.ingredients.length;
    for (const child of hierarchy.children) {
      count += getIngredientCount(child);
    }
    return count;
  };

  const toggleFieldsetCollapse = (categoryId: string) => {
    setCollapsedFieldsets((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleIngredientSave = async () => {
    if (!editingIngredient || !editingIngredient.name.trim()) return;

    try {
      if (editingIngredient.id) {
        // Check if category has changed
        const currentIngredient = ingredients.find(ing => ing.id === editingIngredient.id);
        const categoryChanged = currentIngredient && currentIngredient.categoryId !== editingIngredient.categoryId;

        if (categoryChanged) {
          // Move ingredient to new category
          await moveIngredient(editingIngredient.id, editingIngredient.categoryId);
        }

        // Update ingredient
        const updates: Partial<Ingredient> = {
          name: editingIngredient.name.trim(),
          brand: editingIngredient.brand?.trim() || '',
          displayName: editingIngredient.displayName?.trim() ||
            (editingIngredient.brand?.trim() ?
              `${editingIngredient.name.trim()} (${editingIngredient.brand.trim()})` :
              editingIngredient.name.trim()),
          description: editingIngredient.description?.trim() || '',
          available: editingIngredient.available,
          inStock: editingIngredient.inStock,
          abv: editingIngredient.abv,
        };

        await updateIngredient(editingIngredient.id, updates);
      } else {
        // Create new ingredient
        const ingredientData = {
          name: editingIngredient.name.trim(),
          brand: editingIngredient.brand?.trim() || '',
          displayName: editingIngredient.displayName?.trim() ||
            (editingIngredient.brand?.trim() ?
              `${editingIngredient.name.trim()} (${editingIngredient.brand.trim()})` :
              editingIngredient.name.trim()),
          description: editingIngredient.description?.trim() || '',
          available: editingIngredient.available ?? true,
          inStock: editingIngredient.inStock ?? true,
          abv: editingIngredient.abv,
          order: 0,
        };

        await createIngredient(editingIngredient.categoryId, ingredientData);
      }

      setEditingIngredient(null);
    } catch (error) {
      console.error('Error saving ingredient:', error);
    }
  };

  const handleCategorySave = async () => {
    if (!editingCategory || !editingCategory.name.trim()) return;

    try {
      await createCategory(
        editingCategory.name.trim(),
        editingCategory.parentId,
        editingCategory.description?.trim()
      );
      setEditingCategory(null);
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleDeleteIngredient = async (ingredientId: string) => {
    if (!confirm('Are you sure you want to delete this ingredient?')) return;
    await deleteIngredient(ingredientId);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    // Count descendants
    const descendantCategories = categories.filter(c =>
      c.id !== categoryId && c.path.includes(category.name.toLowerCase())
    );
    const categoryIngredients = ingredients.filter(ing =>
      ing.categoryId === categoryId ||
      descendantCategories.some(desc => desc.id === ing.categoryId)
    );

    const hasContents = descendantCategories.length > 0 || categoryIngredients.length > 0;

    const confirmMessage = hasContents
      ? `Are you sure you want to delete "${category.name}" and ALL of its ${descendantCategories.length} subcategories and ${categoryIngredients.length} ingredients? This action cannot be undone.`
      : `Are you sure you want to delete the category "${category.name}"?`;

    if (!confirm(confirmMessage)) return;
    await deleteCategory(categoryId);
  };

  // Recursive component to render category hierarchy
  const CategoryRenderer = ({ hierarchy }: { hierarchy: CategoryHierarchy }) => {
    const { category, children, ingredients: categoryIngredients } = hierarchy;
    const isCollapsed = collapsedFieldsets.has(category.id);
    const totalCount = getIngredientCount(hierarchy);

    return (
      <fieldset className="border-2 border-tiki-carved rounded-lg p-4 mb-4">
        <legend className="text-lg font-semibold text-tiki-text px-2 bg-tiki-surface flex items-center gap-2">
          <button
            onClick={() => toggleFieldsetCollapse(category.id)}
            className="text-tiki-text hover:text-tiki-accent transition-colors focus:outline-none"
            aria-label={isCollapsed ? 'Expand category' : 'Collapse category'}
          >
            {isCollapsed ? '▶' : '▼'}
          </button>
          <span className="flex items-center gap-2">
            {category.name}
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${totalCount === 0
                ? 'bg-gray-100 text-gray-500'
                : 'bg-tiki-accent/10 text-tiki-accent'
                }`}
            >
              {totalCount} {totalCount === 1 ? 'ingredient' : 'ingredients'}
            </span>
          </span>
          {category.description && (
            <span className="text-sm text-gray-600 ml-2">
              ({category.description})
            </span>
          )}
        </legend>

        {!isCollapsed && (
          <div className="space-y-4">
            {/* Action buttons for this category */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => startEditingCategory(category.id)}
                className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 text-sm"
              >
                + Add Subcategory
              </button>
              <button
                onClick={() => startEditingIngredient(category.id)}
                className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 text-sm"
              >
                + Add Ingredient
              </button>
              <button
                onClick={() => handleDeleteCategory(category.id)}
                className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 text-sm"
              >
                Delete Category
              </button>
            </div>

            {/* Direct ingredients in this category */}
            {categoryIngredients.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-700">Ingredients:</h4>
                <div className="grid gap-2">
                  {categoryIngredients.map((ingredient) => (
                    <div
                      key={ingredient.id}
                      className="bg-gray-50 p-3 rounded-md flex justify-between items-start"
                    >
                      <div className="flex-1">
                        <h5 className="font-medium text-tiki-text">
                          {ingredient.displayName || ingredient.name}
                        </h5>
                        {ingredient.brand && (
                          <p className="text-sm text-gray-600">Brand: {ingredient.brand}</p>
                        )}
                        {ingredient.abv && (
                          <p className="text-sm text-gray-600">ABV: {ingredient.abv}%</p>
                        )}
                        {ingredient.description && (
                          <p className="text-sm text-gray-600 mt-1">{ingredient.description}</p>
                        )}
                        <div className="flex gap-4 mt-2">
                          <label className="flex items-center gap-1 text-sm">
                            <input
                              type="checkbox"
                              checked={ingredient.available}
                              onChange={() => toggleIngredientAvailability(ingredient.id)}
                              className="rounded"
                            />
                            Available
                          </label>
                          <label className="flex items-center gap-1 text-sm">
                            <input
                              type="checkbox"
                              checked={ingredient.inStock}
                              onChange={() => toggleIngredientStock(ingredient.id)}
                              className="rounded"
                            />
                            In Stock
                          </label>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditingIngredient(category.id, ingredient)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteIngredient(ingredient.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Subcategories with "Other" section if there are both */}
            {children.length > 0 && categoryIngredients.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="font-medium text-sm text-gray-700 mb-2">Subcategories:</h4>
              </div>
            )}

            {/* Render subcategories */}
            {children.map((child) => (
              <CategoryRenderer key={child.category.id} hierarchy={child} />
            ))}
          </div>
        )}
      </fieldset>
    );
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {isLoadingIngredients ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-tiki-accent"></div>
          <p className="mt-2 text-gray-600">Loading ingredients...</p>
        </div>
      ) : (
        <>
          {/* Top-level add category button */}
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-tiki-text">Ingredient Library</h3>
            <button
              onClick={() => startEditingCategory(null)}
              className="bg-tiki-accent text-white px-4 py-2 rounded-md hover:bg-tiki-accent-dark"
            >
              + Add Top-Level Category
            </button>
          </div>

          {/* Render category hierarchy */}
          {categoryHierarchy.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No categories yet. Create your first category to get started.
            </div>
          ) : (
            categoryHierarchy.map((hierarchy) => (
              <CategoryRenderer key={hierarchy.category.id} hierarchy={hierarchy} />
            ))
          )}
        </>
      )}

      {/* Modals */}
      {editingIngredient && (
        <IngredientFormModal
          ingredient={editingIngredient}
          categories={categories}
          onSave={handleIngredientSave}
          onCancel={cancelEditing}
          onChange={(field, value) =>
            setEditingIngredient((prev) => ({ ...prev!, [field]: value }))
          }
        />
      )}

      {editingCategory && (
        <CategoryFormModal
          isOpen={true}
          onClose={cancelEditing}
          category={editingCategory}
          onSave={handleCategorySave}
          onChange={(field: string, value: any) =>
            setEditingCategory((prev) => ({ ...prev!, [field]: value }))
          }
        />
      )}
    </div>
  );
}