import React, { useState, useRef } from 'react';
import { Department, ShoppingItem } from '../types';
import { DepartmentIcon } from './DepartmentIcon';
import { triggerHaptic } from '../utils/haptics';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  X,
  ArrowRight,
  CheckCircle2,
  MoveHorizontal,
  ShoppingBag,
} from 'lucide-react';

interface InStoreShoppingModeProps {
  departments: Department[];
  items: ShoppingItem[];
  onToggleItem: (id: string) => void;
  onExitShoppingMode: () => void;
}

export const InStoreShoppingMode: React.FC<InStoreShoppingModeProps> = ({
  departments,
  items,
  onToggleItem,
  onExitShoppingMode,
}) => {
  // Solo i reparti che contengono articoli della spesa corrente
  const activeDepartments = departments.filter((dept) =>
    items.some((i) => i.departmentId === dept.id)
  );

  // Trova il primo reparto con articoli non ancora completati
  const firstUnfinishedDeptIndex = activeDepartments.findIndex((dept) =>
    items.some((i) => i.departmentId === dept.id && !i.completed)
  );

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(
    firstUnfinishedDeptIndex !== -1 ? firstUnfinishedDeptIndex : 0
  );

  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const currentDept = activeDepartments[currentStepIndex] || activeDepartments[0];

  const totalItems = items.length;
  const completedItems = items.filter((i) => i.completed).length;
  const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  const isAllCompleted = totalItems > 0 && completedItems === totalItems;

  const currentDeptItems = currentDept
    ? items.filter((i) => i.departmentId === currentDept.id)
    : [];
  const currentDeptPending = currentDeptItems.filter((i) => !i.completed).length;

  const nextDept = activeDepartments[currentStepIndex + 1];

  const handleNextStep = () => {
    if (currentStepIndex < activeDepartments.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      triggerHaptic('light');
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      triggerHaptic('light');
    }
  };

  const handleItemClick = (id: string) => {
    triggerHaptic('success');
    onToggleItem(id);
  };

  // Supporto swipe touch su smartphone
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartXRef.current;
    const diffY = e.changedTouches[0].clientY - touchStartYRef.current;

    // Solo se il gesto è orizzontale e supera i 45px
    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY) * 1.4) {
      if (diffX < 0) {
        handleNextStep();
      } else {
        handlePrevStep();
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  if (activeDepartments.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-6 text-center border border-slate-200">
        <p className="text-slate-600 mb-3 text-sm">Nessun articolo nella lista spesa.</p>
        <button
          type="button"
          onClick={onExitShoppingMode}
          className="px-4 py-2.5 bg-red-600 text-white rounded-xl text-xs font-bold touch-manipulation"
        >
          Torna alla lista
        </button>
      </div>
    );
  }

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="bg-slate-900 text-white rounded-3xl p-3.5 sm:p-5 shadow-xl border border-slate-800 space-y-3.5 pb-24 sm:pb-6 relative select-none"
    >
      {/* Top Header Barra con Avanzamento */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="font-bold text-red-400 uppercase tracking-wider">
              Spesa in Corsia
            </span>
            <span>·</span>
            <span className="sm:hidden flex items-center gap-1 text-slate-400">
              <MoveHorizontal className="w-3 h-3" />
              Swipe corsia
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-black text-white truncate">
            Tappa {currentStepIndex + 1} di {activeDepartments.length}
          </h2>
        </div>

        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            onExitShoppingMode();
          }}
          className="h-10 px-3 flex items-center justify-center gap-1.5 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 active:bg-slate-600 rounded-xl transition text-xs font-semibold touch-manipulation"
          title="Esci dalla modalità spesa"
        >
          <X className="w-4 h-4" />
          <span>Chiudi</span>
        </button>
      </div>

      {/* Barra Avanzamento Carrello */}
      <div className="space-y-1 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-300">
            Nel carrello: {completedItems} di {totalItems}
          </span>
          <span className="text-emerald-400 font-bold tabular-nums">
            {progressPercent}%
          </span>
        </div>
        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-500 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Mini navigatore tappe orizzontali */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none scroll-touch touch-pan-x">
        {activeDepartments.map((dept, idx) => {
          const deptPending = items.filter((i) => i.departmentId === dept.id && !i.completed).length;
          const isCurrent = idx === currentStepIndex;

          return (
            <button
              key={dept.id}
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setCurrentStepIndex(idx);
              }}
              className={`shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition touch-manipulation active:scale-95 ${
                isCurrent
                  ? 'bg-red-600 text-white shadow-sm ring-1 ring-white/30'
                  : deptPending === 0
                  ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-700/40'
                  : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-750'
              }`}
            >
              <span>Corsia {dept.aisleNumber}</span>
              {deptPending === 0 ? (
                <Check className="w-3 h-3 stroke-[3]" />
              ) : (
                <span className="text-[10px] opacity-75 tabular-nums">({deptPending})</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Stato finale: tutto completato! */}
      {isAllCompleted ? (
        <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-2xl p-6 text-center space-y-3 animate-in fade-in zoom-in duration-200">
          <div className="w-14 h-14 rounded-full bg-emerald-500 text-slate-900 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-lg font-black text-emerald-300">
              Spesa Conclusa con Successo!
            </h3>
            <p className="text-xs text-emerald-200/80 mt-1 max-w-sm mx-auto">
              Tutti i prodotti sono stati presi seguendo il percorso tra gli scaffali. Puoi recarti direttamente alle <strong>Casse</strong> o al <strong>Presto Spesa</strong>!
            </p>
          </div>

          <button
            type="button"
            onClick={onExitShoppingMode}
            className="w-full sm:w-auto px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-md touch-manipulation"
          >
            Torna alla Lista
          </button>
        </div>
      ) : (
        /* Scheda della corsia corrente */
        <div className="space-y-3">
          <div className="bg-slate-800/90 p-3.5 rounded-2xl border border-slate-700">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-red-600 text-white tracking-wide">
                Corsia {currentDept.aisleNumber}
              </span>

              <span className="text-xs font-semibold text-slate-400">
                {currentDeptPending > 0
                  ? `${currentDeptPending} da prendere qui`
                  : '✓ Reparto completato'}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-950/80 border border-red-700/50 text-red-400 flex items-center justify-center shrink-0">
                <DepartmentIcon name={currentDept.iconName} className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-extrabold text-white tracking-tight truncate">
                  {currentDept.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-1">
                  {currentDept.description}
                </p>
              </div>
            </div>
          </div>

          {/* Grandi pulsanti tattili per ogni articolo */}
          <div className="space-y-2">
            {currentDeptItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between p-3.5 min-h-[56px] rounded-2xl border text-left transition-all active:scale-[0.98] touch-manipulation ${
                  item.completed
                    ? 'bg-slate-800/40 border-slate-700/60 text-slate-400'
                    : 'bg-slate-800 hover:bg-slate-750 border-slate-600 text-white shadow-sm ring-1 ring-white/5'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border-2 transition ${
                      item.completed
                        ? 'bg-emerald-500 border-emerald-500 text-slate-950 shadow-xs'
                        : 'border-slate-500 bg-slate-900'
                    }`}
                  >
                    {item.completed && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm sm:text-base font-bold break-words ${
                        item.completed ? 'line-through text-slate-500' : 'text-white'
                      }`}
                    >
                      {item.name}
                    </p>
                    {item.notes && (
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {item.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="shrink-0">
                  <span
                    className={`text-xs font-black px-2.5 py-1 rounded-lg tabular-nums ${
                      item.completed
                        ? 'bg-slate-700 text-slate-400'
                        : 'bg-red-600 text-white shadow-xs'
                    }`}
                  >
                    {item.quantity} {item.unit}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Suggerimento per passare alla corsia successiva */}
          {currentDeptPending === 0 && nextDept && (
            <button
              type="button"
              onClick={handleNextStep}
              className="w-full p-3 bg-emerald-950/70 border border-emerald-500/40 rounded-2xl flex items-center justify-between gap-2 text-left active:scale-[0.98] transition touch-manipulation"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                    Corsia completata!
                  </span>
                  <span className="text-xs font-semibold text-slate-200 truncate block">
                    Avanti: Corsia {nextDept.aisleNumber} - {nextDept.name}
                  </span>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-emerald-400 shrink-0" />
            </button>
          )}

          {/* Navigatore Tappe Precedente / Successiva Desktop */}
          <div className="hidden sm:flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={currentStepIndex === 0}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Corsia precedente</span>
            </button>

            <span className="text-xs text-slate-400 font-medium">
              Corsia {currentStepIndex + 1} di {activeDepartments.length}
            </span>

            <button
              type="button"
              onClick={handleNextStep}
              disabled={currentStepIndex === activeDepartments.length - 1}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <span>Corsia successiva</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Sticky Bottom Bar su Smartphone con padding safe-area per Home Indicator */}
      {!isAllCompleted && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-4 py-2.5 pb-safe shadow-2xl flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handlePrevStep}
            disabled={currentStepIndex === 0}
            className="flex-1 inline-flex items-center justify-center gap-1 h-11 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 active:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition touch-manipulation border border-slate-700"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Precedente</span>
          </button>

          <span className="text-xs font-bold text-slate-400 px-2 text-center shrink-0 tabular-nums">
            {currentStepIndex + 1} / {activeDepartments.length}
          </span>

          <button
            type="button"
            onClick={handleNextStep}
            disabled={currentStepIndex === activeDepartments.length - 1}
            className="flex-1 inline-flex items-center justify-center gap-1 h-11 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 active:bg-red-700 disabled:opacity-30 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed transition touch-manipulation shadow-sm"
          >
            <span>Successiva</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
