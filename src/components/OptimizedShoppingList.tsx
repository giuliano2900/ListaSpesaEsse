import React, { useState } from 'react';
import { Department, ShoppingItem } from '../types';
import { DepartmentIcon } from './DepartmentIcon';
import { triggerHaptic } from '../utils/haptics';
import {
  Check,
  Trash2,
  Edit2,
  Plus,
  Minus,
  Copy,
  ShoppingBag,
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

  const completedCount = items.filter((i) => i.completed).length;
  const pendingCount = items.length - completedCount;

  // Filtra gli articoli in base alla modalità
  const filteredItems = items.filter((item) => {
    if (filterMode === 'pending') return !item.completed;
    if (filterMode === 'completed') return item.completed;
    return true;
  });

  // Raggruppa gli articoli per reparto secondo la sequenza reale del negozio
  const sortedDepartmentsWithItems = departments
    .map((dept) => {
      const deptItems = filteredItems.filter((item) => item.departmentId === dept.id);
      return {
        department: dept,
        items: deptItems,
      };
    })
    .filter((group) => group.items.length > 0);

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
    setTimeout(() => setCopiedMessage(false), 2000);
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

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl sm:rounded-3xl p-8 border border-slate-200 text-center shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3 border border-red-100">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">
          La lista della spesa è vuota
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Scrivi un prodotto sopra o tocca un suggerimento per iniziare. Gli articoli verranno ordinati automaticamente per corsia!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      {/* Barra Filtri Segmentati & Azioni Rapide */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
        {/* Filtri Segmentati Touch */}
        <div className="grid grid-cols-3 bg-slate-100 p-1 rounded-xl w-full sm:w-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`py-1.5 px-3 rounded-lg transition text-center touch-manipulation ${
              filterMode === 'all'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tutti ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('pending')}
            className={`py-1.5 px-3 rounded-lg transition text-center touch-manipulation ${
              filterMode === 'pending'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Da fare ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('completed')}
            className={`py-1.5 px-3 rounded-lg transition text-center touch-manipulation ${
              filterMode === 'completed'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Presi ({completedCount})
          </button>
        </div>

        {/* Azioni Condividi / Pulizia */}
        <div className="flex items-center gap-1.5 justify-end w-full sm:w-auto text-xs">
          <button
            type="button"
            onClick={handleCopyList}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 h-9 font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-200 rounded-xl transition touch-manipulation"
            title="Copia per WhatsApp"
          >
            {copiedMessage ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copiato!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copia</span>
              </>
            )}
          </button>

          {completedCount > 0 && (
            <button
              type="button"
              onClick={onClearCompleted}
              className="inline-flex items-center justify-center gap-1 px-3 py-1.5 h-9 font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 active:bg-amber-200 border border-amber-200 rounded-xl transition touch-manipulation"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Rimuovi presi ({completedCount})</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClearAll}
            className="inline-flex items-center justify-center px-2.5 py-1.5 h-9 font-semibold text-red-600 hover:bg-red-50 active:bg-red-100 rounded-xl transition touch-manipulation"
          >
            Svuota
          </button>
        </div>
      </div>

      {/* Lista Ordinata per Corsie */}
      <div className="space-y-3">
        {sortedDepartmentsWithItems.map(({ department, items: deptItems }) => {
          const allCompletedInDept = deptItems.every((i) => i.completed);

          return (
            <div
              key={department.id}
              id={`dept-${department.id}`}
              className={`rounded-2xl border transition-all scroll-mt-24 overflow-hidden ${
                allCompletedInDept
                  ? 'bg-slate-50/70 border-slate-200 opacity-70'
                  : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              {/* Header Corsia */}
              <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50/80 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black px-2 py-0.5 rounded-md bg-[#0b1f38] text-white tracking-tight">
                    Corsia {department.aisleNumber}
                  </span>

                  <div className="w-5 h-5 rounded-md bg-red-100 text-red-700 flex items-center justify-center">
                    <DepartmentIcon name={department.iconName} className="w-3 h-3" />
                  </div>

                  <span className="text-xs font-bold text-slate-800 truncate">
                    {department.name}
                  </span>
                </div>

                <span className="text-[11px] font-medium text-slate-400 tabular-nums">
                  {deptItems.filter((i) => !i.completed).length} rimasti
                </span>
              </div>

              {/* Prodotti della corsia */}
              <div className="divide-y divide-slate-100">
                {deptItems.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3 transition-colors ${
                      item.completed ? 'bg-slate-50/40 text-slate-400' : 'hover:bg-slate-50/60'
                    }`}
                  >
                    {/* Tocco intera riga per spuntare */}
                    <div
                      onClick={() => handleToggle(item.id, item.completed)}
                      className="flex items-center gap-3 flex-1 min-w-0 mr-2 cursor-pointer select-none touch-manipulation active:opacity-70"
                    >
                      {/* Checkbox con target tocco ampio */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggle(item.id, item.completed);
                        }}
                        className="w-10 h-10 -ml-1.5 rounded-xl flex items-center justify-center shrink-0 touch-manipulation"
                        title={item.completed ? 'Rimetti da prendere' : 'Segna come preso'}
                      >
                        <span
                          className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                            item.completed
                              ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                              : 'border-slate-300 bg-white hover:border-red-500'
                          }`}
                        >
                          {item.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </span>
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-sm font-semibold break-words ${
                              item.completed
                                ? 'line-through text-slate-400'
                                : 'text-slate-800'
                            }`}
                          >
                            {item.name}
                          </span>

                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full border shrink-0 tabular-nums ${
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

                    {/* Stepper rapido e azioni */}
                    <div className="flex items-center gap-1 shrink-0">
                      {/* Stepper compatto */}
                      <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200/60">
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(item.id, -1)}
                          className="w-7 h-7 flex items-center justify-center rounded-md text-slate-600 hover:text-slate-900 hover:bg-white active:bg-slate-200 transition touch-manipulation active:scale-90"
                          title="Diminuisci"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold px-1 text-slate-800 min-w-[20px] text-center tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(item.id, 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-md text-slate-600 hover:text-slate-900 hover:bg-white active:bg-slate-200 transition touch-manipulation active:scale-90"
                          title="Aumenta"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic('light');
                          onEditItem(item);
                        }}
                        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition touch-manipulation"
                        title="Modifica"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition touch-manipulation"
                        title="Elimina"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
