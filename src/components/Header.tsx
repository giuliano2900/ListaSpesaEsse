import React, { useState, useEffect, useRef } from 'react';
import { StoreLayout, ShoppingItem } from '../types';
import { triggerHaptic } from '../utils/haptics';
import {
  ShoppingCart,
  MapPin,
  Sliders,
  Play,
  CheckCircle2,
  PlusCircle,
  Sparkles,
  Pin,
  PinOff,
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

  // Reparti unici con articoli rimasti
  const activeDepartments = new Set(
    items.filter((i) => !i.completed).map((i) => i.departmentId)
  );

  // Stato di preferenza per header fisso / sticky (salvato in localStorage)
  const [isSticky, setIsSticky] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('esselunga_header_sticky');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollYRef = useRef(0);

  const toggleSticky = () => {
    triggerHaptic('selection');
    setIsSticky((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('esselunga_header_sticky', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  useEffect(() => {
    if (!isSticky) {
      setIsScrolled(false);
      setIsHidden(false);
      return;
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const lastScrollY = lastScrollYRef.current;

      // Determinare se la pagina è scrollata
      if (currentScrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
        setIsHidden(false);
        lastScrollYRef.current = currentScrollY;
        return;
      }

      // Auto-hide durante lo scroll verso il basso per lasciare tutto lo spazio centrale
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHidden(true);
      } else if (currentScrollY < lastScrollY - 6) {
        // Scrolling verso l'alto: mostra l'header in versione ultra-compatta
        setIsHidden(false);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isSticky]);

  return (
    <header
      className={`bg-[#0b1f38] text-white border-b border-slate-800 transition-all duration-300 pt-safe ${
        isSticky
          ? `sticky top-0 z-30 ${
              isHidden ? '-translate-y-full shadow-none' : 'translate-y-0 shadow-md'
            }`
          : 'relative z-20 shadow-sm'
      }`}
    >
      <div
        className={`max-w-5xl mx-auto px-3.5 sm:px-6 transition-all duration-200 ${
          isScrolled && isSticky ? 'py-1.5 sm:py-2' : 'py-3.5'
        }`}
      >
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          {/* Logo & Info Negozio */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div
              className={`rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-inner text-white font-black tracking-tighter shrink-0 border border-red-500/40 transition-all ${
                isScrolled && isSticky ? 'w-7 h-7 text-base' : 'w-10 h-10 text-xl'
              }`}
            >
              <span className="font-serif italic font-bold">E</span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h1
                  className={`font-bold text-slate-100 tracking-tight flex items-center gap-1.5 transition-all truncate ${
                    isScrolled && isSticky ? 'text-sm' : 'text-base sm:text-lg'
                  }`}
                >
                  <span>Spesa Esselunga</span>
                  {!(isScrolled && isSticky) && (
                    <span className="hidden xs:inline-block text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                      Percorso Ottimizzato
                    </span>
                  )}
                </h1>

                {/* Badge articoli compatto in modalità scrollata */}
                {isScrolled && isSticky && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                    {pendingItems} da fare
                  </span>
                )}
              </div>

              {/* Nome del quartiere / negozio (nascosto quando scrollato per ridurre l'ingombro) */}
              {!(isScrolled && isSticky) && (
                <button
                  type="button"
                  onClick={onOpenCustomize}
                  className="group flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors mt-0.5 text-left truncate max-w-full"
                  title="Personalizza la disposizione del tuo quartiere"
                >
                  <MapPin className="w-3.5 h-3.5 text-red-400 group-hover:scale-110 transition-transform shrink-0" />
                  <span className="underline decoration-slate-600 underline-offset-2 group-hover:decoration-red-400 truncate">
                    {layout.storeName} — {layout.neighborhood}
                  </span>
                  <span className="hidden sm:inline text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded shrink-0">
                    Modifica corsie
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Actions & Modalità Spesa */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Importa / Incolla lista */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                onOpenBulkImport();
              }}
              className={`inline-flex items-center justify-center gap-1.5 text-slate-200 bg-slate-800/90 hover:bg-slate-700 active:bg-slate-600 hover:text-white rounded-xl border border-slate-700 transition shadow-xs touch-manipulation ${
                isScrolled && isSticky
                  ? 'w-9 h-9 sm:px-2.5 sm:py-1.5 sm:w-auto text-xs font-medium'
                  : 'px-3 py-2.5 min-h-[44px] text-xs font-medium'
              }`}
              title="Incolla lista da WhatsApp o note"
            >
              <PlusCircle className="w-4 h-4 text-amber-400 shrink-0" />
              {!(isScrolled && isSticky) ? (
                <>
                  <span className="hidden xs:inline sm:inline">Incolla lista</span>
                  <span className="xs:hidden sm:hidden">Importa</span>
                </>
              ) : (
                <span className="hidden md:inline text-xs">Importa</span>
              )}
            </button>

            {/* Personalizza corsie */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                onOpenCustomize();
              }}
              className={`inline-flex items-center justify-center gap-1.5 text-slate-200 bg-slate-800/90 hover:bg-slate-700 active:bg-slate-600 hover:text-white rounded-xl border border-slate-700 transition shadow-xs touch-manipulation ${
                isScrolled && isSticky
                  ? 'w-9 h-9 sm:px-2.5 sm:py-1.5 sm:w-auto text-xs font-medium'
                  : 'px-3 py-2.5 min-h-[44px] text-xs font-medium'
              }`}
              title="Personalizza sequenza scaffali"
            >
              <Sliders className="w-4 h-4 text-sky-400 shrink-0" />
              {!(isScrolled && isSticky) ? (
                <>
                  <span className="hidden xs:inline sm:inline">Corsie negozio</span>
                  <span className="xs:hidden sm:hidden">Corsie</span>
                </>
              ) : (
                <span className="hidden md:inline text-xs">Corsie</span>
              )}
            </button>

            {/* Inizia / Esci da Spesa */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic('medium');
                onToggleShoppingMode();
              }}
              disabled={totalItems === 0}
              className={`inline-flex items-center justify-center gap-1.5 font-bold rounded-xl transition shadow-md touch-manipulation ${
                isScrolled && isSticky
                  ? 'px-3 py-1.5 min-h-[36px] text-xs'
                  : 'px-4 py-2.5 min-h-[44px] text-xs'
              } ${
                isShoppingMode
                  ? 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white'
                  : 'bg-red-600 hover:bg-red-500 active:bg-red-700 text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isShoppingMode ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white animate-pulse" />
                  <span>Esci</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isScrolled && isSticky ? 'Spesa' : 'Inizia Spesa in Corsia'}</span>
                </>
              )}
            </button>

            {/* Toggle Header Fisso / Sbloccato */}
            <button
              type="button"
              onClick={toggleSticky}
              className={`p-1.5 sm:p-2 rounded-xl border transition touch-manipulation ${
                isSticky
                  ? 'text-slate-400 hover:text-white bg-slate-800/60 border-slate-700/60'
                  : 'text-amber-300 bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20'
              }`}
              title={
                isSticky
                  ? 'Header fisso attivo: clicca per sbloccarlo in cima alla pagina'
                  : 'Header sbloccato: clicca per renderlo fisso/intelligente'
              }
            >
              {isSticky ? (
                <Pin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300" />
              ) : (
                <PinOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
              )}
            </button>
          </div>
        </div>

        {/* Barra di riepilogo rapido (nascosta quando si scrolla per non togliere spazio alla lista centrale) */}
        {!(isScrolled && isSticky) && (
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <ShoppingCart className="w-3.5 h-3.5 text-slate-400" />
                <strong className="text-slate-200">{totalItems}</strong> {totalItems === 1 ? 'articolo' : 'articoli'}
                {completedItems > 0 && (
                  <span className="text-emerald-400">({completedItems} nel carrello)</span>
                )}
              </span>

              <span className="hidden sm:inline text-slate-600">•</span>

              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{activeDepartments.size} tappe tra gli scaffali</span>
              </span>
            </div>

            <div className="text-[11px] text-slate-400 font-medium">
              Ordinamento: <span className="text-emerald-400 font-semibold">Percorso ingresso ➔ casse</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
