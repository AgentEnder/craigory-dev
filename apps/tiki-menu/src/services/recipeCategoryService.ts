import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase';

export interface RecipeCategory {
  id: string;
  name: string;
  description?: string;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const COLLECTION_NAME = 'recipe-categories';

class RecipeCategoryService {
  async getAllRecipeCategories(includeInactive = false): Promise<RecipeCategory[]> {
    try {
      const categoriesRef = collection(db, COLLECTION_NAME);
      const q = query(categoriesRef, orderBy('order'), orderBy('name'));
      const snapshot = await getDocs(q);

      const categories = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          description: data.description,
          order: data.order || 0,
          active: data.active !== false, // Default to true if not specified
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as RecipeCategory;
      });

      return includeInactive ? categories : categories.filter(cat => cat.active);
    } catch (error) {
      console.error('Error fetching recipe categories:', error);
      throw new Error('Failed to fetch recipe categories');
    }
  }

  async createRecipeCategory(
    name: string,
    description?: string,
    order?: number
  ): Promise<string> {
    try {
      const now = Timestamp.now();
      const categoriesRef = collection(db, COLLECTION_NAME);

      // If no order specified, use the next available order
      if (order === undefined) {
        const existingCategories = await this.getAllRecipeCategories(true);
        order = Math.max(0, ...existingCategories.map(c => c.order)) + 1;
      }

      const docRef = await addDoc(categoriesRef, {
        name,
        description: description || '',
        order,
        active: true,
        createdAt: now,
        updatedAt: now,
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating recipe category:', error);
      throw new Error('Failed to create recipe category');
    }
  }

  async updateRecipeCategory(
    categoryId: string,
    updates: Partial<Omit<RecipeCategory, 'id' | 'createdAt'>>
  ): Promise<void> {
    try {
      const categoryRef = doc(db, COLLECTION_NAME, categoryId);
      await updateDoc(categoryRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating recipe category:', error);
      throw new Error('Failed to update recipe category');
    }
  }

  async deleteRecipeCategory(categoryId: string): Promise<void> {
    try {
      const categoryRef = doc(db, COLLECTION_NAME, categoryId);
      await deleteDoc(categoryRef);
    } catch (error) {
      console.error('Error deleting recipe category:', error);
      throw new Error('Failed to delete recipe category');
    }
  }

  async initializeDefaultCategories(): Promise<void> {
    try {
      const existingCategories = await this.getAllRecipeCategories(true);

      // Only initialize if no categories exist
      if (existingCategories.length > 0) {
        console.log('Recipe categories already exist, skipping initialization');
        return;
      }

      const defaultCategories = [
        { name: 'Classic Tiki', description: 'Traditional tiki cocktails with time-tested recipes', order: 1 },
        { name: 'Tropical Paradise', description: 'Fresh and fruity cocktails with tropical flavors', order: 2 },
        { name: 'House Specials', description: 'Unique creations and signature drinks', order: 3 },
        { name: 'Zero Proof', description: 'Non-alcoholic tropical drinks and mocktails', order: 4 },
      ];

      const batch = writeBatch(db);
      const categoriesRef = collection(db, COLLECTION_NAME);

      defaultCategories.forEach(category => {
        const docRef = doc(categoriesRef);
        batch.set(docRef, {
          ...category,
          active: true,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
      });

      await batch.commit();
      console.log('Default recipe categories initialized successfully');
    } catch (error) {
      console.error('Error initializing default recipe categories:', error);
      throw new Error('Failed to initialize default recipe categories');
    }
  }

  async reorderCategories(categoryOrders: { id: string; order: number }[]): Promise<void> {
    try {
      const batch = writeBatch(db);

      categoryOrders.forEach(({ id, order }) => {
        const categoryRef = doc(db, COLLECTION_NAME, id);
        batch.update(categoryRef, {
          order,
          updatedAt: Timestamp.now(),
        });
      });

      await batch.commit();
    } catch (error) {
      console.error('Error reordering recipe categories:', error);
      throw new Error('Failed to reorder recipe categories');
    }
  }
}

export const recipeCategoryService = new RecipeCategoryService();