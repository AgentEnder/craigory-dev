import {
  collection,
  doc,
  getDocs,
  updateDoc,
  setDoc,
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase';

export interface RecipeIngredient {
  // Reference to specific ingredient ID
  ingredientId?: string;
  // Reference to category ID for flexible selection
  categoryId?: string;
  // Custom ingredient not in library
  customName?: string;
  // Common fields
  amount: number;
  unit: string; // "oz", "ml", "dash", etc
  optional?: boolean;
  notes?: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  category: string;
  ingredients: RecipeIngredient[];
  instructions: string[];

  // Menu-specific fields
  strength?: 'light' | 'medium' | 'strong' | null;
  isSpecial?: boolean;
  isBitter?: boolean;
  servingSize?: number; // Number of people
  glassType?: string;
  garnish?: string[];
  notes?: string;

  // Metadata
  order: number;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

class RecipeService {
  private recipesCache: Recipe[] | null = null;
  private lastFetch: number = 0;
  private readonly CACHE_TTL = 5000; // 5 seconds cache

  // Load all recipes (with caching)
  async getAllRecipes(forceRefresh = false): Promise<Recipe[]> {
    if (!forceRefresh && this.recipesCache && Date.now() - this.lastFetch < this.CACHE_TTL) {
      return this.recipesCache;
    }

    const snapshot = await getDocs(query(
      collection(db, 'recipes'),
      orderBy('category'),
      orderBy('order'),
      orderBy('name')
    ));

    this.recipesCache = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    } as Recipe));

    this.lastFetch = Date.now();
    return this.recipesCache;
  }

  // Get active recipes only
  async getActiveRecipes(): Promise<Recipe[]> {
    const allRecipes = await this.getAllRecipes();
    return allRecipes.filter(r => r.active);
  }

  // Clear cache
  clearCache(): void {
    this.recipesCache = null;
    this.lastFetch = 0;
  }

  // Create recipe
  async createRecipe(recipe: Omit<Recipe, 'id'>): Promise<string> {
    const docRef = doc(collection(db, 'recipes'));
    const timestamp = new Date();

    const recipeData = {
      ...recipe,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await setDoc(docRef, recipeData);
    this.clearCache();
    return docRef.id;
  }

  // Update recipe
  async updateRecipe(recipeId: string, updates: Partial<Recipe>): Promise<void> {
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

    await updateDoc(doc(db, 'recipes', recipeId), cleanUpdates);
    this.clearCache();
  }

  // Delete recipe
  async deleteRecipe(recipeId: string): Promise<void> {
    await deleteDoc(doc(db, 'recipes', recipeId));
    this.clearCache();
  }

  // Initialize with sample recipes (for demo purposes)
  async initializeRecipes(): Promise<void> {
    const defaultRecipes: Omit<Recipe, 'id'>[] = [
      // Classic Tiki
      {
        name: 'Mai Tai',
        description: 'The king of tiki drinks with aged rum, orgeat, and citrus',
        category: 'Classic Tiki',
        ingredients: [
          { categoryId: 'cat_rum_aged', amount: 2, unit: 'oz', notes: 'Preferably Jamaican' },
          { customName: 'Orgeat', amount: 0.5, unit: 'oz' },
          { customName: 'Orange Curacao', amount: 0.5, unit: 'oz' },
          { customName: 'Fresh Lime Juice', amount: 1, unit: 'oz' }
        ],
        instructions: [
          'Add all ingredients to shaker with ice',
          'Shake well',
          'Strain over crushed ice',
          'Garnish with mint sprig and lime wheel'
        ],
        strength: 'strong',
        isSpecial: true,
        active: true,
        glassType: 'Double rocks glass',
        garnish: ['Mint sprig', 'Lime wheel'],
        servingSize: 1,
        order: 1
      },
      {
        name: 'Zombie',
        description: 'A potent blend of three rums and tropical juices',
        category: 'Classic Tiki',
        ingredients: [
          { categoryId: 'cat_rum_light', amount: 1, unit: 'oz' },
          { categoryId: 'cat_rum_dark', amount: 1, unit: 'oz' },
          { categoryId: 'cat_rum_overproof', amount: 1, unit: 'oz', notes: '151 proof' },
          { customName: 'Pineapple Juice', amount: 2, unit: 'oz' },
          { customName: 'Grenadine', amount: 0.5, unit: 'oz' },
          { customName: 'Angostura Bitters', amount: 2, unit: 'dash' }
        ],
        instructions: [
          'Combine all ingredients in shaker with ice',
          'Shake vigorously',
          'Strain into tall glass over crushed ice',
          'Garnish with pineapple wedge and cherry'
        ],
        strength: 'strong',
        isBitter: true,
        active: true,
        glassType: 'Zombie glass',
        garnish: ['Pineapple wedge', 'Cherry'],
        servingSize: 1,
        order: 2
      },
      {
        name: 'Navy Grog',
        description: "Traditional sailors' refreshment with a modern twist",
        category: 'Classic Tiki',
        ingredients: [
          { categoryId: 'cat_rum_dark', amount: 1, unit: 'oz' },
          { categoryId: 'cat_rum_light', amount: 1, unit: 'oz' },
          { customName: 'Fresh Grapefruit Juice', amount: 1, unit: 'oz' },
          { customName: 'Honey Syrup', amount: 0.5, unit: 'oz' },
          { customName: 'Fresh Lime Juice', amount: 0.5, unit: 'oz' },
          { customName: 'Allspice Dram', amount: 0.25, unit: 'oz' }
        ],
        instructions: [
          'Shake all ingredients with ice',
          'Strain over crushed ice in a double rocks glass',
          'Garnish with lime wheel'
        ],
        strength: 'medium',
        active: true,
        glassType: 'Double rocks glass',
        garnish: ['Lime wheel'],
        servingSize: 1,
        order: 3
      },

      // Tropical Paradise
      {
        name: 'Blue Hawaii',
        description: 'Azure waves of coconut and pineapple bliss',
        category: 'Tropical Paradise',
        ingredients: [
          { categoryId: 'cat_vodka', amount: 1.5, unit: 'oz' },
          { customName: 'Blue Curacao', amount: 0.5, unit: 'oz' },
          { customName: 'Pineapple Juice', amount: 2, unit: 'oz' },
          { customName: 'Coconut Cream', amount: 1, unit: 'oz' }
        ],
        instructions: [
          'Blend all ingredients with ice',
          'Pour into hurricane glass',
          'Garnish with pineapple wedge and umbrella'
        ],
        strength: 'medium',
        active: true,
        glassType: 'Hurricane glass',
        garnish: ['Pineapple wedge', 'Cocktail umbrella'],
        servingSize: 1,
        order: 1
      },
      {
        name: 'Piña Colada',
        description: 'Creamy coconut and pineapple perfection',
        category: 'Tropical Paradise',
        ingredients: [
          { categoryId: 'cat_rum_light', amount: 2, unit: 'oz' },
          { customName: 'Coconut Cream', amount: 2, unit: 'oz' },
          { customName: 'Pineapple Juice', amount: 3, unit: 'oz' },
          { customName: 'Crushed Ice', amount: 1, unit: 'cup' }
        ],
        instructions: [
          'Blend all ingredients until smooth',
          'Pour into hurricane glass',
          'Garnish with pineapple wedge and cherry'
        ],
        strength: 'light',
        active: true,
        glassType: 'Hurricane glass',
        garnish: ['Pineapple wedge', 'Cherry'],
        servingSize: 1,
        order: 2
      },
      {
        name: 'Painkiller',
        description: 'Smooth sailing with rum, pineapple, and coconut',
        category: 'Tropical Paradise',
        ingredients: [
          { categoryId: 'cat_rum_dark', amount: 2, unit: 'oz' },
          { customName: 'Pineapple Juice', amount: 4, unit: 'oz' },
          { customName: 'Orange Juice', amount: 1, unit: 'oz' },
          { customName: 'Coconut Cream', amount: 1, unit: 'oz' }
        ],
        instructions: [
          'Shake all ingredients with ice',
          'Strain over ice in a hurricane glass',
          'Dust with nutmeg and garnish with pineapple'
        ],
        strength: 'medium',
        active: true,
        glassType: 'Hurricane glass',
        garnish: ['Pineapple wedge', 'Grated nutmeg'],
        servingSize: 1,
        order: 3
      },

      // House Specials
      {
        name: 'Volcano Bowl',
        description: 'A flaming spectacle meant for sharing',
        category: 'House Specials',
        ingredients: [
          { categoryId: 'cat_rum_dark', amount: 2, unit: 'oz' },
          { categoryId: 'cat_rum_light', amount: 2, unit: 'oz' },
          { categoryId: 'cat_brandy', amount: 1, unit: 'oz' },
          { customName: 'Pineapple Juice', amount: 4, unit: 'oz' },
          { customName: 'Orange Juice', amount: 2, unit: 'oz' },
          { customName: 'Grenadine', amount: 1, unit: 'oz' },
          { categoryId: 'cat_rum_overproof', amount: 0.5, unit: 'oz', notes: 'For flaming', optional: true }
        ],
        instructions: [
          'Mix all ingredients except overproof rum',
          'Pour over ice in volcano bowl',
          'Float overproof rum in center well',
          'Ignite carefully (optional)',
          'Serve with long straws'
        ],
        strength: 'strong',
        isSpecial: true,
        active: true,
        glassType: 'Volcano bowl',
        servingSize: 4,
        order: 1
      },
      {
        name: 'Scorpion Bowl',
        description: 'Group adventure in a bowl',
        category: 'House Specials',
        ingredients: [
          { categoryId: 'cat_rum_light', amount: 2, unit: 'oz' },
          { categoryId: 'cat_brandy', amount: 1, unit: 'oz' },
          { customName: 'Orgeat', amount: 1.5, unit: 'oz' },
          { customName: 'Orange Juice', amount: 2, unit: 'oz' },
          { customName: 'Pineapple Juice', amount: 2, unit: 'oz' }
        ],
        instructions: [
          'Combine all ingredients over ice',
          'Stir well',
          'Serve in large bowl with multiple straws',
          'Garnish with fresh fruits'
        ],
        strength: 'strong',
        isSpecial: true,
        active: true,
        glassType: 'Scorpion bowl',
        garnish: ['Orange slices', 'Pineapple wedges', 'Cherries'],
        servingSize: 4,
        order: 2
      },

      // Zero Proof
      {
        name: 'Virgin Colada',
        description: 'All the tropical flavor, none of the rum',
        category: 'Zero Proof',
        ingredients: [
          { customName: 'Coconut Cream', amount: 2, unit: 'oz' },
          { customName: 'Pineapple Juice', amount: 4, unit: 'oz' },
          { customName: 'Crushed Ice', amount: 1, unit: 'cup' }
        ],
        instructions: [
          'Blend all ingredients until smooth',
          'Pour into hurricane glass',
          'Garnish with pineapple and cherry'
        ],
        strength: null,
        active: true,
        glassType: 'Hurricane glass',
        garnish: ['Pineapple wedge', 'Cherry'],
        servingSize: 1,
        order: 1
      },
      {
        name: 'Tropical Sunset',
        description: 'Layers of fruit juices creating a sunset in your glass',
        category: 'Zero Proof',
        ingredients: [
          { customName: 'Orange Juice', amount: 2, unit: 'oz' },
          { customName: 'Pineapple Juice', amount: 2, unit: 'oz' },
          { customName: 'Grenadine', amount: 0.5, unit: 'oz' },
          { customName: 'Lime Juice', amount: 0.5, unit: 'oz' }
        ],
        instructions: [
          'Fill glass with ice',
          'Pour orange and pineapple juice',
          'Slowly add grenadine to create layers',
          'Top with lime juice',
          'Garnish with orange slice'
        ],
        strength: null,
        active: true,
        glassType: 'Highball glass',
        garnish: ['Orange slice'],
        servingSize: 1,
        order: 2
      },
    ];

    const promises = defaultRecipes.map(recipe => this.createRecipe(recipe));
    await Promise.all(promises);
  }
}

export const recipeService = new RecipeService();