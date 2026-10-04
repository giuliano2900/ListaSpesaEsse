import React, { useState } from 'react';
import { Department, ShoppingItem } from '../types';
import { parseItemText, detectDepartment } from '../utils/categorizer';
import { X, FileText, Check, Plus, Sparkles } from 'lucide-react';

interface BulkImportModalProps {
  isOpen: boolean;
  departments: Department[];
  onClose: () => void;
  onImportItems: (items: Omit<ShoppingItem, 'id' | 'completed' | 'createdAt'>[]) => void;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  isOpen,
  departments,
  onClose,
  onImportItems,
}) => {
  const [rawText, setRawText] = useState('');

  if (!isOpen) return null;

  const handleImport = () => {
    const lines = rawText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith('#') && !l.startsWith('//'));

    if (lines.length === 0) return;

    const parsedItems: Omit<ShoppingItem, 'id' | 'completed' | 'createdAt'>[] = lines.map((line) => {
      // Rimuove eventuali trattini iniziali o elenchi puntati (es. "- 2 kg mele" o "• latte")
      const cleanLine = line.replace(/^[-•*–\d+.]\s*/, '').trim();
      const parsed = parseItemText(cleanLine);
      const detectedDept = detectDepartment(parsed.name, departments[0]?.id || 'pasta_riso');

      return {
        name: parsed.name,
        quantity: parsed.quantity,
        unit: parsed.unit,
        departmentId: detectedDept,
      };
    });

    onImportItems(parsedItems);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full shadow-2xl border-t sm:border border-slate-200 overflow-hidden flex flex-col max-h-[92dvh] animate-in slide-in-from-bottom duration-200"
      >
        {/* Mobile Drag Indicator */}
        <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto my-2.5 sm:hidden shrink-0" />

        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#0b1f38] to-[#16365c] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-900 font-bold text-sm shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">
                Incolla Lista Rapida (WhatsApp / Note)
              </h3>
              <p className="text-xs text-slate-300 line-clamp-1">
                Riconoscimento corsie e quantità automatico
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition touch-manipulation shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Textarea */}
        <div className="p-4 sm:p-5 space-y-3 overflow-y-auto flex-1">
          <p className="text-xs text-slate-500">
            L'app riconoscerà automaticamente la quantità (es. <em>2 kg</em>, <em>500g</em>, <em>1l</em>, <em>6 pz</em>) e posizionerà ciascun articolo nello scaffale corretto dell'Esselunga!
          </p>

          <textarea
            rows={6}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Es:&#10;2 kg mele&#10;pane&#10;1 l latte fresco&#10;500g petto di pollo&#10;2 conf pasta&#10;detersivo piatti"
            className="w-full p-3.5 min-h-[140px] text-base sm:text-xs font-mono bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-800 resize-none leading-relaxed"
          />
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 pb-safe bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 min-h-[44px] text-xs font-semibold text-slate-600 hover:text-slate-900 transition touch-manipulation order-2 sm:order-1 border border-slate-200 rounded-xl"
          >
            Annulla
          </button>

          <button
            type="button"
            onClick={handleImport}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold rounded-xl transition shadow-xs touch-manipulation order-1 sm:order-2"
          >
            <Plus className="w-4 h-4" />
            <span>Importa e Ordina per Scaffale</span>
          </button>
        </div>
      </div>
    </div>
  );
};
