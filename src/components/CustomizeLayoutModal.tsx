import React, { useState, useEffect } from 'react';
import { Department, StoreLayout } from '../types';
import { DEFAULT_DEPARTMENTS } from '../data/defaultDepartments';
import { DepartmentIcon } from './DepartmentIcon';
import { triggerHaptic } from '../utils/haptics';
import {
  X,
  ArrowUp,
  ArrowDown,
  Save,
  Plus,
  Trash2,
  Check,
  SlidersHorizontal,
} from 'lucide-react';

interface CustomizeLayoutModalProps {
  layout: StoreLayout;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newLayout: StoreLayout) => void;
}

export const CustomizeLayoutModal: React.FC<CustomizeLayoutModalProps> = ({
  layout,
  isOpen,
  onClose,
  onSave,
}) => {
  const [storeName, setStoreName] = useState(layout.storeName);
  const [neighborhood, setNeighborhood] = useState(layout.neighborhood);
  const [departments, setDepartments] = useState<Department[]>(
    [...layout.departments].sort((a, b) => a.order - b.order)
  );
  const [newDeptName, setNewDeptName] = useState('');
  const [savedFeedback, setSavedFeedback] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStoreName(layout.storeName);
      setNeighborhood(layout.neighborhood);
      setDepartments([...layout.departments].sort((a, b) => a.order - b.order));
      setNewDeptName('');
      setSavedFeedback(false);
    }
  }, [isOpen, layout]);

  if (!isOpen) return null;

  const moveUp = (index: number) => {
    if (index === 0) return;
    triggerHaptic('light');
    const next = [...departments];
    const temp = next[index - 1];
    next[index - 1] = next[index];
    next[index] = temp;

    const reindexed = next.map((d, idx) => ({
      ...d,
      order: idx + 1,
      aisleNumber: idx + 1,
    }));
    setDepartments(reindexed);
  };

  const moveDown = (index: number) => {
    if (index === departments.length - 1) return;
    triggerHaptic('light');
    const next = [...departments];
    const temp = next[index + 1];
    next[index + 1] = next[index];
    next[index] = temp;

    const reindexed = next.map((d, idx) => ({
      ...d,
      order: idx + 1,
      aisleNumber: idx + 1,
    }));
    setDepartments(reindexed);
  };

  const handleUpdateDeptName = (id: string, name: string) => {
    setDepartments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, name } : d))
    );
  };

  const handleDeleteDept = (id: string) => {
    if (departments.length <= 3) return;
    triggerHaptic('warning');
    const filtered = departments
      .filter((d) => d.id !== id)
      .map((d, idx) => ({ ...d, order: idx + 1, aisleNumber: idx + 1 }));
    setDepartments(filtered);
  };

  const handleAddCustomDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName.trim()) return;

    triggerHaptic('light');
    const newId = 'custom_' + Date.now();
    const newDept: Department = {
      id: newId,
      name: newDeptName.trim(),
      aisleNumber: departments.length + 1,
      iconName: 'ShoppingBag',
      color: 'slate',
      description: 'Reparto personalizzato del tuo Esselunga',
      order: departments.length + 1,
    };

    setDepartments([...departments, newDept]);
    setNewDeptName('');
  };

  const handleResetToStandard = () => {
    triggerHaptic('light');
    setDepartments(DEFAULT_DEPARTMENTS);
    setStoreName('Esselunga Superstore');
    setNeighborhood('Milano (Il mio quartiere)');
  };

  const handleLoadCityPreset = () => {
    triggerHaptic('light');
    setStoreName('laESSE Esselunga');
    setNeighborhood('Negozio di Prossimità');
    const cityDepts: Department[] = [
      { id: 'panetteria', name: 'Forno & Caffè', aisleNumber: 1, iconName: 'Croissant', color: 'amber', description: 'Ingresso: Focacce e caffetteria', order: 1 },
      { id: 'ortofrutta', name: 'Frutta & Insalate pronte', aisleNumber: 2, iconName: 'Apple', color: 'emerald', description: 'Banconi freschi e bio', order: 2 },
      { id: 'gastronomia', name: 'Gastronomia & Formaggi', aisleNumber: 3, iconName: 'UtensilsCrossed', color: 'rose', description: 'Affettati e piatti pronti', order: 3 },
      { id: 'latticini_uova', name: 'Latte, Yogurt & Salumi', aisleNumber: 4, iconName: 'Egg', color: 'sky', description: 'Frigoriferi e uova', order: 4 },
      { id: 'macelleria_pescheria', name: 'Carni & Pesce', aisleNumber: 5, iconName: 'Fish', color: 'red', description: 'Confezioni take-away', order: 5 },
      { id: 'pasta_riso', name: 'Pasta, Riso & Sughi', aisleNumber: 6, iconName: 'Wheat', color: 'yellow', description: 'Spaghetti, olio e salse', order: 6 },
      { id: 'colazione_caffe', name: 'Colazione & Snack', aisleNumber: 7, iconName: 'Coffee', color: 'stone', description: 'Biscotti, caffè e dolci', order: 7 },
      { id: 'bevande_vini', name: 'Bevande & Enoteca', aisleNumber: 8, iconName: 'Wine', color: 'indigo', description: 'Bibite e vini selezionati', order: 8 },
      { id: 'casa_detersivi', name: 'Casa & Persona', aisleNumber: 9, iconName: 'Sparkles', color: 'teal', description: 'Detersivi e igiene', order: 9 },
    ];
    setDepartments(cityDepts);
  };

  const handleSaveAll = () => {
    triggerHaptic('success');
    onSave({
      storeName: storeName.trim() || 'Esselunga Superstore',
      neighborhood: neighborhood.trim() || 'Il mio quartiere',
      departments,
    });
    setSavedFeedback(true);
    setTimeout(() => {
      setSavedFeedback(false);
      onClose();
    }, 500);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-t-3xl sm:rounded-2xl max-w-xl w-full shadow-2xl border-t sm:border border-slate-200 overflow-hidden flex flex-col max-h-[85dvh] animate-in slide-in-from-bottom duration-200"
      >
        {/* Mobile Pull Handle */}
        <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto my-2.5 sm:hidden shrink-0" />

        {/* Header */}
        <div className="px-4 py-3 bg-[#0b1f38] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-sky-400 shrink-0" />
            <h3 className="text-sm sm:text-base font-bold tracking-tight">
              Personalizza Corsie Esselunga
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

        {/* Corpo Scrollabile */}
        <div className="p-3.5 sm:p-4 overflow-y-auto space-y-3.5 flex-1">
          {/* Quartiere */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-0.5">
                Il tuo quartiere / indirizzo
              </label>
              <input
                type="text"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="Es. Papiniano / Ripamonti / Bovisa"
                className="w-full px-3 py-2 text-base sm:text-xs font-medium bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] text-slate-500 font-medium">Preset:</span>
              <button
                type="button"
                onClick={handleResetToStandard}
                className="px-2.5 py-1 text-xs font-semibold bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-100 transition touch-manipulation"
              >
                Superstore
              </button>
              <button
                type="button"
                onClick={handleLoadCityPreset}
                className="px-2.5 py-1 text-xs font-semibold bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-100 transition touch-manipulation"
              >
                laESSE
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Ordina i reparti con le frecce dall'<strong>Ingresso</strong> alle <strong>Casse</strong>:
          </p>

          {/* Elenco Reparti */}
          <div className="space-y-1.5">
            {departments.map((dept, index) => (
              <div
                key={dept.id}
                className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition gap-2"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="w-6 h-6 rounded-md bg-[#0b1f38] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {index + 1}
                  </span>

                  <DepartmentIcon name={dept.iconName} className="w-3.5 h-3.5 text-slate-500 shrink-0" />

                  <input
                    type="text"
                    value={dept.name}
                    onChange={(e) => handleUpdateDeptName(dept.id, e.target.value)}
                    className="text-base sm:text-xs font-semibold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-200 focus:border-red-500 focus:outline-none w-full truncate py-0.5"
                  />
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-20 transition touch-manipulation active:scale-90"
                    title="Sposta prima"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => moveDown(index)}
                    disabled={index === departments.length - 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-20 transition touch-manipulation active:scale-90"
                    title="Sposta dopo"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteDept(dept.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition touch-manipulation active:scale-90"
                    title="Elimina"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Aggiungi reparto */}
          <form onSubmit={handleAddCustomDept} className="flex items-center gap-1.5 pt-1">
            <input
              type="text"
              value={newDeptName}
              onChange={(e) => setNewDeptName(e.target.value)}
              placeholder="Aggiungi reparto (es. Parafarmacia...)"
              className="flex-1 px-3 py-2 text-base sm:text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500"
            />
            <button
              type="submit"
              disabled={!newDeptName.trim()}
              className="h-10 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition shrink-0 touch-manipulation disabled:opacity-40"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Aggiungi</span>
            </button>
          </form>
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
            onClick={handleSaveAll}
            className="inline-flex items-center justify-center gap-1.5 px-5 h-10 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold rounded-xl transition shadow-xs touch-manipulation"
          >
            {savedFeedback ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Salvato!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Salva Disposizione</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
