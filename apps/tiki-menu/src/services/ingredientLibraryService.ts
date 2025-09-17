import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  writeBatch,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';

export interface Category {
  id: string;
  name: string;
  parentId: string | null;
  path: string[];
  level: number;
  order: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Ingredient {
  id: string;
  name: string;
  displayName: string;
  categoryId: string;
  categoryPath: string[];
  brand: string;
  available: boolean;
  inStock: boolean;
  abv?: number;
  description?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryWithContents {
  category: Category;
  subcategories: Category[];
  ingredients: Ingredient[];
}

export interface CategoryHierarchy {
  category: Category;
  children: CategoryHierarchy[];
  ingredients: Ingredient[];
}

class IngredientLibraryService {
  private categoriesCache: Category[] | null = null;
  private ingredientsCache: Ingredient[] | null = null;
  private lastFetch: number = 0;
  private readonly CACHE_TTL = 5000; // 5 seconds cache

  // Generate a stable ID for categories
  private generateCategoryId(name: string, parentId: string | null): string {
    const base = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return parentId ? `${parentId}_${base}` : `cat_${base}`;
  }

  // Generate a stable ID for ingredients
  private generateIngredientId(name: string, brand: string): string {
    const base = `${brand}_${name}`.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return `ing_${base}`;
  }

  // Load all categories (with caching)
  async getAllCategories(forceRefresh = false): Promise<Category[]> {
    if (!forceRefresh && this.categoriesCache && Date.now() - this.lastFetch < this.CACHE_TTL) {
      return this.categoriesCache;
    }

    const snapshot = await getDocs(query(
      collection(db, 'categories'),
      orderBy('level'),
      orderBy('order'),
      orderBy('name')
    ));

    this.categoriesCache = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    } as Category));

