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
import { Info, Sparkles, MapPin, Footprints, ShieldCheck, ShoppingCart, ChevronUp, ChevronDown } from 'lucide-react';

export default function App() {
  const [layout, setLayout] = useState<StoreLayout>(() => loadStoreLayout());
  const [items, setItems] = useState<ShoppingItem[]>(() => loadShoppingItems());
  const [isShoppingMode, setIsShoppingMode] = useState<boolean>(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState<boolean>(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);

  // Stato per nascondere/ridurre il box introduttivo per avere più spazio nella lista
  const [showIntroBanner, setShowIntroBanner] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('esselunga_show_intro');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // Stato per nascondere la barra mobile inferiore durante lo scroll verso il basso
  const [isScrollingDown, setIsScrollingDown] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastY && currentY > 100) {
        setIsScrollingDown(true);
      } else if (currentY < lastY - 6) {
        setIsScrollingDown(false);
      }
      lastY = currentY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleToggleIntroBanner = () => {
    setShowIntroBanner((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('esselunga_show_intro', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Salva elementi ogni volta che cambiano
  useEffect(() => {
    saveShoppingItems(items);
  }, [items]);

  // Salva configurazione layout ogni volta che cambia
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

  // Aggiunta massiva
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

  // Salva modifiche ad un articolo esistente
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

  // Svuota tutto
  const handleClearAll = () => {
    if (window.confirm('Sei sicuro di voler cancellare tutta la lista della spesa?')) {
      setItems([]);
    }
  };

  // Salva nuovo layout personalizzato del quartiere
  const handleSaveLayout = (newLayout: StoreLayout) => {
    setLayout(newLayout);
  };

  // Seleziona reparto dalla mappa per scrollare o mettere in evidenza
  const handleSelectDepartment = (deptId: string) => {
    // Scroll dolce verso la corsia selezionata
    const targetDept = layout.departments.find((d) => d.id === deptId);
    if (targetDept) {
      const el = document.getElementById(`dept-${deptId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <div className="min-h-[100dvh] bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-red-100 selection:text-red-900 pb-28 sm:pb-0">
      {/* Header con Navigazione & Status Negozio */}
      <Header
        layout={layout}
        items={items}
        isShoppingMode={isShoppingMode}
        onToggleShoppingMode={() => setIsShoppingMode(!isShoppingMode)}
        onOpenCustomize={() => setIsCustomizeOpen(true)}
        onOpenBulkImport={() => setIsBulkImportOpen(true)}
      />

      {/* Contenitore Principale */}
      <main className="max-w-5xl w-full mx-auto px-3.5 sm:px-6 py-4 sm:py-6 flex-1 space-y-5 sm:space-y-6">
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
          <div className="space-y-5 sm:space-y-6">
            {/* Box Introduttivo Quartiere & Ottimizzazione (riducibile per dare massimo spazio alla lista) */}
            {showIntroBanner ? (
              <div className="bg-gradient-to-r from-[#0b1f38] to-[#153459] text-white p-4 sm:p-5 rounded-3xl shadow-sm border border-slate-800 transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                        Percorso Ottimizzato
                      </span>
                      <span className="text-xs text-slate-300">
                        Zero giri a vuoto
                      </span>
                    </div>
                    <h2 className="text-base sm:text-lg font-extrabold text-white">
                      Spesa ordinata per l'Esselunga di {layout.neighborhood}
                    </h2>
                    <p className="text-xs text-slate-300 max-w-xl">
                      Inserisci i prodotti e la quantità: l'app li ordina automaticamente secondo la sequenza degli scaffali per farti risparmiare tempo e chilometri a piedi.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleToggleIntroBanner}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition shrink-0"
                    title="Riduci introduzione per dare più spazio alla lista"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCustomizeOpen(true)}
                    className="px-3 py-1.5 min-h-[36px] text-xs font-semibold bg-white/10 hover:bg-white/20 active:bg-white/30 text-white rounded-xl border border-white/20 transition flex items-center gap-1.5 touch-manipulation"
                  >
                    <MapPin className="w-3.5 h-3.5 text-red-400" />
                    <span>Personalizza Corsie</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleIntroBanner}
                    className="text-[11px] text-slate-400 hover:text-slate-200 underline underline-offset-2"
                  >
                    Nascondi introduzione
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between px-3.5 py-2 bg-slate-200/80 hover:bg-slate-200 rounded-2xl text-xs text-slate-700 border border-slate-300/60 transition">
                <div className="flex items-center gap-2 truncate">
                  <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span className="truncate">
                    Esselunga <strong>{layout.neighborhood}</strong> ({layout.departments.length} corsie)
                  </span>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsCustomizeOpen(true)}
                    className="text-[11px] font-semibold text-slate-700 hover:text-slate-900 underline"
                  >
                    Modifica corsie
                  </button>
                  <button
                    type="button"
                    onClick={handleToggleIntroBanner}
                    className="p-1 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-300/50 transition"
                    title="Espandi dettagli percorso"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Modulo Inserimento Prodotto & Quantità */}
            <AddItemForm
              departments={layout.departments}
              onAddItem={handleAddItem}
            />

            {/* Mappa / Tappe Sequenziali tra gli Scaffali */}
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

      {/* Floating CTA bar on mobile when items are present and in list mode (si ritrae durante lo scroll verso il basso) */}
      {!isShoppingMode && items.length > 0 && (
        <div
          className={`sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-3 pb-safe shadow-2xl flex items-center justify-between gap-3 transition-transform duration-300 ${
            isScrollingDown ? 'translate-y-full pointer-events-none' : 'translate-y-0'
          }`}
        >
          <div className="min-w-0 flex-1 pl-1">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
              {items.filter((i) => !i.completed).length} da acquistare
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
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] bg-red-600 active:bg-red-700 text-white text-xs font-extrabold rounded-xl shadow-md transition touch-manipulation shrink-0"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Avvia Spesa in Corsia</span>
          </button>
        </div>
      )}

      {/* Footer con suggerimenti utili */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-5 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-600 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Salvataggio offline istantaneo: la lista non si perde dentro il supermercato</span>
          </div>
          <p className="text-slate-400">
            Disposizione configurata per: <strong className="text-slate-700">{layout.storeName} ({layout.neighborhood})</strong>
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
