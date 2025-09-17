import { useState, useEffect } from 'react';
import { recipeService, type Recipe } from '../src/services/recipeService';
import { useAdminStore, useIngredients, useRecipeCategories } from '../src/stores/adminStore';
import { EnhancedRecipeEditor } from './EnhancedRecipeEditor';
import { RecipeCategoryFormModal } from './RecipeCategoryFormModal';
import type { RecipeCategory } from '../src/services/recipeCategoryService';

interface RecipeManagementProps {
  // No longer need onRefresh since we use Zustand store
}

export function RecipeManagement({}: RecipeManagementProps) {
  // Get state and actions from Zustand store
  const {
    recipes,
    isLoadingRecipes,
    error,
    deleteRecipe,
    updateRecipe,
    clearError,
    loadRecipeCategories,
    updateRecipeCategory,
    deleteRecipeCategory,
    initializeDefaultRecipeCategories,
  } = useAdminStore();

  // Get ingredients to resolve names
  const allIngredients = useIngredients();

  // Get recipe categories
  const recipeCategories = useRecipeCategories();

  // Local component state
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [initializing, setInitializing] = useState(false);

  // Category management state
  const [editingCategory, setEditingCategory] = useState<RecipeCategory | null>(null);
  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);
  const [initializingCategories, setInitializingCategories] = useState(false);

  // Load recipe categories on mount
  useEffect(() => {
    loadRecipeCategories();
  }, [loadRecipeCategories]);

  // Clear error on mount
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const initializeRecipes = async () => {
    setInitializing(true);
    try {
      await recipeService.initializeRecipes();
      // Recipes will be automatically reloaded via Zustand store
    } catch (error) {
      console.error('Error initializing recipes:', error);
    } finally {
      setInitializing(false);
    }
  };

  const handleDeleteRecipe = async (recipeId: string, recipeName: string) => {
    if (!confirm(`Are you sure you want to delete "${recipeName}"?`)) return;
    await deleteRecipe(recipeId);
  };

  const toggleAvailability = async (recipe: Recipe) => {
    await updateRecipe(recipe.id, { active: !recipe.active });
  };

  const handleRecipeSaved = () => {
    setEditingRecipe(null);
    setShowCreateModal(false);
  };

  // Category management functions
  const initializeCategories = async () => {
    setInitializingCategories(true);
    try {
      await initializeDefaultRecipeCategories();
    } catch (error) {
      console.error('Error initializing categories:', error);
    } finally {
      setInitializingCategories(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    if (!confirm(`Are you sure you want to delete the category "${categoryName}"?`)) return;
    await deleteRecipeCategory(categoryId);
  };

  const handleCategorySaved = () => {
    setEditingCategory(null);
    setShowCreateCategoryModal(false);
  };

  // Helper function to get ingredient display name
  const getIngredientDisplayName = (ingredient: any): string => {
    if (typeof ingredient === 'string') {
      return ingredient; // Legacy format - just a string
    }

    if (ingredient.customName) {
      return ingredient.customName; // Custom ingredient
    }

    // Specific library ingredient - look up by ID
    if (ingredient.ingredientId) {
      const libraryIngredient = allIngredients.find(
        (ing) => ing.id === ingredient.ingredientId
      );
      return (
        libraryIngredient?.displayName ||
        libraryIngredient?.name ||
        'Unknown ingredient'
      );
    }

    // Category-based ingredient - show category name
    if (ingredient.categoryId) {
      const { getCategoryPath } = useAdminStore.getState();
      const categoryPath = getCategoryPath(ingredient.categoryId);
      return categoryPath ? `Any ${categoryPath}` : 'Unknown category';
    }

    return 'Unknown ingredient';
  };

  // Group recipes by category, ensuring all categories appear even if empty
  const groupedRecipes = recipeCategories.reduce((acc, category) => {
    acc[category.name] = recipes.filter(recipe => recipe.category === category.name);
    return acc;
  }, {} as Record<string, Recipe[]>);

  // Add any recipes that belong to categories not in our category list (for backwards compatibility)
  recipes.forEach(recipe => {
    if (!recipeCategories.find(cat => cat.name === recipe.category)) {
      if (!groupedRecipes[recipe.category]) {
        groupedRecipes[recipe.category] = [];
      }
      groupedRecipes[recipe.category].push(recipe);
    }
  });

  if (isLoadingRecipes) {
    return (
      <div className="text-center py-8">
        <div className="text-tiki-text">Loading recipes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">Error: {error}</div>
        <button
          onClick={clearError}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Dismiss
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-tiki-text">
          Recipe Management
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCreateCategoryModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 text-sm"
          >
            + Add Category
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
          >
            + Create Recipe
          </button>
          {recipes.length === 0 && (
            <button
              onClick={initializeRecipes}
              disabled={initializing}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
            >
              {initializing ? 'Initializing...' : 'Initialize Default Recipes'}
            </button>
          )}
          {recipeCategories.length === 0 && (
            <button
              onClick={initializeCategories}
              disabled={initializingCategories}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
            >
              {initializingCategories ? 'Initializing...' : 'Initialize Categories'}
            </button>
          )}
        </div>
      </div>


      {/* Recipe List */}
      {recipes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-tiki-text text-lg mb-4">No recipes found</div>
          <p className="text-tiki-text/70 mb-6">
            Get started by creating your first recipe or initializing with
            default recipes.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700"
            >
              Create Your First Recipe
            </button>
            <button
              onClick={initializeRecipes}
              disabled={initializing}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {initializing ? 'Initializing...' : 'Initialize Default Recipes'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedRecipes).map(([categoryName, categoryRecipes]) => {
            const categoryData = recipeCategories.find(cat => cat.name === categoryName);

            return (
              <div key={categoryName}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-tiki-text flex items-center gap-2">
                    {categoryName}
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-tiki-accent/10 text-tiki-accent">
                      {categoryRecipes.length}{' '}
                      {categoryRecipes.length === 1 ? 'recipe' : 'recipes'}
                    </span>
                    {categoryData && !categoryData.active && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        Inactive
                      </span>
                    )}
                  </h3>

                  {/* Inline Category Management Controls */}
                  {categoryData && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateRecipeCategory(categoryData.id, { active: !categoryData.active })}
                        className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                          categoryData.active
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-gray-600 text-white hover:bg-gray-700'
                        }`}
                        title={`${categoryData.active ? 'Deactivate' : 'Activate'} category`}
                      >
                        {categoryData.active ? '✓' : '✗'}
                      </button>
                      <button
                        onClick={() => setEditingCategory(categoryData)}
                        className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                        title="Edit category"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(categoryData.id, categoryData.name)}
                        className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
                        title="Delete category"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>

              <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                {categoryRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="bg-white border border-tiki-carved/30 rounded-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-tiki-text text-lg">
                          {recipe.name}
                        </h4>
                        <p className="text-sm text-tiki-text/80 mt-1">
                          {recipe.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 ml-3">
                        <button
                          onClick={() => toggleAvailability(recipe)}
                          className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                            recipe.active
                              ? 'bg-green-600 text-white hover:bg-green-700'
                              : 'bg-red-600 text-white hover:bg-red-700'
                          }`}
                          title="Toggle availability"
                        >
                          {recipe.active ? '✓' : '✗'}
                        </button>
                        <button
                          onClick={() => setEditingRecipe(recipe)}
                          className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                          title="Edit recipe"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteRecipe(recipe.id, recipe.name)
                          }
                          className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                          title="Delete recipe"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {/* Recipe Details */}
                    <div className="space-y-2 text-sm">
                      {/* Ingredients Preview */}
                      <div>
                        <span className="font-medium text-tiki-text">
                          Ingredients:{' '}
                        </span>
                        <span className="text-tiki-text/70">
                          {Array.isArray(recipe.ingredients) &&
                          recipe.ingredients.length > 0
                            ? recipe.ingredients.map(
                                (ing: any, idx: number) => {
                                  const name = getIngredientDisplayName(ing);
                                  return idx === recipe.ingredients.length - 1
                                    ? name
                                    : `${name}, `;
                                }
                              )
                            : 'No ingredients listed'}
                        </span>
                      </div>

                      {/* Recipe Information */}
                      <div className="flex flex-wrap gap-3 text-xs">
                        {recipe.glassType && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {recipe.glassType}
                          </span>
                        )}
                        {recipe.strength && (
                          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">
                            {recipe.strength}
                          </span>
                        )}
                        {recipe.servingSize && (
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                            Serves {recipe.servingSize}
                          </span>
                        )}
                        {recipe.isSpecial && (
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            Special
                          </span>
                        )}
                        {recipe.isBitter && (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
                            Contains Bitters
                          </span>
                        )}
                      </div>

                      {/* Instructions Preview */}
                      {Array.isArray(recipe.instructions) && recipe.instructions.length > 0 && (
                        <div>
                          <span className="font-medium text-tiki-text">
                            Instructions:{' '}
                          </span>
                          <span className="text-tiki-text/70">
                            {recipe.instructions.join('. ').length > 100
                              ? `${recipe.instructions.join('. ').substring(0, 100)}...`
                              : recipe.instructions.join('. ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            );
          })}
        </div>
      )}

      {/* Create Recipe Modal */}
      <EnhancedRecipeEditor
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleRecipeSaved}
        recipe={null}
      />

      {/* Edit Recipe Modal */}
      <EnhancedRecipeEditor
        isOpen={!!editingRecipe}
        onClose={() => setEditingRecipe(null)}
        onSave={handleRecipeSaved}
        recipe={editingRecipe}
      />

      {/* Create Category Modal */}
      {showCreateCategoryModal && (
        <RecipeCategoryFormModal
          isOpen={showCreateCategoryModal}
          onClose={() => setShowCreateCategoryModal(false)}
          onSave={handleCategorySaved}
          category={null}
        />
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <RecipeCategoryFormModal
          isOpen={!!editingCategory}
          onClose={() => setEditingCategory(null)}
          onSave={handleCategorySaved}
          category={editingCategory}
        />
      )}
    </div>
  );
}