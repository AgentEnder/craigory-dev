import { 
  collection, 
  doc, 
  getDocs, 
  updateDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../firebase';

export interface InventoryItem {
  id: string;
  name: string;
  available: boolean;
  category: string;
  subcategory: string;
  order?: number;
}

const INVENTORY_COLLECTION = 'inventory';

export const inventoryService = {
  async getAllItems(): Promise<InventoryItem[]> {
    try {
      const q = query(
        collection(db, INVENTORY_COLLECTION), 
        orderBy('category'), 
        orderBy('subcategory'), 
        orderBy('order', 'asc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as InventoryItem));
    } catch (error) {
      console.error('Error fetching inventory:', error);
      throw error;
    }
  },

  async updateAvailability(itemId: string, available: boolean): Promise<void> {
    try {
      const itemRef = doc(db, INVENTORY_COLLECTION, itemId);
      await updateDoc(itemRef, { available });
    } catch (error) {
      console.error('Error updating availability:', error);
      throw error;
    }
  },

  async updateItem(itemId: string, updates: Partial<Omit<InventoryItem, 'id'>>): Promise<void> {
    try {
      const itemRef = doc(db, INVENTORY_COLLECTION, itemId);
      await updateDoc(itemRef, updates);
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  },

};