    this.lastFetch = Date.now();
    return this.categoriesCache;
  }

  // Load all ingredients (with caching)
  async getAllIngredients(forceRefresh = false): Promise<Ingredient[]> {
    if (!forceRefresh && this.ingredientsCache && Date.now() - this.lastFetch < this.CACHE_TTL) {
      return this.ingredientsCache;
    }

    const snapshot = await getDocs(query(
      collection(db, 'ingredients'),
      orderBy('order'),
      orderBy('name')
    ));

    this.ingredientsCache = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    } as Ingredient));

    this.lastFetch = Date.now();
    return this.ingredientsCache;
  }

  // Clear cache
  clearCache(): void {
    this.categoriesCache = null;
    this.ingredientsCache = null;
    this.lastFetch = 0;
  }

  // Build category hierarchy from flat list
  async getCategoryHierarchy(): Promise<CategoryHierarchy[]> {
    const categories = await this.getAllCategories();
    const ingredients = await this.getAllIngredients();

    // Group ingredients by category
    const ingredientsByCategory = new Map<string, Ingredient[]>();
    ingredients.forEach(ingredient => {
      const list = ingredientsByCategory.get(ingredient.categoryId) || [];
      list.push(ingredient);
      ingredientsByCategory.set(ingredient.categoryId, list);
    });

    // Build hierarchy
    const categoryMap = new Map<string, Category>();
    const childrenMap = new Map<string, Category[]>();

    categories.forEach(cat => {
      categoryMap.set(cat.id, cat);
      if (cat.parentId) {
        const siblings = childrenMap.get(cat.parentId) || [];
        siblings.push(cat);
        childrenMap.set(cat.parentId, siblings);
      }
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

    // Get root categories and build hierarchy for each
    const rootCategories = categories.filter(cat => !cat.parentId);
    return rootCategories
      .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
      .map(cat => buildHierarchy(cat.id));
  }

  // Get category with its immediate children and ingredients
  async getCategoryWithContents(categoryId: string): Promise<CategoryWithContents> {
    const categories = await this.getAllCategories();
    const ingredients = await this.getAllIngredients();

    const category = categories.find(c => c.id === categoryId);
    if (!category) {
      throw new Error(`Category not found: ${categoryId}`);
    }

    const subcategories = categories
      .filter(c => c.parentId === categoryId)
      .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));

    const categoryIngredients = ingredients
      .filter(i => i.categoryId === categoryId)
      .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));

    return { category, subcategories, ingredients: categoryIngredients };
  }

  // Create a new category
  async createCategory(
    name: string,
    parentId: string | null = null,
    description?: string
  ): Promise<string> {
    const timestamp = new Date();
    const categoryId = this.generateCategoryId(name, parentId);

    // Get parent category to build path
    let path: string[] = [name.toLowerCase()];
    let level = 0;

    if (parentId) {
      const categories = await this.getAllCategories();
      const parent = categories.find(c => c.id === parentId);
      if (!parent) {
        throw new Error(`Parent category not found: ${parentId}`);
      }
      path = [...parent.path, name.toLowerCase()];
      level = parent.level + 1;
    }

    const categoryData: Omit<Category, 'id'> = {
      name,
      parentId,
      path,
      level,
      order: 0,
      description: description || '',
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await setDoc(doc(db, 'categories', categoryId), categoryData);
    this.clearCache();

    return categoryId;
  }

  // Create a new ingredient
  async createIngredient(
    categoryId: string,
    name: string,
    brand: string,
    displayName?: string,
    description?: string,
    abv?: number
  ): Promise<string> {
    const timestamp = new Date();
    const ingredientId = this.generateIngredientId(name, brand);

    // Get category to build path
    const categories = await this.getAllCategories();
    const category = categories.find(c => c.id === categoryId);
    if (!category) {
      throw new Error(`Category not found: ${categoryId}`);
    }

    const ingredientData: Omit<Ingredient, 'id'> = {
      name,
      displayName: displayName || (brand ? `${name} (${brand})` : name),
      categoryId,
      categoryPath: category.path,
      brand,
      available: true,
      inStock: true,
      description: description || '',
      order: 0,
      ...(abv !== undefined && !isNaN(abv) ? { abv } : {}),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await setDoc(doc(db, 'ingredients', ingredientId), ingredientData);
    this.clearCache();

    return ingredientId;
  }

  // Update category
  async updateCategory(categoryId: string, updates: Partial<Category>): Promise<void> {
    const cleanUpdates: any = {
      ...updates,
      updatedAt: new Date()
    };

    // Remove undefined values
    Object.keys(cleanUpdates).forEach(key => {
      if (cleanUpdates[key] === undefined) {
        delete cleanUpdates[key];
      }
    });

    await setDoc(doc(db, 'categories', categoryId), cleanUpdates, { merge: true });
    this.clearCache();
  }

  // Update ingredient
  async updateIngredient(ingredientId: string, updates: Partial<Ingredient>): Promise<void> {
    const cleanUpdates: any = {
      ...updates,
      updatedAt: new Date()
    };

    // Remove undefined values
    Object.keys(cleanUpdates).forEach(key => {
      if (cleanUpdates[key] === undefined) {
        delete cleanUpdates[key];
      }
    });

    // Handle ABV specially
    if ('abv' in updates) {
      if (updates.abv !== undefined && !isNaN(updates.abv!)) {
        cleanUpdates.abv = updates.abv;
      } else {
        cleanUpdates.abv = null;
      }
    }

    await setDoc(doc(db, 'ingredients', ingredientId), cleanUpdates, { merge: true });
    this.clearCache();
  }

  // Delete category and all its descendants
  async deleteCategory(categoryId: string): Promise<void> {
    const batch = writeBatch(db);

    // Get all categories and ingredients
    const categories = await this.getAllCategories();
    const ingredients = await this.getAllIngredients();

    // Find all descendant categories
    const toDelete = new Set<string>([categoryId]);
    let changed = true;
    while (changed) {
      changed = false;
      for (const cat of categories) {
        if (cat.parentId && toDelete.has(cat.parentId) && !toDelete.has(cat.id)) {
          toDelete.add(cat.id);
          changed = true;
        }
      }
    }

    // Delete all ingredients in these categories
    ingredients
      .filter(ing => toDelete.has(ing.categoryId))
      .forEach(ing => batch.delete(doc(db, 'ingredients', ing.id)));

    // Delete all categories
    toDelete.forEach(catId => batch.delete(doc(db, 'categories', catId)));

    await batch.commit();
    this.clearCache();
  }

  // Delete ingredient
  async deleteIngredient(ingredientId: string): Promise<void> {
    await deleteDoc(doc(db, 'ingredients', ingredientId));
    this.clearCache();
  }

  // Move ingredient to different category
  async moveIngredient(ingredientId: string, targetCategoryId: string): Promise<void> {
    const categories = await this.getAllCategories();
    const targetCategory = categories.find(c => c.id === targetCategoryId);

    if (!targetCategory) {
      throw new Error(`Target category not found: ${targetCategoryId}`);
    }

    await this.updateIngredient(ingredientId, {
      categoryId: targetCategoryId,
      categoryPath: targetCategory.path
    });
  }

  // Move category to different parent
  async moveCategory(categoryId: string, targetParentId: string | null): Promise<void> {
    const batch = writeBatch(db);
    const categories = await this.getAllCategories();
    const ingredients = await this.getAllIngredients();

    const category = categories.find(c => c.id === categoryId);
    if (!category) {
      throw new Error(`Category not found: ${categoryId}`);
    }

    // Build new path
    let newPath: string[];
    let newLevel: number;

    if (targetParentId) {
      const targetParent = categories.find(c => c.id === targetParentId);
      if (!targetParent) {
        throw new Error(`Target parent category not found: ${targetParentId}`);
      }
      newPath = [...targetParent.path, category.name.toLowerCase()];
      newLevel = targetParent.level + 1;
    } else {
      newPath = [category.name.toLowerCase()];
      newLevel = 0;
    }

    // Update the category itself
    batch.update(doc(db, 'categories', categoryId), {
      parentId: targetParentId,
      path: newPath,
      level: newLevel,
      updatedAt: Timestamp.now()
    });

    // Find all descendant categories and update their paths and levels
    const descendants = new Map<string, Category>();
    const findDescendants = (parentId: string, parentPath: string[], parentLevel: number) => {
      categories
        .filter(c => c.parentId === parentId)
        .forEach(child => {
          const childPath = [...parentPath, child.name.toLowerCase()];
          const childLevel = parentLevel + 1;
          descendants.set(child.id, { ...child, path: childPath, level: childLevel });
          findDescendants(child.id, childPath, childLevel);
        });
    };
    findDescendants(categoryId, newPath, newLevel);

    // Update all descendant categories
    descendants.forEach((cat, id) => {
      batch.update(doc(db, 'categories', id), {
        path: cat.path,
        level: cat.level,
        updatedAt: Timestamp.now()
      });
    });

    // Update all ingredients in this category and descendants
    const affectedCategoryIds = new Set([categoryId, ...descendants.keys()]);
    ingredients
      .filter(ing => affectedCategoryIds.has(ing.categoryId))
      .forEach(ing => {
        const cat = ing.categoryId === categoryId ?
          { path: newPath } :
          descendants.get(ing.categoryId)!;

        batch.update(doc(db, 'ingredients', ing.id), {
          categoryPath: cat.path,
          updatedAt: Timestamp.now()
        });
      });

    await batch.commit();
    this.clearCache();
  }

  // Backwards compatibility methods
  async getTopLevelCategories(): Promise<Category[]> {
    const categories = await this.getAllCategories();
    return categories.filter(c => !c.parentId);
  }

  async updateIngredientAvailability(ingredientId: string, available: boolean): Promise<void> {
    await this.updateIngredient(ingredientId, { available });
  }
}

export const ingredientLibraryService = new IngredientLibraryService();