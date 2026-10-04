import React from 'react';
import { StoreLayout, ShoppingItem } from '../types';
import { triggerHaptic } from '../utils/haptics';
import {
  MapPin,
  SlidersHorizontal,
  Play,
  CheckCircle2,
  ClipboardPaste,
} from 'lucide-react';

interface HeaderProps {
  layout: StoreLayout;
  items: ShoppingItem[];
  isShoppingMode: boolean;
  onToggleShoppingMode: () => void;
  onOpenCustomize: () => void;
  onOpenBulkImport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  layout,
  items,
  isShoppingMode,
  onToggleShoppingMode,
  onOpenCustomize,
  onOpenBulkImport,
}) => {
  const totalItems = items.length;
  const completedItems = items.filter((i) => i.completed).length;
  const pendingItems = totalItems - completedItems;

  return (
    <header className="sticky top-0 z-40 bg-[#0b1f38]/95 backdrop-blur-md text-white border-b border-slate-800/80 pt-safe-topbar px-safe shadow-sm transition-all duration-200">
      <div className="max-w-5xl w-full mx-auto px-2 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2">
        {/* Zone 1: Brand & Store Location */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-inner text-white font-black tracking-tight shrink-0 border border-red-500/30">
            <span className="font-serif italic text-base sm:text-lg">E</span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-sm sm:text-base text-white tracking-tight truncate leading-tight">
                Spesa Esselunga
              </h1>
              {totalItems > 0 && (
                <span className="hidden sm:inline-flex items-center text-[11px] font-semibold text-slate-300 bg-slate-800/90 px-2 py-0.5 rounded-full border border-slate-700/80 tabular-nums">
                  {pendingItems} da prendere
                </span>
              )}
            </div>

            {/* Store and Neighborhood quiet metadata */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                onOpenCustomize();
              }}
              className="group flex items-center gap-1 text-[11px] sm:text-xs text-slate-300 hover:text-white transition-colors truncate max-w-[200px] sm:max-w-xs text-left"
              title="Tocca per cambiare quartiere o ordinare le corsie"
            >
              <MapPin className="w-3 h-3 text-red-400 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="truncate group-hover:underline underline-offset-2">
                {layout.neighborhood}
              </span>
            </button>
          </div>
        </div>

        {/* Zone 2 & 3: Primary Actions (Touch targets >= 44x44px, clean single-line controls) */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Incolla lista / Importa */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onOpenBulkImport();
            }}
            className="h-10 px-2.5 sm:px-3 rounded-xl bg-slate-800 hover:bg-slate-750 active:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/70 text-xs font-semibold flex items-center gap-1.5 transition touch-manipulation active:scale-[0.98]"
            title="Incolla elenco da WhatsApp o note"
          >
            <ClipboardPaste className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="hidden sm:inline">Incolla lista</span>
            <span className="sm:hidden text-[11px]">Incolla</span>
          </button>

          {/* Personalizza corsie negozio */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onOpenCustomize();
            }}
            className="h-10 px-2.5 sm:px-3 rounded-xl bg-slate-800 hover:bg-slate-750 active:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/70 text-xs font-semibold flex items-center gap-1.5 transition touch-manipulation active:scale-[0.98]"
            title="Personalizza l'ordine delle corsie del tuo negozio"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="hidden sm:inline">Corsie</span>
          </button>

          {/* Toggle Modalità Spesa in Corsia */}
          {totalItems > 0 && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic('medium');
                onToggleShoppingMode();
              }}
              className={`h-10 px-3 sm:px-4 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition shadow-sm touch-manipulation active:scale-[0.97] ${
                isShoppingMode
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-red-600 hover:bg-red-500 text-white'
              }`}
            >
              {isShoppingMode ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Esci</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-current" />
                  <span className="hidden xs:inline">Spesa in Corsia</span>
                  <span className="xs:hidden">Spesa</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
