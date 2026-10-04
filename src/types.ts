export interface Department {
  id: string;
  name: string;
  aisleNumber: number; // Numero corsia / scaffale
  iconName: string;
  color: string; // Tailwind color accent
  description: string;
  order: number; // Posizione nel percorso del negozio
}

export type UnitType = 'pz' | 'kg' | 'g' | 'l' | 'ml' | 'conf' | 'bottiglie' | 'etti' | 'buste';

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: UnitType;
  departmentId: string;
  notes?: string;
  completed: boolean;
  createdAt: number;
}

export interface StoreLayout {
  storeName: string;
  neighborhood: string;
  departments: Department[];
}
