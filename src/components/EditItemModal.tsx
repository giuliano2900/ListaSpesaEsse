import React, { useState, useEffect } from 'react';
import { Department, ShoppingItem, UnitType } from '../types';
import { triggerHaptic } from '../utils/haptics';
import { X, Save } from 'lucide-react';

interface EditItemModalProps {
  item: ShoppingItem | null;
  departments: Department[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedItem: ShoppingItem) => void;
}

const UNIT_OPTIONS: { value: UnitType; label: string }[] = [
  { value: 'pz', label: 'pz' },
  { value: 'kg', label: 'kg' },
  { value: 'g', label: 'g' },
  { value: 'etti', label: 'etti' },
  { value: 'l', label: 'l' },
  { value: 'conf', label: 'conf' },
  { value: 'bottiglie', label: 'bottiglie' },
  { value: 'buste', label: 'buste' },
];

export const EditItemModal: React.FC<EditItemModalProps> = ({
  item,
  departments,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(item?.name || '');
  const [quantity, setQuantity] = useState(item?.quantity || 1);
  const [unit, setUnit] = useState<UnitType>(item?.unit || 'pz');
  const [departmentId, setDepartmentId] = useState(item?.departmentId || departments[0]?.id || '');
  const [notes, setNotes] = useState(item?.notes || '');

  useEffect(() => {
    if (item) {
      setName(item.name);
      setQuantity(item.quantity);
      setUnit(item.unit);
      setDepartmentId(item.departmentId);
      setNotes(item.notes || '');
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    triggerHaptic('success');
    onSave({
      ...item,
      name: name.trim(),
      quantity: quantity > 0 ? quantity : 1,
      unit,
      departmentId,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full shadow-2xl border-t sm:border border-slate-200 overflow-hidden max-h-[85dvh] flex flex-col animate-in slide-in-from-bottom duration-200"
      >
        {/* Mobile Pull Handle */}
        <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto my-2.5 sm:hidden shrink-0" />

        <div className="px-4 py-3 bg-[#0b1f38] text-white flex items-center justify-between shrink-0">
          <h3 className="text-sm sm:text-base font-bold">Modifica Articolo</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white rounded-lg touch-manipulation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3 overflow-y-auto flex-1 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Nome Prodotto
            </label>
            <input
              type="text"
              autoCapitalize="sentences"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-base sm:text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 font-semibold text-slate-800"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Quantità
              </label>
              <input
                type="number"
                inputMode="decimal"
                step="any"
                min="0.1"
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
                className="w-full px-3 py-2 text-base sm:text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 font-bold text-slate-800"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Unità
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as UnitType)}
                className="w-full px-3 py-2 text-base sm:text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-700 font-semibold"
              >
                {UNIT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Corsia Esselunga
            </label>
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="w-full px-3 py-2 text-base sm:text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-700 font-semibold"
            >
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  Corsia {d.aisleNumber}: {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Note (opzionale)
            </label>
            <input
              type="text"
              autoCapitalize="sentences"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Es. marca Esselunga Top, bio, offerta..."
              className="w-full px-3 py-2 text-base sm:text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-700"
            />
          </div>

          <div className="pt-2 pb-safe flex items-center justify-end gap-2 border-t border-slate-100 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 h-10 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl touch-manipulation"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 px-4 h-10 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold rounded-xl transition touch-manipulation"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Salva</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
