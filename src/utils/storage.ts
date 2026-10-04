import { ShoppingItem, StoreLayout } from '../types';
import { INITIAL_STORE_CONFIG } from '../data/defaultDepartments';

const STORAGE_KEYS = {
  ITEMS: 'esselunga_shopping_items_v1',
  STORE_LAYOUT: 'esselunga_store_layout_v1',
};

export const INITIAL_SAMPLE_ITEMS: ShoppingItem[] = [];

export function loadShoppingItems(): ShoppingItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.ITEMS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        // Rimuove qualsiasi articolo di esempio precedente
        const userItems = parsed.filter(
          (item: ShoppingItem) => item && typeof item.id === 'string' && !item.id.startsWith('sample-')
        );
        // Se c'erano campioni salvati, aggiorna la memoria locale
        if (userItems.length !== parsed.length) {
          saveShoppingItems(userItems);
        }
        return userItems;
      }
    }
  } catch (err) {
    console.error('Errore nel caricamento della lista spesa:', err);
  }
  return [];
}

export function saveShoppingItems(items: ShoppingItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
  } catch (err) {
    console.error('Errore nel salvataggio della lista spesa:', err);
  }
}

export function loadStoreLayout(): StoreLayout {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.STORE_LAYOUT);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && Array.isArray(parsed.departments)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Errore nel caricamento della disposizione Esselunga:', err);
  }
  return INITIAL_STORE_CONFIG;
}

export function saveStoreLayout(layout: StoreLayout): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STORE_LAYOUT, JSON.stringify(layout));
  } catch (err) {
    console.error('Errore nel salvataggio della disposizione Esselunga:', err);
  }
}
