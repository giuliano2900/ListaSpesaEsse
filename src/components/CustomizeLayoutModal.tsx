import React, { useState, useEffect } from 'react';
import { Department, StoreLayout } from '../types';
import { DEFAULT_DEPARTMENTS } from '../data/defaultDepartments';
import { DepartmentIcon } from './DepartmentIcon';
import {
  X,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Save,
  Plus,
  Trash2,
  MapPin,
  Sparkles,
  Check,
  Store,
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

  // Sposta reparto verso l'alto (prima nel percorso del supermercato)
  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...departments];
    const temp = next[index - 1];
    next[index - 1] = next[index];
    next[index] = temp;

    // Ricalcola numeri ordine e corsia
    const reindexed = next.map((d, idx) => ({
      ...d,
      order: idx + 1,
      aisleNumber: idx + 1,
    }));
    setDepartments(reindexed);
  };

  // Sposta reparto verso il basso (dopo nel percorso)
  const moveDown = (index: number) => {
    if (index === departments.length - 1) return;
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

  // Aggiorna nome o numero corsia
  const handleUpdateDeptName = (id: string, name: string) => {
    setDepartments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, name } : d))
    );
  };

  const handleUpdateAisleNum = (id: string, num: number) => {
    setDepartments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, aisleNumber: num } : d))
    );
  };

  const handleDeleteDept = (id: string) => {
    if (departments.length <= 3) {
      alert('Devono rimanere almeno 3 reparti.');
      return;
    }
    const filtered = departments
      .filter((d) => d.id !== id)
      .map((d, idx) => ({ ...d, order: idx + 1 }));
    setDepartments(filtered);
  };

  const handleAddCustomDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName.trim()) return;

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

  // Carica preset classico
  const handleResetToStandard = () => {
    setDepartments(DEFAULT_DEPARTMENTS);
    setStoreName('Esselunga Superstore');
    setNeighborhood('Milano (Il mio quartiere)');
  };

  // Carica preset "LaEsse / Esselunga Urbana"
  const handleLoadCityPreset = () => {
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
    onSave({
      storeName: storeName.trim() || 'Esselunga Superstore',
      neighborhood: neighborhood.trim() || 'Il mio quartiere',
      departments,
    });
    setSavedFeedback(true);
    setTimeout(() => {
      setSavedFeedback(false);
      onClose();
    }, 600);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-t-3xl sm:rounded-3xl max-w-2xl w-full shadow-2xl border-t sm:border border-slate-200 overflow-hidden flex flex-col max-h-[92dvh] animate-in slide-in-from-bottom duration-200"
      >
        {/* Mobile Pull Indicator */}
        <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto my-2.5 sm:hidden shrink-0" />

        {/* Header Modale */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#0b1f38] to-[#16365c] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">
                Disposizione Esselunga del tuo Quartiere
              </h3>
              <p className="text-xs text-slate-300 line-clamp-1">
                Ordina le corsie per rispecchiare fedelmente il tuo supermercato locale
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

        {/* Corpo Modale Scrollabile */}
        <div className="p-3.5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 flex-1">
          {/* Informazioni Negozio & Quartiere */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Nome Supermercato
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Es. Esselunga Superstore"
                className="w-full px-3.5 py-2.5 min-h-[44px] text-base sm:text-xs font-medium bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Quartiere / Indirizzo locale
              </label>
              <input
                type="text"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="Es. Viale Papiniano / Ripamonti / Bovisa"
                className="w-full px-3.5 py-2.5 min-h-[44px] text-base sm:text-xs font-medium bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Preset Rapidi */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-semibold text-slate-600">Preset configurazione:</span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleResetToStandard}
                className="px-3 py-2 min-h-[38px] text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl border border-slate-200 transition touch-manipulation"
              >
                Superstore Standard
              </button>
              <button
                type="button"
                onClick={handleLoadCityPreset}
                className="px-3 py-2 min-h-[38px] text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl border border-slate-200 transition touch-manipulation"
              >
                laESSE di Quartiere
              </button>
            </div>
          </div>

          {/* Istruzione riordino */}
          <div className="text-xs text-slate-600 bg-amber-50 p-3 rounded-2xl border border-amber-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Usa le <strong>frecce</strong> per spostare i reparti nell'ordine in cui li incontri entrando dal tuo Esselunga (dall'ingresso alle casse).
            </span>
          </div>

          {/* Lista Sequenziale Reparti */}
          <div className="space-y-2">
            {departments.map((dept, index) => (
              <div
                key={dept.id}
                className="flex items-center justify-between p-2.5 sm:p-3 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 transition shadow-xs gap-2"
              >
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-[#0b1f38] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {index + 1}
                  </div>

                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <DepartmentIcon name={dept.iconName} className="w-4 h-4 text-slate-500 shrink-0" />
                    <input
                      type="text"
                      value={dept.name}
                      onChange={(e) => handleUpdateDeptName(dept.id, e.target.value)}
                      className="text-base sm:text-xs font-semibold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-red-500 focus:outline-none w-full truncate py-1"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 mr-1 sm:mr-2">
                    <span className="hidden sm:inline">Corsia:</span>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={dept.aisleNumber}
                      onChange={(e) => handleUpdateAisleNum(dept.id, parseInt(e.target.value) || 1)}
                      className="w-10 text-center font-bold text-slate-800 bg-slate-100 rounded-lg px-1 py-1.5 min-h-[36px] border border-slate-200 text-xs"
                      title="Numero corsia"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 disabled:opacity-20 disabled:cursor-not-allowed transition touch-manipulation"
                    title="Sposta prima nel percorso"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => moveDown(index)}
                    disabled={index === departments.length - 1}
                    className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 disabled:opacity-20 disabled:cursor-not-allowed transition touch-manipulation"
                    title="Sposta dopo nel percorso"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteDept(dept.id)}
                    className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 active:bg-red-100 transition touch-manipulation ml-0.5"
                    title="Rimuovi reparto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Aggiungi Reparto Personalizzato */}
          <form onSubmit={handleAddCustomDept} className="pt-2 flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              value={newDeptName}
              onChange={(e) => setNewDeptName(e.target.value)}
              placeholder="Aggiungi reparto (es. Piante & Fiori, Parafarmacia...)"
              className="w-full flex-1 px-3.5 py-2.5 min-h-[44px] text-base sm:text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              type="submit"
              disabled={!newDeptName.trim()}
              className="w-full sm:w-auto px-4 py-2.5 min-h-[44px] text-xs font-semibold bg-slate-800 hover:bg-slate-700 active:bg-slate-900 disabled:opacity-40 text-white rounded-xl flex items-center justify-center gap-1.5 transition shrink-0 touch-manipulation"
            >
              <Plus className="w-4 h-4" />
              <span>Aggiungi Corsia</span>
            </button>
          </form>
        </div>

        {/* Footer Modale con Salva */}
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
            onClick={handleSaveAll}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 min-h-[44px] bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold rounded-xl transition shadow-xs touch-manipulation order-1 sm:order-2"
          >
            {savedFeedback ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Configurazione Salvata!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Salva Disposizione Negozio</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
