import React from 'react';
import { Department, ShoppingItem } from '../types';
import { DepartmentIcon } from './DepartmentIcon';
import { triggerHaptic } from '../utils/haptics';
import { Check, Footprints, Clock, ArrowRight, Sparkles } from 'lucide-react';

interface StorePathMapProps {
  departments: Department[];
  items: ShoppingItem[];
  onSelectDepartment?: (deptId: string) => void;
}

export const StorePathMap: React.FC<StorePathMapProps> = ({
  departments,
  items,
  onSelectDepartment,
}) => {
  // Calcolo statistiche per reparto
  const deptStats = departments.map((dept) => {
    const deptItems = items.filter((i) => i.departmentId === dept.id);
    const total = deptItems.length;
    const completed = deptItems.filter((i) => i.completed).length;
    const pending = total - completed;

    return {
      dept,
      total,
      completed,
      pending,
      hasItems: total > 0,
      isFullyDone: total > 0 && pending === 0,
    };
  });

  const activeAislesCount = deptStats.filter((d) => d.hasItems).length;
  const skippedAislesCount = departments.length - activeAislesCount;
  // Stima tempo risparmiato: circa 1.5 minuti per ogni corsia saltata o visitata in ordine sequenziale senza fare avanti-indietro
  const estimatedMinutesSaved = Math.max(8, skippedAislesCount * 2 + Math.floor(activeAislesCount * 1.2));

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
            <Footprints className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <span>Mappa Percorso tra gli Scaffali</span>
              <span className="text-[10px] font-semibold text-slate-500 sm:hidden">
                (Scorri ➔)
              </span>
            </h2>
            <p className="text-xs text-slate-500 line-clamp-1 sm:line-clamp-none">
              Ordinato dall'Ingresso alle Casse secondo l'Esselunga del tuo quartiere
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-medium text-xs">
            <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Risparmi ~{estimatedMinutesSaved} min di cammino</span>
          </div>
        </div>
      </div>

      {/* Tappe Sequenziali Orizzontali / Griglia reattiva con touch-pan-x */}
      <div className="relative">
        <div className="flex gap-2.5 overflow-x-auto pb-2.5 pt-1 scrollbar-none touch-pan-x">
          {/* Ingresso */}
          <div className="shrink-0 flex flex-col items-center justify-center px-3.5 py-2.5 min-h-[64px] rounded-xl bg-slate-100 text-slate-600 border border-slate-200 text-xs font-semibold">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Start</span>
            <span>Ingresso</span>
          </div>

          <div className="shrink-0 flex items-center text-slate-300">
            <ArrowRight className="w-4 h-4" />
          </div>

          {/* Lista Corsie */}
          {deptStats.map(({ dept, total, pending, hasItems, isFullyDone }) => (
            <React.Fragment key={dept.id}>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  onSelectDepartment?.(dept.id);
                }}
                className={`shrink-0 flex flex-col items-start p-3 min-h-[64px] rounded-xl border text-left transition-all touch-manipulation active:scale-[0.98] ${
                  isFullyDone
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900 ring-1 ring-emerald-300'
                    : hasItems
                    ? 'bg-white border-red-300 text-slate-800 shadow-xs hover:border-red-500 ring-1 ring-red-100'
                    : 'bg-slate-50/60 border-slate-200/70 text-slate-400 hover:text-slate-600 opacity-60 hover:opacity-90'
                }`}
                style={{ minWidth: '145px' }}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      hasItems
                        ? 'bg-red-100 text-red-700'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    Corsia {dept.aisleNumber}
                  </span>

                  {isFullyDone ? (
                    <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  ) : hasItems ? (
                    <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                      {pending} da prendere
                    </span>
                  ) : (
                    <span className="text-[9px] text-slate-400">salta</span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 mt-0.5">
                  <DepartmentIcon
                    name={dept.iconName}
                    className={`w-4 h-4 shrink-0 ${hasItems ? 'text-slate-700' : 'text-slate-400'}`}
                  />
                  <span
                    className={`text-xs font-bold truncate max-w-[105px] ${
                      hasItems ? 'text-slate-800' : 'text-slate-500'
                    }`}
                  >
                    {dept.name}
                  </span>
                </div>
              </button>

              <div className="shrink-0 flex items-center text-slate-300">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </React.Fragment>
          ))}

          {/* Casse */}
          <div className="shrink-0 flex flex-col items-center justify-center px-3.5 py-2.5 min-h-[64px] rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold">
            <span className="text-[10px] text-amber-600 uppercase tracking-wider font-bold">Fine</span>
            <span>Casse</span>
          </div>
        </div>
      </div>
    </div>
  );
};
