import React, { useState } from 'react';
import { Department, ShoppingItem, UnitType } from '../types';
import { DepartmentIcon } from './DepartmentIcon';
import { triggerHaptic } from '../utils/haptics';
import {
  Check,
  Trash2,
  Edit2,
  Plus,
  Minus,
  CheckCircle2,
  Circle,
  Copy,
  Sparkles,
  Share2,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface OptimizedShoppingListProps {
  departments: Department[];
  items: ShoppingItem[];
  onToggleItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onEditItem: (item: ShoppingItem) => void;
  onClearCompleted: () => void;
  onClearAll: () => void;
}

export const OptimizedShoppingList: React.FC<OptimizedShoppingListProps> = ({
  departments,
  items,
  onToggleItem,
  onDeleteItem,
  onUpdateQuantity,
  onEditItem,
  onClearCompleted,
  onClearAll,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'completed'>('all');
  const [copiedMessage, setCopiedMessage] = useState(false);

  // Filtra gli articoli in base allo stato
  const filteredItems = items.filter((item) => {
    if (filterMode === 'pending') return !item.completed;
    if (filterMode === 'completed') return item.completed;
    return true;
  });

  // Raggruppa gli articoli per reparto nell'ordine esatto della disposizione Esselunga
  const sortedDepartmentsWithItems = departments
    .map((dept) => {
      const deptItems = filteredItems.filter((item) => item.departmentId === dept.id);
      return {
        department: dept,
        items: deptItems,
      };
    })
    .filter((group) => group.items.length > 0);

  // Copia la lista formattata per WhatsApp o appunti
  const handleCopyList = () => {
    if (items.length === 0) return;

    let text = `🛒 LISTA SPESA ESSELUNGA (Ordinata per Corsie):\n\n`;

    departments.forEach((dept) => {
      const deptItems = items.filter((i) => i.departmentId === dept.id && !i.completed);
      if (deptItems.length > 0) {
        text += `📍 Corsia ${dept.aisleNumber} - ${dept.name}:\n`;
        deptItems.forEach((i) => {
          text += `  • ${i.name}: ${i.quantity} ${i.unit}${i.notes ? ` (${i.notes})` : ''}\n`;
        });
        text += `\n`;
      }
    });

    navigator.clipboard.writeText(text);
    triggerHaptic('success');
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2500);
  };

  const handleToggle = (id: string, currentlyCompleted: boolean) => {
    triggerHaptic(currentlyCompleted ? 'light' : 'success');
    onToggleItem(id);
  };

  const handleUpdateQty = (id: string, delta: number) => {
    triggerHaptic('light');
    onUpdateQuantity(id, delta);
  };

  const handleDelete = (id: string) => {
    triggerHaptic('warning');
    onDeleteItem(id);
  };

  const completedCount = items.filter((i) => i.completed).length;

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3 border border-red-100">
          <Sparkles className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">La tua lista della spesa è vuota</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
          Aggiungi gli articoli con il modulo sopra oppure clicca su uno dei suggerimenti rapidi. L'app organizzerà subito i prodotti secondo la disposizione degli scaffali del tuo Esselunga.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barra Azioni & Filtri */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        {/* Filtri */}
        <div className="grid grid-cols-3 sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-2.5 sm:px-3 py-2 sm:py-1 min-h-[36px] sm:min-h-[auto] text-xs font-semibold rounded-lg transition text-center touch-manipulation ${
              filterMode === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tutti ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('pending')}
            className={`px-2.5 sm:px-3 py-2 sm:py-1 min-h-[36px] sm:min-h-[auto] text-xs font-semibold rounded-lg transition text-center touch-manipulation ${
              filterMode === 'pending'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Da fare ({items.length - completedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('completed')}
            className={`px-2.5 sm:px-3 py-2 sm:py-1 min-h-[36px] sm:min-h-[auto] text-xs font-semibold rounded-lg transition text-center touch-manipulation ${
              filterMode === 'completed'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Presi ({completedCount})
          </button>
        </div>

        {/* Pulsanti Condivisione e Pulizia */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <button
            type="button"
            onClick={handleCopyList}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 min-h-[38px] text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-200 rounded-xl transition touch-manipulation"
            title="Copia lista ordinata per WhatsApp"
          >
            {copiedMessage ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-emerald-700 font-semibold">Copiato!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Copia per WhatsApp</span>
              </>
            )}
          </button>

          {completedCount > 0 && (
            <button
              type="button"
              onClick={onClearCompleted}
              className="inline-flex items-center justify-center gap-1 px-3 py-2 min-h-[38px] text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 active:bg-amber-200 border border-amber-200 rounded-xl transition touch-manipulation"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Rimuovi presi ({completedCount})</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClearAll}
            className="inline-flex items-center justify-center gap-1 px-3 py-2 min-h-[38px] text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 active:bg-red-100 rounded-xl transition touch-manipulation"
          >
            <span>Svuota tutto</span>
          </button>
        </div>
      </div>

      {/* Lista Raggruppata per Corsia Esselunga */}
      <div className="space-y-3.5">
        {sortedDepartmentsWithItems.map(({ department, items: deptItems }, index) => {
          const allCompletedInDept = deptItems.every((i) => i.completed);

          return (
            <div
              key={department.id}
              id={`dept-${department.id}`}
              className={`rounded-2xl border transition-all scroll-mt-20 ${
                allCompletedInDept
                  ? 'bg-slate-50/70 border-slate-200 opacity-75'
                  : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              {/* Intestazione Scaffale / Corsia */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white rounded-t-2xl">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center text-xs font-bold px-2 py-0.5 rounded-md bg-[#0b1f38] text-white tracking-wide">
                    Corsia {department.aisleNumber}
                  </span>

                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                      <DepartmentIcon name={department.iconName} className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-bold text-slate-800">
                      {department.name}
                    </span>
                  </div>

                  <span className="text-xs text-slate-400 font-medium">
                    ({deptItems.filter((i) => !i.completed).length} rimanenti)
                  </span>
                </div>

                <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                  Tappa {index + 1} di {sortedDepartmentsWithItems.length}
                </span>
              </div>

              {/* Prodotti della Corsia */}
              <div className="divide-y divide-slate-100">
                {deptItems.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3 sm:p-3.5 transition-colors ${
                      item.completed ? 'bg-slate-50/50 text-slate-400' : 'hover:bg-slate-50/60'
                    }`}
                  >
                    {/* Checkbox e Dettagli Articolo - Tocco per spuntare */}
                    <div
                      onClick={() => handleToggle(item.id, item.completed)}
                      className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 mr-2 sm:mr-3 cursor-pointer select-none touch-manipulation active:opacity-75"
                    >
                      {/* Touch target 44x44px for checkbox */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggle(item.id, item.completed);
                        }}
                        className="w-11 h-11 sm:w-10 sm:h-10 -ml-2 rounded-xl flex items-center justify-center shrink-0 touch-manipulation group"
                        title={item.completed ? 'Rimetti da prendere' : 'Segna come preso nel carrello'}
                      >
                        <span
                          className={`w-6 h-6 rounded-lg flex items-center justify-center border transition ${
                            item.completed
                              ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                              : 'border-slate-300 group-hover:border-red-500 bg-white shadow-xs'
                          }`}
                        >
                          {item.completed && <Check className="w-4 h-4 stroke-[3]" />}
                        </span>
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                          <span
                            className={`text-sm font-semibold break-words ${
                              item.completed
                                ? 'line-through text-slate-400'
                                : 'text-slate-800'
                            }`}
                          >
                            {item.name}
                          </span>

                          {/* Badge Quantità Chiave Richiesta dall'utente */}
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border shrink-0 ${
                              item.completed
                                ? 'bg-slate-100 text-slate-400 border-slate-200'
                                : 'bg-red-50 text-red-700 border-red-200/80'
                            }`}
                          >
                            {item.quantity} {item.unit}
                          </span>
                        </div>

                        {item.notes && (
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                            {item.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Controlli Quantità Rapidi & Modifica / Elimina */}
                    <div className="flex items-center gap-1 shrink-0">
                      {/* Stepper Quantità con ampi bottoni touch */}
                      <div className="flex items-center bg-slate-100 rounded-xl p-0.5">
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(item.id, -1)}
                          className="w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white active:bg-slate-200 transition touch-manipulation active:scale-95"
                          title="Diminuisci quantità"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold px-1.5 text-slate-800 min-w-[22px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(item.id, 1)}
                          className="w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white active:bg-slate-200 transition touch-manipulation active:scale-95"
                          title="Aumenta quantità"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic('light');
                          onEditItem(item);
                        }}
                        className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:bg-slate-200 rounded-xl transition touch-manipulation"
                        title="Modifica articolo o corsia"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 active:bg-red-100 rounded-xl transition touch-manipulation"
                        title="Rimuovi articolo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
