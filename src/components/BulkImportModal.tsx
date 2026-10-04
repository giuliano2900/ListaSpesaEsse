import React, { useState } from 'react';
import { Department, ShoppingItem } from '../types';
import { parseItemText, detectDepartment } from '../utils/categorizer';
import { triggerHaptic } from '../utils/haptics';
import { X, ClipboardPaste, Plus } from 'lucide-react';

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

    triggerHaptic('success');
    const parsedItems: Omit<ShoppingItem, 'id' | 'completed' | 'createdAt'>[] = lines.map((line) => {
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
        className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full shadow-2xl border-t sm:border border-slate-200 overflow-hidden flex flex-col max-h-[85dvh] animate-in slide-in-from-bottom duration-200"
      >
        {/* Mobile Pull Indicator */}
        <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto my-2.5 sm:hidden shrink-0" />

        {/* Header */}
        <div className="px-4 py-3 sm:py-3.5 bg-[#0b1f38] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ClipboardPaste className="w-4 h-4 text-amber-400 shrink-0" />
            <h3 className="text-sm sm:text-base font-bold tracking-tight">
              Incolla Lista Rapida
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition touch-manipulation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Textarea */}
        <div className="p-4 space-y-2.5 overflow-y-auto flex-1">
          <p className="text-xs text-slate-500">
            Incolla la lista della spesa da WhatsApp o dalle note. L'app riconoscerà automaticamente quantità e corsia corretta!
          </p>

          <textarea
            rows={6}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Es:&#10;2 kg mele&#10;1 l latte fresco&#10;500g pollo&#10;2 conf pasta&#10;detersivo piatti"
            className="w-full p-3 min-h-[140px] text-base sm:text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-800 resize-none leading-relaxed"
          />
        </div>

        {/* Footer */}
        <div className="p-3 pb-safe bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 h-10 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl touch-manipulation"
          >
            Annulla
          </button>

          <button
            type="button"
            onClick={handleImport}
            disabled={!rawText.trim()}
            className="inline-flex items-center justify-center gap-1.5 px-4 h-10 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-bold rounded-xl transition shadow-xs touch-manipulation"
          >
            <Plus className="w-4 h-4" />
            <span>Importa e Ordina</span>
          </button>
        </div>
      </div>
    </div>
  );
};
