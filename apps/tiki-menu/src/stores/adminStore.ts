import { create } from 'zustand';
import {
  ingredientLibraryService,
  type Category,
  type Ingredient,
  type CategoryHierarchy,
} from '../services/ingredientLibraryService';
import { recipeService, type Recipe } from '../services/recipeService';
import { recipeCategoryService, type RecipeCategory } from '../services/recipeCategoryService';

interface AdminState {
  // Flattened data
  categories: Category[];
  ingredients: Ingredient[];
  recipes: Recipe[];
  recipeCategories: RecipeCategory[];

  // Computed hierarchy (built client-side)
  categoryHierarchy: CategoryHierarchy[];

  // Loading States
  isLoadingIngredients: boolean;
  isLoadingRecipes: boolean;
  isLoadingRecipeCategories: boolean;

  // Operation States (for progress indicator)
  operationsInProgress: Set<string>;

  // Error States
  error: string | null;

  // Actions
  loadIngredientLibrary: () => Promise<void>;
  loadRecipes: () => Promise<void>;
  loadRecipeCategories: () => Promise<void>;

  // Ingredient Actions
  createIngredient: (categoryId: string, ingredient: Omit<Ingredient, 'id' | 'categoryId' | 'categoryPath' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateIngredient: (ingredientId: string, updates: Partial<Ingredient>) => Promise<void>;
  deleteIngredient: (ingredientId: string) => Promise<void>;
  moveIngredient: (ingredientId: string, targetCategoryId: string) => Promise<void>;
  toggleIngredientAvailability: (ingredientId: string) => Promise<void>;
  toggleIngredientStock: (ingredientId: string) => Promise<void>;

  // Category Actions
  createCategory: (name: string, parentId: string | null, description?: string) => Promise<void>;
  updateCategory: (categoryId: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
  moveCategory: (categoryId: string, targetParentId: string | null) => Promise<void>;

  // Recipe Actions
  createRecipe: (recipe: Omit<Recipe, 'id'>) => Promise<void>;
  updateRecipe: (id: string, updates: Partial<Recipe>) => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;
  toggleRecipeActive: (id: string) => Promise<void>;

  // Recipe Category Actions
  createRecipeCategory: (name: string, description?: string, order?: number) => Promise<void>;
  updateRecipeCategory: (categoryId: string, updates: Partial<Omit<RecipeCategory, 'id' | 'createdAt'>>) => Promise<void>;
  deleteRecipeCategory: (categoryId: string) => Promise<void>;
  initializeDefaultRecipeCategories: () => Promise<void>;
  reorderRecipeCategories: (categoryOrders: { id: string; order: number }[]) => Promise<void>;

  // Utility Actions
  clearError: () => void;
  reset: () => void;

  // Operation Tracking
  startOperation: (operationId: string) => void;
  endOperation: (operationId: string) => void;

  // Helper functions
  getCategoryById: (id: string) => Category | undefined;
  getIngredientById: (id: string) => Ingredient | undefined;
  getIngredientsByCategory: (categoryId: string) => Ingredient[];
  getCategoryPath: (categoryId: string) => string;
  getRecipeCategoryById: (id: string) => RecipeCategory | undefined;
}

// Helper to build category hierarchy
const buildCategoryHierarchy = (categories: Category[], ingredients: Ingredient[]): CategoryHierarchy[] => {
  const categoryMap = new Map<string, Category>();
  const childrenMap = new Map<string, Category[]>();
  const ingredientsByCategory = new Map<string, Ingredient[]>();

  // Build maps
  categories.forEach(cat => {
    categoryMap.set(cat.id, cat);
    if (cat.parentId) {
      const siblings = childrenMap.get(cat.parentId) || [];
      siblings.push(cat);
      childrenMap.set(cat.parentId, siblings);
    }
  });

  ingredients.forEach(ing => {
    const list = ingredientsByCategory.get(ing.categoryId) || [];
    list.push(ing);
    ingredientsByCategory.set(ing.categoryId, list);
  });

  // Recursive function to build hierarchy
  const buildHierarchy = (categoryId: string): CategoryHierarchy => {
    const category = categoryMap.get(categoryId)!;
    const children = (childrenMap.get(categoryId) || [])
      .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
      .map(child => buildHierarchy(child.id));
    const catIngredients = (ingredientsByCategory.get(categoryId) || [])
      .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));

    return {
      category,
      children,
      ingredients: catIngredients
    };
  };

  // Get root categories and build hierarchy
  const rootCategories = categories.filter(cat => !cat.parentId);
  return rootCategories
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
    .map(cat => buildHierarchy(cat.id));
};

