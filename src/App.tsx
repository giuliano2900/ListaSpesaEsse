/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShoppingItem, StoreLayout } from './types';
import {
  loadShoppingItems,
  saveShoppingItems,
  loadStoreLayout,
  saveStoreLayout,
} from './utils/storage';
import { Header } from './components/Header';
import { AddItemForm } from './components/AddItemForm';
import { StorePathMap } from './components/StorePathMap';
import { OptimizedShoppingList } from './components/OptimizedShoppingList';
import { InStoreShoppingMode } from './components/InStoreShoppingMode';
import { CustomizeLayoutModal } from './components/CustomizeLayoutModal';
import { BulkImportModal } from './components/BulkImportModal';
import { EditItemModal } from './components/EditItemModal';
import { triggerHaptic } from './utils/haptics';
import { Play, ShieldCheck, MapPin } from 'lucide-react';

export default function App() {
  const [layout, setLayout] = useState<StoreLayout>(() => loadStoreLayout());
  const [items, setItems] = useState<ShoppingItem[]>(() => loadShoppingItems());
  const [isShoppingMode, setIsShoppingMode] = useState<boolean>(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState<boolean>(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);

  // Auto-hide floating mobile action bar on downward scroll
  const [isScrollingDown, setIsScrollingDown] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastY && currentY > 60) {
        setIsScrollingDown(true);
      } else if (currentY < lastY - 8) {
        setIsScrollingDown(false);
      }
      lastY = currentY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Salva elementi in localStorage
  useEffect(() => {
    saveShoppingItems(items);
  }, [items]);

  // Salva configurazione layout negozio
  useEffect(() => {
    saveStoreLayout(layout);
  }, [layout]);

  // Aggiungi un articolo
  const handleAddItem = (
    newItemData: Omit<ShoppingItem, 'id' | 'completed' | 'createdAt'>
  ) => {
    const newItem: ShoppingItem = {
      ...newItemData,
      id: 'item_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      completed: false,
      createdAt: Date.now(),
    };
    setItems((prev) => [newItem, ...prev]);
  };

  // Aggiunta massiva da testo incollato
  const handleImportBulkItems = (
    newItemsData: Omit<ShoppingItem, 'id' | 'completed' | 'createdAt'>[]
  ) => {
    const newItems: ShoppingItem[] = newItemsData.map((data, index) => ({
      ...data,
      id: 'item_' + Date.now() + '_' + index + '_' + Math.random().toString(36).substring(2, 5),
      completed: false,
      createdAt: Date.now() + index,
    }));
    setItems((prev) => [...newItems, ...prev]);
  };

  // Spunta / rimuovi spunta
  const handleToggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  // Elimina articolo
  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Aggiorna quantità (+ o -)
  const handleUpdateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextQty = Math.max(0.1, Number((item.quantity + delta).toFixed(2)));
          return { ...item, quantity: nextQty };
        }
        return item;
      })
    );
  };

  // Salva articolo modificato
  const handleSaveEditedItem = (updated: ShoppingItem) => {
    setItems((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
    setEditingItem(null);
  };

  // Rimuovi completati
  const handleClearCompleted = () => {
    setItems((prev) => prev.filter((item) => !item.completed));
  };

  // Svuota lista
  const handleClearAll = () => {
    if (window.confirm('Cancellare tutti i prodotti della lista?')) {
      setItems([]);
    }
  };

  // Salva nuovo layout personalizzato
  const handleSaveLayout = (newLayout: StoreLayout) => {
    setLayout(newLayout);
  };

  // Scorri dolcemente al reparto selezionato
  const handleSelectDepartment = (deptId: string) => {
    const el = document.getElementById(`dept-${deptId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const pendingCount = items.filter((i) => !i.completed).length;

  return (
    <div className="min-h-[100dvh] bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-red-100 selection:text-red-900 pb-20 sm:pb-0">
      {/* Header con Navigazione & Sicurezza Dynamic Island / Notch */}
      <Header
        layout={layout}
        items={items}
        isShoppingMode={isShoppingMode}
        onToggleShoppingMode={() => setIsShoppingMode(!isShoppingMode)}
        onOpenCustomize={() => setIsCustomizeOpen(true)}
        onOpenBulkImport={() => setIsBulkImportOpen(true)}
      />

      {/* Main Content Area con padding laterale safe per bordi curvi e landscape */}
      <main className="max-w-4xl w-full mx-auto px-3 sm:px-6 py-3.5 sm:py-5 flex-1 space-y-3.5 sm:space-y-4 px-safe">
        {/* Modalità Spesa Attiva (Visuale dedicata tra gli scaffali) */}
        {isShoppingMode ? (
          <InStoreShoppingMode
            departments={layout.departments}
            items={items}
            onToggleItem={handleToggleItem}
            onExitShoppingMode={() => setIsShoppingMode(false)}
          />
        ) : (
          /* Visuale Standard di Creazione & Gestione Lista Ordinata */
          <div className="space-y-3.5 sm:space-y-4">
            {/* Modulo Inserimento Prodotto & Quantità (snello, intuitivo, reattivo) */}
            <AddItemForm
              departments={layout.departments}
              onAddItem={handleAddItem}
            />

            {/* Mappa / Tappe Sequenziali tra le corsie del negozio */}
            {items.length > 0 && (
              <StorePathMap
                departments={layout.departments}
                items={items}
                onSelectDepartment={handleSelectDepartment}
              />
            )}

            {/* Lista Ordinata della Spesa Raggruppata per Corsia */}
            <OptimizedShoppingList
              departments={layout.departments}
              items={items}
              onToggleItem={handleToggleItem}
              onDeleteItem={handleDeleteItem}
              onUpdateQuantity={handleUpdateQuantity}
              onEditItem={(item) => setEditingItem(item)}
              onClearCompleted={handleClearCompleted}
              onClearAll={handleClearAll}
            />
          </div>
        )}
      </main>

      {/* Floating CTA bar on mobile when items are present and in list mode (ergonomica per pollice, con safe-area per home bar) */}
      {!isShoppingMode && items.length > 0 && (
        <div
          className={`sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-2.5 pb-safe-nav px-safe shadow-2xl flex items-center justify-between gap-3 transition-transform duration-300 ${
            isScrollingDown ? 'translate-y-full pointer-events-none' : 'translate-y-0'
          }`}
        >
          <div className="min-w-0 flex-1 pl-1">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
              {pendingCount} da prendere
            </span>
            <span className="text-xs font-bold text-white truncate block">
              {layout.storeName}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('medium');
              setIsShoppingMode(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 h-11 bg-red-600 active:bg-red-700 text-white text-xs font-black rounded-xl shadow-md transition touch-manipulation shrink-0 active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Spesa in Corsia</span>
          </button>
        </div>
      )}

      {/* Footer sobrio ed essenziale */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-3.5 text-center text-xs text-slate-500 px-safe">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-slate-600 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Salvataggio offline istantaneo: la lista resta attiva dentro il supermercato</span>
          </div>
          <p className="text-slate-400 text-[11px]">
            {layout.storeName} · {layout.neighborhood}
          </p>
        </div>
      </footer>

      {/* Modale Personalizza Corsie Quartiere */}
      {isCustomizeOpen && (
        <CustomizeLayoutModal
          layout={layout}
          isOpen={isCustomizeOpen}
          onClose={() => setIsCustomizeOpen(false)}
          onSave={handleSaveLayout}
        />
      )}

      {/* Modale Incolla Lista Rapida */}
      {isBulkImportOpen && (
        <BulkImportModal
          isOpen={isBulkImportOpen}
          departments={layout.departments}
          onClose={() => setIsBulkImportOpen(false)}
          onImportItems={handleImportBulkItems}
        />
      )}

      {/* Modale Modifica Articolo Singolo */}
      {editingItem !== null && (
        <EditItemModal
          item={editingItem}
          departments={layout.departments}
          isOpen={editingItem !== null}
          onClose={() => setEditingItem(null)}
          onSave={handleSaveEditedItem}
        />
      )}
    </div>
  );
}
