import React, { useState, useEffect, useRef } from 'react';
import { Department, UnitType, ShoppingItem } from '../types';
import { detectDepartment, parseItemText } from '../utils/categorizer';
import { COMMON_FREQUENT_ITEMS } from '../data/defaultDepartments';
import { DepartmentIcon } from './DepartmentIcon';
import { triggerHaptic } from '../utils/haptics';
import { Plus, Minus, Check, ChevronDown, FileText, X } from 'lucide-react';

interface AddItemFormProps {
  departments: Department[];
  onAddItem: (item: Omit<ShoppingItem, 'id' | 'completed' | 'createdAt'>) => void;
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
    // Intelligent auto-parsing if user types/pastes "2 kg mele" or "6 bottiglie acqua"
    if (rawVal.includes(' ') && (rawVal.match(/\d/) || rawVal.match(/kg|litr|conf|etti|bottigl/i))) {
      const parsed = parseItemText(rawVal);
      if (parsed.quantity !== 1 || parsed.unit !== 'pz') {
        setQuantity(parsed.quantity);
        setUnit(parsed.unit);
        setName(parsed.name);
      }
    }
  };

  const adjustQuantity = (delta: number) => {
    triggerHaptic('light');
    setQuantity((prev) => Math.max(0.1, Number((prev + delta).toFixed(2))));
  };

  const handleDepartmentChange = (deptId: string) => {
    setSelectedDeptId(deptId);
    setIsManuallySelected(true);
    triggerHaptic('light');
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

    setJustAddedFeedback(true);
    setTimeout(() => setJustAddedFeedback(false), 900);

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
    <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-slate-200 shadow-xs space-y-3 transition-all">
      <form onSubmit={handleSubmit} className="space-y-2.5">
        {/* Main Input Row: Product text input with submit button */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-2xl p-1 focus-within:bg-white focus-within:ring-2 focus-within:ring-red-500 focus-within:border-red-500 transition-all">
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
            placeholder="Aggiungi prodotto (es. Pane, 2 kg mele, Latte...)"
            className="flex-1 px-3 py-2 text-base sm:text-sm bg-transparent focus:outline-none text-slate-800 placeholder-slate-400 font-medium min-w-0"
            required
          />

          {name.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setName('');
                if (inputRef.current) inputRef.current.focus();
              }}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg touch-manipulation"
              title="Cancella testo"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            disabled={!name.trim()}
            className={`h-10 px-3.5 sm:px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition touch-manipulation shrink-0 active:scale-95 ${
              justAddedFeedback
                ? 'bg-emerald-600 text-white'
                : 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white disabled:opacity-40 disabled:pointer-events-none'
            }`}
          >
            {justAddedFeedback ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span className="hidden xs:inline">Aggiunto!</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Aggiungi</span>
              </>
            )}
          </button>
        </div>

        {/* Dynamic Controls Bar: Quantity Stepper, Unit, Detected Aisle, and Notes */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 text-xs">
          {/* Stepper Quantità & Unità (ultra-compatto) */}
          <div className="flex items-center gap-1.5 bg-slate-100/80 rounded-xl p-1 border border-slate-200/60">
            <button
              type="button"
              onClick={() => adjustQuantity(-1)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white active:bg-slate-200 transition touch-manipulation active:scale-90"
              title="Meno"
            >
              <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>

            <span className="font-bold text-slate-800 min-w-[20px] text-center tabular-nums">
              {quantity}
            </span>

            <button
              type="button"
              onClick={() => adjustQuantity(1)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white active:bg-slate-200 transition touch-manipulation active:scale-90"
              title="Più"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>

            {/* Select unità compatto */}
            <div className="relative border-l border-slate-200 pl-1">
              <select
                value={unit}
                onChange={(e) => {
                  setUnit(e.target.value as UnitType);
                  triggerHaptic('light');
                }}
                className="appearance-none bg-transparent pr-4 pl-1 py-1 font-bold text-slate-700 cursor-pointer focus:outline-none text-xs"
              >
                {UNIT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-0.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Scaffale / Reparto Riconosciuto */}
          <div className="flex items-center gap-1.5 flex-1 min-w-[140px] justify-end">
            <div className="relative max-w-full">
              <select
                value={selectedDeptId}
                onChange={(e) => handleDepartmentChange(e.target.value)}
                className="appearance-none pl-6 pr-6 py-1.5 text-xs font-bold bg-slate-100/80 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200/80 cursor-pointer focus:outline-none focus:ring-1 focus:ring-red-500 truncate max-w-[200px]"
                title="Seleziona corsia scaffale"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    Corsia {d.aisleNumber}: {d.name}
                  </option>
                ))}
              </select>
              <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <DepartmentIcon name={currentDept?.iconName || 'ShoppingBag'} className="w-3 h-3" />
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Toggle Note */}
            <button
              type="button"
              onClick={() => {
                setShowNotes(!showNotes);
                triggerHaptic('light');
              }}
              className={`p-1.5 rounded-lg border transition touch-manipulation ${
                showNotes || notes
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'text-slate-400 hover:text-slate-700 border-transparent hover:border-slate-200'
              }`}
              title="Aggiungi note (marca, bio, offerta)"
            >
              <FileText className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Input note opzionale espanso solo se richiesto */}
        {showNotes && (
          <div className="pt-1">
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Note/Dettagli (es. Esselunga Bio, sconto Fidaty...)"
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-700 placeholder-slate-400"
            />
          </div>
        )}
      </form>

      {/* Suggerimenti veloci con 1 tocco (Scorrevole, pulito, zero ingombro) */}
      <div className="pt-1 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none scroll-touch">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
          Frequenti:
        </span>
        {COMMON_FREQUENT_ITEMS.slice(0, 7).map((freq) => (
          <button
            key={freq.name}
            type="button"
            onClick={() => handleQuickAdd(freq)}
            className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100/90 hover:bg-red-50 hover:text-red-700 active:bg-red-100 border border-slate-200/60 rounded-lg transition touch-manipulation active:scale-95"
          >
            <Plus className="w-3 h-3 text-slate-400" />
            <span>{freq.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
