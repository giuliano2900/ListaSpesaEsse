import { PRODUCT_KEYWORD_MAP } from '../data/defaultDepartments';
import { UnitType } from '../types';

/**
 * Riconosce automaticamente il reparto Esselunga a partire dal nome dell'articolo.
 */
export function detectDepartment(itemName: string, fallbackId = 'pasta_riso'): string {
  if (!itemName || !itemName.trim()) return fallbackId;

  const normalized = itemName.toLowerCase().trim();

  // 1. Controlla corrispondenze dirette o incluse
  for (const [deptId, keywords] of Object.entries(PRODUCT_KEYWORD_MAP)) {
    for (const keyword of keywords) {
      // Controllo esatto o se la parola chiave è contenuta nel nome dell'articolo
      const regex = new RegExp(`\\b${escapeRegExp(keyword)}\\b`, 'i');
      if (regex.test(normalized) || normalized.includes(keyword)) {
        return deptId;
      }
    }
  }

  // 2. Se non trova nulla, controlla euristiche generiche
  if (/frutta|verdura|insalata|bio/i.test(normalized)) return 'ortofrutta';
  if (/pane|dolce|torta|brioche|forno/i.test(normalized)) return 'panetteria';
  if (/carne|pesce|pollo|bistecca/i.test(normalized)) return 'macelleria_pescheria';
  if (/formaggio|salume|prosciutto|grana/i.test(normalized)) return 'gastronomia';
  if (/latte|uova|yogurt|burro/i.test(normalized)) return 'latticini_uova';
  if (/pasta|riso|farina/i.test(normalized)) return 'pasta_riso';
  if (/olio|aceto|sugo|scatola|tonno/i.test(normalized)) return 'olio_conserve';
  if (/caffè|caffe|tè|biscott|colazione/i.test(normalized)) return 'colazione_caffe';
  if (/snack|patatin|cioccolat/i.test(normalized)) return 'snack_dolci';
  if (/acqua|vino|birra|succo|bibita/i.test(normalized)) return 'bevande_vini';
  if (/surgelat|gelat/i.test(normalized)) return 'surgelati';
  if (/detersiv|pulizia|casa|lavatrice/i.test(normalized)) return 'casa_detersivi';
  if (/shampoo|sapone|dentifricio|doccia|bagno/i.test(normalized)) return 'igiene_persona';
  if (/gatto|cane|animali|croccant/i.test(normalized)) return 'animali';

  return fallbackId;
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Estrae quantità, unità di misura e nome pulito da una stringa libera.
 * Es: "2 kg di mele", "3 confezioni pasta", "500g petto di pollo", "latte 1l", "4 uova"
 */
export function parseItemText(rawText: string): {
  name: string;
  quantity: number;
  unit: UnitType;
} {
  const clean = rawText.trim();
  if (!clean) {
    return { name: '', quantity: 1, unit: 'pz' };
  }

  // Pattern comune: inizio con numero + unita (es. "2 kg mele", "500 g pane", "3 pz sapone", "2 confezioni pasta")
  const leadingPattern = /^(\d+(?:[.,]\d+)?)\s*(kg|chili|chilogrammi|g|grammi|etti|etto|l|litri|litro|ml|conf|confezione|confezioni|pacchi|pacco|scatole|scatola|bottiglie|bottiglia|pz|pezzi|buste|busta)?\s*(?:di\s+)?(.*)$/i;
  const leadMatch = clean.match(leadingPattern);

  if (leadMatch && leadMatch[3]) {
    const rawQty = parseFloat(leadMatch[1].replace(',', '.'));
    const rawUnitStr = leadMatch[2] ? leadMatch[2].toLowerCase() : '';
    const name = leadMatch[3].trim();

    return {
      name: capitalizeFirst(name),
      quantity: isNaN(rawQty) || rawQty <= 0 ? 1 : rawQty,
      unit: normalizeUnit(rawUnitStr),
    };
  }

  // Pattern fine con numero + unita (es. "mele 2 kg", "latte 1 l", "uova 6 pz", "pasta 2 conf")
  const trailingPattern = /^(.*?)\s+(\d+(?:[.,]\d+)?)\s*(kg|chili|g|grammi|etti|l|litri|ml|conf|confezioni|pacchi|bottiglie|pz|pezzi|buste)?$/i;
  const trailMatch = clean.match(trailingPattern);

  if (trailMatch && trailMatch[1] && trailMatch[2]) {
    const name = trailMatch[1].trim();
    const rawQty = parseFloat(trailMatch[2].replace(',', '.'));
    const rawUnitStr = trailMatch[3] ? trailMatch[3].toLowerCase() : '';

    return {
      name: capitalizeFirst(name),
      quantity: isNaN(rawQty) || rawQty <= 0 ? 1 : rawQty,
      unit: normalizeUnit(rawUnitStr),
    };
  }

  return {
    name: capitalizeFirst(clean),
    quantity: 1,
    unit: 'pz',
  };
}

function normalizeUnit(unitStr: string): UnitType {
  if (!unitStr) return 'pz';
  if (['kg', 'chili', 'chilogrammi'].includes(unitStr)) return 'kg';
  if (['g', 'grammi'].includes(unitStr)) return 'g';
  if (['etti', 'etto'].includes(unitStr)) return 'etti';
  if (['l', 'litri', 'litro'].includes(unitStr)) return 'l';
  if (['ml'].includes(unitStr)) return 'ml';
  if (['conf', 'confezione', 'confezioni', 'pacco', 'pacchi', 'scatola', 'scatole'].includes(unitStr)) return 'conf';
  if (['bottiglie', 'bottiglia'].includes(unitStr)) return 'bottiglie';
  if (['buste', 'busta'].includes(unitStr)) return 'buste';
  return 'pz';
}

function capitalizeFirst(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
