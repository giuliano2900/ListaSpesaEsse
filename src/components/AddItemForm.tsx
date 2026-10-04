import React, { useState, useEffect, useRef } from 'react';
import { Department, UnitType, ShoppingItem } from '../types';
import { detectDepartment, parseItemText } from '../utils/categorizer';
import { COMMON_FREQUENT_ITEMS } from '../data/defaultDepartments';
import { DepartmentIcon } from './DepartmentIcon';
import { triggerHaptic } from '../utils/haptics';
import { Plus, Sparkles, Minus, Tag, ChevronDown, Check } from 'lucide-react';

interface AddItemFormProps {
  departments: Department[];
  onAddItem: (item: Omit<ShoppingItem, 'id' | 'completed' | 'createdAt'>) => void;
}

const UNIT_OPTIONS: { value: UnitType; label: string }[] = [
  { value: 'pz', label: 'Pezzi (pz)' },
  { value: 'kg', label: 'Chilogrammi (kg)' },
  { value: 'g', label: 'Grammi (g)' },
  { value: 'etti', label: 'Etti (100g)' },
  { value: 'l', label: 'Litri (l)' },
  { value: 'conf', label: 'Confezioni (conf)' },
  { value: 'bottiglie', label: 'Bottiglie' },
  { value: 'buste', label: 'Buste / Pacchi' },
];

const QUICK_QUANTITY_PRESETS: { label: string; qty: number; unit: UnitType }[] = [
  { label: '1 pz', qty: 1, unit: 'pz' },
  { label: '2 pz', qty: 2, unit: 'pz' },
  { label: '500g', qty: 500, unit: 'g' },
  { label: '1 kg', qty: 1, unit: 'kg' },
  { label: '1 l', qty: 1, unit: 'l' },
  { label: '2 conf', qty: 2, unit: 'conf' },
];