export const useAdminStore = create<AdminState>()((set, get) => ({
  // Initial State
  categories: [],
  ingredients: [],
  recipes: [],
  recipeCategories: [],
  categoryHierarchy: [],
  isLoadingIngredients: false,
  isLoadingRecipes: false,
  isLoadingRecipeCategories: false,
  operationsInProgress: new Set<string>(),
  error: null,

  // Load Ingredient Library
  loadIngredientLibrary: async () => {
    const state = get();
    if (state.isLoadingIngredients) return;

    set({ isLoadingIngredients: true, error: null });

    try {
      // Load all data in parallel
      const [categories, ingredients] = await Promise.all([
        ingredientLibraryService.getAllCategories(true),
        ingredientLibraryService.getAllIngredients(true)
      ]);

      // Build hierarchy
      const hierarchy = buildCategoryHierarchy(categories, ingredients);

      set({
        categories,
        ingredients,
        categoryHierarchy: hierarchy,
        isLoadingIngredients: false,
      });
    } catch (error) {
      console.error('Error loading ingredient library:', error);
      set({
        isLoadingIngredients: false,
        error: error instanceof Error ? error.message : 'Failed to load ingredient library',
      });
    }
  },

  // Load Recipes
  loadRecipes: async () => {
    const state = get();
    if (state.isLoadingRecipes) return;

    set({ isLoadingRecipes: true, error: null });

    try {
      const recipes = await recipeService.getAllRecipes(true);
      set({ recipes, isLoadingRecipes: false });
    } catch (error) {
      console.error('Error loading recipes:', error);
      set({
        isLoadingRecipes: false,
        error: error instanceof Error ? error.message : 'Failed to load recipes',
      });
    }
  },

  // Load Recipe Categories
  loadRecipeCategories: async () => {
    const state = get();
    if (state.isLoadingRecipeCategories) return;

    set({ isLoadingRecipeCategories: true, error: null });

    try {
      const recipeCategories = await recipeCategoryService.getAllRecipeCategories(true);
      set({ recipeCategories, isLoadingRecipeCategories: false });
    } catch (error) {
      console.error('Error loading recipe categories:', error);
      set({
        isLoadingRecipeCategories: false,
        error: error instanceof Error ? error.message : 'Failed to load recipe categories',
      });
    }
  },

  // Create Ingredient
  createIngredient: async (categoryId, ingredientData) => {
    const operationId = `create-ingredient-${categoryId}`;
    try {
      get().startOperation(operationId);

      await ingredientLibraryService.createIngredient(
        categoryId,
        ingredientData.name,
        ingredientData.brand,
        ingredientData.displayName,
        ingredientData.description,
        ingredientData.abv
      );

      // Reload data
      await get().loadIngredientLibrary();
    } catch (error) {
      console.error('Error creating ingredient:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to create ingredient' });
    } finally {
      get().endOperation(operationId);
    }
  },

  // Update Ingredient
  updateIngredient: async (ingredientId, updates) => {
    const operationId = `update-ingredient-${ingredientId}`;
    try {
      get().startOperation(operationId);

      // Optimistic update
      set((state) => ({
        ingredients: state.ingredients.map(ing =>
          ing.id === ingredientId ? { ...ing, ...updates, updatedAt: new Date() } : ing
        ),
      }));

      await ingredientLibraryService.updateIngredient(ingredientId, updates);

      // Rebuild hierarchy
      const state = get();
      set({ categoryHierarchy: buildCategoryHierarchy(state.categories, state.ingredients) });
    } catch (error) {
      console.error('Error updating ingredient:', error);
      await get().loadIngredientLibrary();
      set({ error: error instanceof Error ? error.message : 'Failed to update ingredient' });
    } finally {
      get().endOperation(operationId);
    }
  },

  // Delete Ingredient
  deleteIngredient: async (ingredientId) => {
    try {
      // Optimistic update
      set((state) => ({
        ingredients: state.ingredients.filter(ing => ing.id !== ingredientId),
      }));

      await ingredientLibraryService.deleteIngredient(ingredientId);

      // Rebuild hierarchy
      const state = get();
      set({ categoryHierarchy: buildCategoryHierarchy(state.categories, state.ingredients) });
    } catch (error) {
      console.error('Error deleting ingredient:', error);
      await get().loadIngredientLibrary();
      set({ error: error instanceof Error ? error.message : 'Failed to delete ingredient' });
    }
  },

  // Move Ingredient
  moveIngredient: async (ingredientId, targetCategoryId) => {
    const operationId = `move-ingredient-${ingredientId}`;
    try {
      get().startOperation(operationId);

      const state = get();
      const targetCategory = state.categories.find(c => c.id === targetCategoryId);
      if (!targetCategory) throw new Error('Target category not found');

      // Optimistic update
      set((state) => ({
        ingredients: state.ingredients.map(ing =>
          ing.id === ingredientId
            ? { ...ing, categoryId: targetCategoryId, categoryPath: targetCategory.path, updatedAt: new Date() }
            : ing
        ),
      }));

      await ingredientLibraryService.moveIngredient(ingredientId, targetCategoryId);

      // Rebuild hierarchy
      const newState = get();
      set({ categoryHierarchy: buildCategoryHierarchy(newState.categories, newState.ingredients) });
    } catch (error) {
      console.error('Error moving ingredient:', error);
      await get().loadIngredientLibrary();
      set({ error: error instanceof Error ? error.message : 'Failed to move ingredient' });
    } finally {
      get().endOperation(operationId);
    }
  },

  // Toggle Ingredient Availability
  toggleIngredientAvailability: async (ingredientId) => {
    const ingredient = get().ingredients.find(ing => ing.id === ingredientId);
    if (ingredient) {
      await get().updateIngredient(ingredientId, { available: !ingredient.available });
    }
  },

  // Toggle Ingredient Stock
  toggleIngredientStock: async (ingredientId) => {
    const ingredient = get().ingredients.find(ing => ing.id === ingredientId);
    if (ingredient) {
      await get().updateIngredient(ingredientId, { inStock: !ingredient.inStock });
    }
  },

  // Create Category
  createCategory: async (name, parentId, description) => {
    try {
      await ingredientLibraryService.createCategory(name, parentId, description);
      await get().loadIngredientLibrary();
    } catch (error) {
      console.error('Error creating category:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to create category' });
    }
  },

  // Update Category
  updateCategory: async (categoryId, updates) => {
    try {
      await ingredientLibraryService.updateCategory(categoryId, updates);
      await get().loadIngredientLibrary();
    } catch (error) {
      console.error('Error updating category:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to update category' });
    }
  },

  // Delete Category
  deleteCategory: async (categoryId) => {
    try {
      await ingredientLibraryService.deleteCategory(categoryId);
      await get().loadIngredientLibrary();
    } catch (error) {
      console.error('Error deleting category:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to delete category' });
    }
  },

  // Move Category
  moveCategory: async (categoryId, targetParentId) => {
    try {
      await ingredientLibraryService.moveCategory(categoryId, targetParentId);
      await get().loadIngredientLibrary();
    } catch (error) {
      console.error('Error moving category:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to move category' });
    }
  },

  // Create Recipe
  createRecipe: async (recipeData) => {
    try {
      await recipeService.createRecipe(recipeData);
      await get().loadRecipes();
    } catch (error) {
      console.error('Error creating recipe:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to create recipe' });
    }
  },

  // Update Recipe
  updateRecipe: async (id, updates) => {
    const operationId = `update-recipe-${id}`;
    try {
      get().startOperation(operationId);

      // Optimistic update
      set((state) => ({
        recipes: state.recipes.map(recipe =>
          recipe.id === id ? { ...recipe, ...updates, updatedAt: new Date() } : recipe
        ),
      }));

      await recipeService.updateRecipe(id, updates);
    } catch (error) {
      console.error('Error updating recipe:', error);
      await get().loadRecipes();
      set({ error: error instanceof Error ? error.message : 'Failed to update recipe' });
    } finally {
      get().endOperation(operationId);
    }
  },

  // Delete Recipe
  deleteRecipe: async (id) => {
    try {
      // Optimistic update
      set((state) => ({
        recipes: state.recipes.filter(recipe => recipe.id !== id),
      }));

      await recipeService.deleteRecipe(id);
    } catch (error) {
      console.error('Error deleting recipe:', error);
      await get().loadRecipes();
      set({ error: error instanceof Error ? error.message : 'Failed to delete recipe' });
    }
  },

  // Toggle Recipe Active
  toggleRecipeActive: async (id) => {
    const recipe = get().recipes.find(r => r.id === id);
    if (recipe) {
      await get().updateRecipe(id, { active: !recipe.active });
    }
  },

  // Create Recipe Category
  createRecipeCategory: async (name, description, order) => {
    try {
      await recipeCategoryService.createRecipeCategory(name, description, order);
      await get().loadRecipeCategories();
    } catch (error) {
      console.error('Error creating recipe category:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to create recipe category' });
    }
  },

  // Update Recipe Category
  updateRecipeCategory: async (categoryId, updates) => {
    const operationId = `update-recipe-category-${categoryId}`;
    try {
      get().startOperation(operationId);

      // Optimistic update
      set((state) => ({
        recipeCategories: state.recipeCategories.map(cat =>
          cat.id === categoryId ? { ...cat, ...updates, updatedAt: new Date() } : cat
        ),
      }));

      await recipeCategoryService.updateRecipeCategory(categoryId, updates);
    } catch (error) {
      console.error('Error updating recipe category:', error);
      await get().loadRecipeCategories();
      set({ error: error instanceof Error ? error.message : 'Failed to update recipe category' });
    } finally {
      get().endOperation(operationId);
    }
  },

  // Delete Recipe Category
  deleteRecipeCategory: async (categoryId) => {
    try {
      // Check if category is in use by any recipes
      const state = get();
      const categoryToDelete = state.recipeCategories.find(c => c.id === categoryId);
      if (!categoryToDelete) {
        throw new Error('Category not found');
      }

      // For now, recipes use category names as strings, so we need to check by name
      // TODO: In the future, recipes should use category IDs
      const recipesUsingCategory = state.recipes.filter(recipe => recipe.category === categoryToDelete.name);

      if (recipesUsingCategory.length > 0) {
        throw new Error(`Cannot delete category. It is used by ${recipesUsingCategory.length} recipe(s).`);
      }

      // Optimistic update
      set((state) => ({
        recipeCategories: state.recipeCategories.filter(cat => cat.id !== categoryId),
      }));

      await recipeCategoryService.deleteRecipeCategory(categoryId);
    } catch (error) {
      console.error('Error deleting recipe category:', error);
      await get().loadRecipeCategories();
      set({ error: error instanceof Error ? error.message : 'Failed to delete recipe category' });
    }
  },

  // Initialize Default Recipe Categories
  initializeDefaultRecipeCategories: async () => {
    try {
      await recipeCategoryService.initializeDefaultCategories();
      await get().loadRecipeCategories();
    } catch (error) {
      console.error('Error initializing default recipe categories:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to initialize default recipe categories' });
    }
  },

  // Reorder Recipe Categories
  reorderRecipeCategories: async (categoryOrders) => {
    try {
      // Optimistic update
      set((state) => ({
        recipeCategories: state.recipeCategories.map(cat => {
          const orderUpdate = categoryOrders.find(co => co.id === cat.id);
          return orderUpdate ? { ...cat, order: orderUpdate.order } : cat;
        }).sort((a, b) => a.order - b.order),
      }));

      await recipeCategoryService.reorderCategories(categoryOrders);
    } catch (error) {
      console.error('Error reordering recipe categories:', error);
      await get().loadRecipeCategories();
      set({ error: error instanceof Error ? error.message : 'Failed to reorder recipe categories' });
    }
  },

  // Clear Error
  clearError: () => set({ error: null }),

  // Reset Store
  reset: () => set({
    categories: [],
    ingredients: [],
    recipes: [],
    recipeCategories: [],
    categoryHierarchy: [],
    isLoadingIngredients: false,
    isLoadingRecipes: false,
    isLoadingRecipeCategories: false,
    operationsInProgress: new Set<string>(),
    error: null,
  }),

  // Operation Tracking
  startOperation: (operationId: string) => {
    set((state) => ({
      operationsInProgress: new Set([...state.operationsInProgress, operationId]),
    }));
  },

  endOperation: (operationId: string) => {
    set((state) => {
      const newSet = new Set(state.operationsInProgress);
      newSet.delete(operationId);
      return { operationsInProgress: newSet };
    });
  },

  // Helper functions
  getCategoryById: (id: string) => {
    return get().categories.find(cat => cat.id === id);
  },

  getIngredientById: (id: string) => {
    return get().ingredients.find(ing => ing.id === id);
  },

  getIngredientsByCategory: (categoryId: string) => {
    return get().ingredients.filter(ing => ing.categoryId === categoryId);
  },

  getCategoryPath: (categoryId: string) => {
    const categories = get().categories;
    const category = categories.find(c => c.id === categoryId);
    if (!category) return '';

    const pathParts: string[] = [];
    let current: Category | undefined = category;

    while (current) {
      pathParts.unshift(current.name);
      current = current.parentId ? categories.find(c => c.id === current!.parentId) : undefined;
    }

    return pathParts.join(' › ');
  },

  getRecipeCategoryById: (id: string) => {
    return get().recipeCategories.find(cat => cat.id === id);
  },
}));

// Selectors for commonly used derived state
export const useCategories = () => useAdminStore(state => state.categories);
export const useIngredients = () => useAdminStore(state => state.ingredients);
export const useRecipes = () => useAdminStore(state => state.recipes);
export const useRecipeCategories = () => useAdminStore(state => state.recipeCategories);
export const useCategoryHierarchy = () => useAdminStore(state => state.categoryHierarchy);
export const useAdminLoading = () => useAdminStore(state => ({
  isLoadingIngredients: state.isLoadingIngredients,
  isLoadingRecipes: state.isLoadingRecipes,
  isLoadingRecipeCategories: state.isLoadingRecipeCategories,
}));
export const useAdminError = () => useAdminStore(state => state.error);
export const useOperationsInProgress = () => useAdminStore(state => state.operationsInProgress.size > 0);