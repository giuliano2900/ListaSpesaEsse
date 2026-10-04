import React from 'react';
import { Department, ShoppingItem } from '../types';
import { DepartmentIcon } from './DepartmentIcon';
import { triggerHaptic } from '../utils/haptics';
import { Check, Footprints, Clock, ArrowRight } from 'lucide-react';

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
  // Statistiche per reparto
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

  const activeAisles = deptStats.filter((d) => d.hasItems);
  const skippedCount = departments.length - activeAisles.length;
  const estimatedMinutesSaved = Math.max(6, skippedCount * 2 + Math.floor(activeAisles.length * 1.2));

  if (items.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-xs space-y-2.5">
      {/* Header compatto */}
      <div className="flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 min-w-0">
          <Footprints className="w-4 h-4 text-emerald-600 shrink-0" />
          <h2 className="font-bold text-slate-800 tracking-tight truncate">
            Percorso tra le Corsie
          </h2>
          <span className="text-[11px] text-slate-400 font-medium">
            ({activeAisles.length} {activeAisles.length === 1 ? 'corsia' : 'corsie'})
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 shrink-0">
          <Clock className="w-3 h-3 text-emerald-600" />
          <span>~{estimatedMinutesSaved} min risparmiati</span>
        </div>
      </div>

      {/* Tappe Orizzontali a scorrimento rapido */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none scroll-touch touch-pan-x">
        {/* Ingresso */}
        <div className="shrink-0 flex items-center px-2 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-bold border border-slate-200">
          <span>Ingresso</span>
        </div>

        <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />

        {/* Corsie con articoli */}
        {activeAisles.map(({ dept, pending, isFullyDone }, idx) => (
          <React.Fragment key={dept.id}>
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                onSelectDepartment?.(dept.id);
              }}
              className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition touch-manipulation active:scale-95 ${
                isFullyDone
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-white text-slate-800 border-red-200 hover:border-red-400 shadow-xs'
              }`}
            >
              <div className="w-4 h-4 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                <DepartmentIcon name={dept.iconName} className="w-2.5 h-2.5 text-slate-600" />
              </div>

              <span>Corsia {dept.aisleNumber}</span>

              {isFullyDone ? (
                <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
              ) : (
                <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.2 rounded-full">
                  {pending}
                </span>
              )}
            </button>

            {idx < activeAisles.length - 1 && (
              <ArrowRight className="w-3 h-3 text-slate-300 shrink-0" />
            )}
          </React.Fragment>
        ))}

        <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />

        {/* Casse */}
        <div className="shrink-0 flex items-center px-2 py-1.5 rounded-lg bg-amber-50 text-amber-900 text-[11px] font-bold border border-amber-200">
          <span>Casse</span>
        </div>
      </div>
    </div>
  );
};