export const AddItemForm: React.FC<AddItemFormProps> = ({ departments, onAddItem }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState<UnitType>('pz');
  const [selectedDeptId, setSelectedDeptId] = useState<string>(departments[0]?.id || 'ortofrutta');
  const [isManuallySelected, setIsManuallySelected] = useState(false);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [justAddedFeedback, setJustAddedFeedback] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-detect department as user types
  useEffect(() => {
    if (!isManuallySelected && name.trim().length > 1) {
      const detected = detectDepartment(name);
      if (departments.some((d) => d.id === detected)) {
        setSelectedDeptId(detected);
      }
    }
  }, [name, isManuallySelected, departments]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    setName(rawVal);
    // If user pastes or types something like "2 kg mele", auto-parse quantity and unit
    if (rawVal.includes(' ') && (rawVal.match(/\d/) || rawVal.match(/kg|litr|conf|etti|bottigl/i))) {
      const parsed = parseItemText(rawVal);
      if (parsed.quantity !== 1 || parsed.unit !== 'pz') {
        setQuantity(parsed.quantity);
        setUnit(parsed.unit);
        setName(parsed.name);
      }
    }
  };

  const handleDepartmentChange = (deptId: string) => {
    setSelectedDeptId(deptId);
    setIsManuallySelected(true);
    triggerHaptic('light');
  };

  const adjustQuantity = (delta: number) => {
    triggerHaptic('light');
    setQuantity((prev) => {
      const next = Math.max(0.1, Number((prev + delta).toFixed(2)));
      return next;
    });
  };

  const applyQuickPreset = (presetQty: number, presetUnit: UnitType) => {
    triggerHaptic('light');
    setQuantity(presetQty);
    setUnit(presetUnit);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    triggerHaptic('success');
    onAddItem({
      name: name.trim(),
      quantity: quantity > 0 ? quantity : 1,
      unit,
      departmentId: selectedDeptId,
      notes: notes.trim() || undefined,
    });

    // Visual feedback
    setJustAddedFeedback(true);
    setTimeout(() => setJustAddedFeedback(false), 1200);

    // Reset for next item
    setName('');
    setQuantity(1);
    setUnit('pz');
    setNotes('');
    setShowNotes(false);
    setIsManuallySelected(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleQuickAdd = (item: typeof COMMON_FREQUENT_ITEMS[0]) => {
    triggerHaptic('light');
    onAddItem({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      departmentId: item.departmentId,
    });
  };

  const currentDept = departments.find((d) => d.id === selectedDeptId) || departments[0];

  return (
    <div className="bg-white rounded-3xl p-3.5 sm:p-5 border border-slate-200 shadow-sm transition-all">
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="flex items-center justify-between">
          <label htmlFor="product-name-input" className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <span>Aggiungi Prodotto</span>
            <span className="text-xs font-normal text-slate-500 hidden sm:inline">
              (con quantità e corsia automatica)
            </span>
          </label>

          <button
            type="button"
            onClick={() => {
              setShowNotes(!showNotes);
              triggerHaptic('light');
            }}
            className="text-xs text-slate-600 hover:text-slate-900 active:text-red-600 flex items-center gap-1 transition py-1 px-2 rounded-lg hover:bg-slate-100 touch-manipulation"
          >
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium">{showNotes ? 'Nascondi note' : '+ Note/Marca'}</span>
          </button>
        </div>

        {/* Input Principale: Prodotto e Quantità */}
        <div className="space-y-2.5">
          {/* Nome Prodotto - Ottimizzato per tastiera smartphone */}
          <div className="relative">
            <input
              id="product-name-input"
              ref={inputRef}
              type="text"
              inputMode="text"
              enterKeyHint="done"
              autoCapitalize="sentences"
              autoCorrect="on"
              value={name}
              onChange={handleNameChange}
              placeholder="Es. Pomodori datterini, Pasta Barilla, Latte..."
              className="w-full px-3.5 py-3 min-h-[48px] text-base sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition text-slate-800 placeholder-slate-400 shadow-inner"
              required
            />
          </div>

          {/* Quantità con Stepper e Unità */}
          <div className="grid grid-cols-12 gap-2">
            {/* Quantità con Stepper Touch-friendly */}
            <div className="col-span-6 sm:col-span-7 flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-1.5 py-1 min-h-[46px] focus-within:bg-white focus-within:ring-2 focus-within:ring-red-500">
              <button
                type="button"
                onClick={() => adjustQuantity(-1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200 active:bg-slate-300 transition shrink-0 touch-manipulation active:scale-95"
                title="Diminuisci quantità"
              >
                <Minus className="w-4 h-4 stroke-[2.5]" />
              </button>

              <input
                type="number"
                inputMode="decimal"
                min="0.1"
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
                className="w-full text-center text-base sm:text-sm font-black text-slate-800 bg-transparent focus:outline-none"
                title="Quantità"
              />

              <button
                type="button"
                onClick={() => adjustQuantity(1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200 active:bg-slate-300 transition shrink-0 touch-manipulation active:scale-95"
                title="Aumenta quantità"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Unità di Misura (con font 16px per evitare zoom iOS) */}
            <div className="col-span-6 sm:col-span-5 relative">
              <select
                value={unit}
                onChange={(e) => {
                  setUnit(e.target.value as UnitType);
                  triggerHaptic('light');
                }}
                className="w-full appearance-none px-3 pr-8 py-2.5 min-h-[46px] text-base sm:text-sm font-semibold bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-700 cursor-pointer"
              >
                {UNIT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Chip Presets Quantità Rapida per Smartphone */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none scroll-touch">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-0.5 hidden xs:inline">
              Rapidi:
            </span>
            {QUICK_QUANTITY_PRESETS.map((preset) => {
              const isSelected = quantity === preset.qty && unit === preset.unit;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => applyQuickPreset(preset.qty, preset.unit)}
                  className={`px-2.5 py-1 min-h-[32px] text-xs font-semibold rounded-xl border transition shrink-0 touch-manipulation active:scale-95 ${
                    isSelected
                      ? 'bg-red-50 text-red-700 border-red-300 font-bold'
                      : 'bg-slate-100/90 text-slate-600 border-slate-200 hover:bg-slate-200 active:bg-slate-300'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Note facoltative (marca, sconto, bio) */}
        {showNotes && (
          <div className="pt-0.5">
            <input
              type="text"
              inputMode="text"
              autoCapitalize="sentences"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Note o dettagli (es. Esselunga Bio, sconto Fidaty, 100% italiano...)"
              className="w-full px-3.5 py-2.5 min-h-[44px] text-base sm:text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-700 placeholder-slate-400"
            />
          </div>
        )}

        {/* Scaffale / Reparto Riconosciuto & Bottone Inserisci */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="text-slate-500 flex items-center gap-1 font-medium shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Corsia:
            </span>

            <div className="relative flex-1 sm:flex-none max-w-full">
              <select
                value={selectedDeptId}
                onChange={(e) => handleDepartmentChange(e.target.value)}
                className="w-full sm:w-auto appearance-none pl-7 pr-8 py-2 min-h-[42px] bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-base sm:text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer transition truncate"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    Corsia {d.aisleNumber}: {d.name}
                  </option>
                ))}
              </select>
              <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600">
                <DepartmentIcon name={currentDept?.iconName || 'ShoppingBag'} className="w-3.5 h-3.5" />
              </div>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>

            {isManuallySelected && (
              <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 font-medium">
                scelta manuale
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-black rounded-2xl transition shadow-md touch-manipulation active:scale-[0.98]"
          >
            {justAddedFeedback ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Aggiunto alla Lista!</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Inserisci nella lista</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Suggerimenti veloci / Articoli frequenti Esselunga */}
      <div className="mt-3 pt-2.5 border-t border-slate-100">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Aggiunta rapida con 1 tocco:
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1.5 pt-0.5 scrollbar-none scroll-touch touch-pan-x">
          {COMMON_FREQUENT_ITEMS.slice(0, 8).map((freq) => (
            <button
              key={freq.name}
              type="button"
              onClick={() => handleQuickAdd(freq)}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-red-50 hover:text-red-700 hover:border-red-200 active:bg-red-100 border border-slate-200 rounded-xl transition touch-manipulation active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 text-slate-400" />
              <span>{freq.name}</span>
              <span className="text-[10px] font-bold text-slate-500 bg-white px-1.5 py-0.5 rounded-md border border-slate-200">
                {freq.quantity} {freq.unit}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

