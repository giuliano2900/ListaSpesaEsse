import { Department } from '../types';

export const DEFAULT_DEPARTMENTS: Department[] = [
  {
    id: 'ortofrutta',
    name: 'Frutta & Verdura',
    aisleNumber: 1,
    iconName: 'Apple',
    color: 'emerald',
    description: 'Ingresso: Banconi frutta di stagione, verdure sfuse, insalate lavate e bio',
    order: 1,
  },
  {
    id: 'panetteria',
    name: 'Panetteria & Forno',
    aisleNumber: 2,
    iconName: 'Croissant',
    color: 'amber',
    description: 'Focaccia Esselunga, pane fresco, baguette, pizze e brioche',
    order: 2,
  },
  {
    id: 'gastronomia',
    name: 'Gastronomia & Salumi',
    aisleNumber: 3,
    iconName: 'UtensilsCrossed',
    color: 'rose',
    description: 'Banco taglio: Prosciutti, salumi, formaggi tipici e piatti pronti',
    order: 3,
  },
  {
    id: 'macelleria_pescheria',
    name: 'Macelleria & Pescheria',
    aisleNumber: 4,
    iconName: 'Fish',
    color: 'red',
    description: 'Carni bovine, pollame, hamburger, pesce fresco e crostacei',
    order: 4,
  },
  {
    id: 'latticini_uova',
    name: 'Latticini, Uova & Pasta Fresca',
    aisleNumber: 5,
    iconName: 'Egg',
    color: 'sky',
    description: 'Latte fresco, burro, yogurt, mozzarelle, uova e tortellini',
    order: 5,
  },
  {
    id: 'pasta_riso',
    name: 'Pasta, Riso & Farine',
    aisleNumber: 6,
    iconName: 'Wheat',
    color: 'yellow',
    description: 'Spaghetti, pasta corta, riso carnaroli, farina 00, polenta',
    order: 6,
  },
  {
    id: 'olio_conserve',
    name: 'Olio, Sughi & Conserve',
    aisleNumber: 7,
    iconName: 'Soup',
    color: 'orange',
    description: 'Olio extravergine, passata pomodoro, tonno in scatola, legumi',
    order: 7,
  },
  {
    id: 'colazione_caffe',
    name: 'Colazione, Biscotti & Caffè',
    aisleNumber: 8,
    iconName: 'Coffee',
    color: 'stone',
    description: 'Biscotti, fette biscottate, marmellate, cereali, caffè e tè',
    order: 8,
  },
  {
    id: 'snack_dolci',
    name: 'Snack, Cioccolato & Dolci',
    aisleNumber: 9,
    iconName: 'Cookie',
    color: 'pink',
    description: 'Patatine, cracker, tavolette fondente, snack e caramelle',
    order: 9,
  },
  {
    id: 'bevande_vini',
    name: 'Acqua, Bibite & Enoteca',
    aisleNumber: 10,
    iconName: 'Wine',
    color: 'indigo',
    description: 'Acqua minerale, birre, succhi, vini rossi e bianchi, prosecco',
    order: 10,
  },
  {
    id: 'surgelati',
    name: 'Surgelati & Gelati',
    aisleNumber: 11,
    iconName: 'Snowflake',
    color: 'cyan',
    description: 'Verdure surgelate, pesce surgelato, pizze e vaschette gelato',
    order: 11,
  },
  {
    id: 'casa_detersivi',
    name: 'Cura della Casa & Detersivi',
    aisleNumber: 12,
    iconName: 'Sparkles',
    color: 'teal',
    description: 'Detersivo lavatrice, lavastoviglie, candeggina, carta igienica, spugne',
    order: 12,
  },
  {
    id: 'igiene_persona',
    name: 'Igiene Personale & Cura Corpo',
    aisleNumber: 13,
    iconName: 'HeartHandshake',
    color: 'purple',
    description: 'Bagnoschiuma, shampoo, dentifricio, sapone, deodorante, rasoi',
    order: 13,
  },
  {
    id: 'animali',
    name: 'Cibo & Cura Animali',
    aisleNumber: 14,
    iconName: 'PawPrint',
    color: 'lime',
    description: 'Croccantini cane e gatto, bustine umido, lettiera',
    order: 14,
  },
];

export const INITIAL_STORE_CONFIG = {
  storeName: 'Esselunga Superstore',
  neighborhood: 'Milano (Il mio quartiere)',
  departments: DEFAULT_DEPARTMENTS,
};

// Catalogo intelligente con parole chiave italiane per l'auto-categorizzazione istantanea
export const PRODUCT_KEYWORD_MAP: Record<string, string[]> = {
  ortofrutta: [
    'mela', 'mele', 'banana', 'banane', 'arancia', 'arance', 'mandarino', 'mandarini', 'clementina', 'clementine',
    'limone', 'limoni', 'pera', 'pere', 'uva', 'fragola', 'fragole', 'pesca', 'pesche', 'albicocca', 'albicocche',
    'ciliegia', 'ciliegie', 'anguria', 'melone', 'kiwi', 'ananas', 'avocado', 'mango', 'mirtilli', 'lamponi',
    'pomodoro', 'pomodori', 'pomodorini', 'datterini', 'ciliegino', 'insalata', 'lattuga', 'valeriana', 'rucola',
    'spinaci', 'carota', 'carote', 'patata', 'patate', 'cipolla', 'cipolle', 'scalogno', 'aglio', 'zucchina',
    'zucchine', 'melanzana', 'melanzane', 'peperone', 'peperoni', 'finocchio', 'finocchi', 'sedano', 'cetriolo',
    'cetrioli', 'cavolo', 'cavolfiore', 'broccoli', 'broccolo', 'zucca', 'funghi', 'champignon', 'porcini',
    'basilico', 'prezzemolo', 'rosmarino', 'salvia', 'zenzero'
  ],
  panetteria: [
    'pane', 'focaccia', 'focaccina', 'panino', 'panini', 'baguette', 'ciabatta', 'filone', 'pan bauletto',
    'rosetta', 'michetta', 'treccia', 'brioche', 'cornetto', 'croissant', 'krapfen', 'torta', 'crostata',
    'pasticcini', 'elisenda', 'piadina', 'piadine', 'pinsa', 'pizza al trancio', 'grissini'
  ],
  gastronomia: [
    'prosciutto', 'crudo', 'parma', 'san daniele', 'cotto', 'salame', 'milano', 'ungherese', 'mortadella',
    'speck', 'bresaola', 'coppa', 'pancetta', 'lardo', 'parmigiano', 'reggiano', 'grana padano', 'pecorino',
    'gorgonzola', 'taleggio', 'fontina', 'asiago', 'provolone', 'scamorza', 'caciotta', 'brie', 'camembert',
    'insalata russa', 'gastronomia', 'piatto pronto', 'arancini', 'polpette cotte'
  ],
  macelleria_pescheria: [
    'pollo', 'petto di pollo', 'cosce di pollo', 'ali di pollo', 'tacchino', 'manzo', 'vitello', 'maiale',
    'lonza', 'costine', 'macinato', 'trita', 'carne trita', 'salsiccia', 'salsicce', 'bistecca', 'fiorentina',
    'hamburger', 'svizzera', 'carpaccio', 'fegato', 'arista', 'agnello', 'pesce', 'salmone', 'orata',
    'spigola', 'branzino', 'merluzzo', 'nasello', 'tonno fresco', 'pesce spada', 'gamberi', 'gamberetti',
    'calamari', 'seppie', 'polpo', 'cozze', 'vongole', 'trota', 'sogliola'
  ],
  latticini_uova: [
    'latte', 'latte fresco', 'latte uht', 'latte intero', 'latte parzialmente scremato', 'latte scremato',
    'uova', 'uovo', 'burro', 'yogurt', 'kefir', 'panna', 'panna fresca', 'panna da cucina', 'ricotta',
    'mozzarella', 'fiordilatte', 'bufala', 'mascarpone', 'stracchino', 'crescenza', 'robiola', 'philadelphia',
    'formaggini', 'pasta fresca', 'sfoglia', 'tortellini', 'ravioli', 'cappelletti', 'gnocchi', 'pasta ripiena'
  ],
  pasta_riso: [
    'pasta', 'spaghetti', 'penne', 'rigatoni', 'fusilli', 'farfalle', 'bucatini', 'tagliatelle', 'linguine',
    'orecchiette', 'ditali', 'riso', 'carnaroli', 'arborio', 'basmati', 'jasmine', 'integrale', 'farina',
    'farina 00', 'farina manitoba', 'semola', 'couscous', 'quinoa', 'polenta', 'lievito per dolci',
    'lievito di birra', 'pangrattato'
  ],
  olio_conserve: [
    'olio', 'olio extravergine', 'olio evo', 'olio di oliva', 'olio di semi', 'olio di girasole', 'aceto',
    'aceto di mele', 'aceto balsamico', 'passata', 'pelati', 'polpa', 'pomodori pelati', 'pesto', 'pesto genovese',
    'sugo', 'ragù', 'tonno in scatola', 'tonno', 'sgombro', 'salmone in scatola', 'sardine', 'alici', 'acciughe',
    'fagioli', 'borlotti', 'cannellini', 'ceci', 'lenticchie', 'piselli in scatola', 'olive', 'olive taggiasche',
    'sottaceti', 'carciofini', 'maionese', 'ketchup', 'senape', 'sale', 'sale grosso', 'sale fino', 'pepe',
    'origano', 'peperoncino'
  ],
  colazione_caffe: [
    'caffè', 'caffe', 'capsule', 'cialde', 'lavazza', 'illy', 'nespresso', 'moka', 'decaffeinato', 'tè', 'te',
    'camomilla', 'tisana', 'infuso', 'biscotti', 'gocciole', 'pan di stelle', 'tarallucci', 'macine',
    'fette biscottate', 'cereali', 'corn flakes', 'muesli', 'avena', 'marmellata', 'confettura', 'miele',
    'nutella', 'crema nocciole', 'cacao', 'orzo solubile', 'nesquik'
  ],
  snack_dolci: [
    'patatine', 'chips', 'snack', 'arachidi', 'pistacchi', 'anacardi', 'pop corn', 'taralli', 'cracker',
    'crackers', 'crostini', 'cioccolato', 'cioccolata', 'tavoletta', 'fondente', 'cioccolato al latte',
    'caramelle', 'chewing gum', 'gomme', 'barretta', 'barrette', 'wafer'
  ],
  bevande_vini: [
    'acqua', 'acqua minerale', 'acqua naturale', 'acqua frizzante', 'san benedetto', 'levissima', 'sant\'anna',
    'ferrarelle', 'coca cola', 'pepsi', 'fanta', 'sprite', 'aranciata', 'chinotto', 'estathè', 'succo',
    'succo di frutta', 'succo arancia', 'succo mela', 'succo pera', 'birra', 'moretti', 'peroni', 'heineken',
    'ichnusa', 'vino', 'vino rosso', 'vino bianco', 'chianti', 'barolo', 'prosecco', 'spumante', 'franciacorta',
    'champagne', 'amaro', 'limoncello', 'grappa', 'gin', 'rum', 'aperol', 'campari'
  ],
  surgelati: [
    'surgelati', 'surgelato', 'gelato', 'gelati', 'cornetto algida', 'vaschetta gelato', 'ghiaccioli',
    'pizza surgelata', 'piselli surgelati', 'spinaci surgelati', 'minestrone surgelato', 'bastoncini',
    'bastoncini findus', 'sofficini', 'patatine fritte surgelate', 'pesce surgelato', 'gamberi surgelati'
  ],
  casa_detersivi: [
    'detersivo', 'detersivo lavatrice', 'caps lavatrice', 'dash', 'dixan', 'ammorbidente', 'candeggina',
    'sgrassatore', 'chanteclair', 'detersivo piatti', 'fairy', 'finish', 'pastiglie lavastoviglie', 'brillantante',
    'sale lavastoviglie', 'spugna', 'spugne', 'carta igienica', 'scottex', 'rototrap', 'fazzoletti',
    'sacchetti', 'sacchetti spazzatura', 'alluminio', 'carta forno', 'pellicola', 'candela', 'anticalcare'
  ],
  igiene_persona: [
    'bagnoschiuma', 'docciaschiuma', 'sapone', 'sapone liquido', 'shampoo', 'balsamo', 'maschera capelli',
    'dentifricio', 'spazzolino', 'collutorio', 'deodorante', 'crema corpo', 'crema viso', 'rasoio', 'lamette',
    'schiuma da barba', 'assorbenti', 'salvaslip', 'cotton fioc', 'dischetti struccanti', 'cerotti'
  ],
  animali: [
    'croccantini', 'cibo cane', 'cibo gatto', 'crocchette', 'bustine gatto', 'umido gatto', 'umido cane',
    'lettiera', 'snack cane', 'snack gatto', 'osso cane', 'purina', 'whiskas', 'sheba', 'monge'
  ]
};

export const COMMON_FREQUENT_ITEMS = [
  { name: 'Mele Fuji', quantity: 1, unit: 'kg' as const, departmentId: 'ortofrutta' },
  { name: 'Focaccia classica', quantity: 1, unit: 'pz' as const, departmentId: 'panetteria' },
  { name: 'Latte Fresco Intero', quantity: 1, unit: 'l' as const, departmentId: 'latticini_uova' },
  { name: 'Uova Fresche Grandi', quantity: 6, unit: 'pz' as const, departmentId: 'latticini_uova' },
  { name: 'Petto di Pollo a fette', quantity: 500, unit: 'g' as const, departmentId: 'macelleria_pescheria' },
  { name: 'Pasta Barilla Spaghetti n.5', quantity: 1, unit: 'conf' as const, departmentId: 'pasta_riso' },
  { name: 'Passata di Pomodoro Mutti', quantity: 2, unit: 'bottiglie' as const, departmentId: 'olio_conserve' },
  { name: 'Olio Extra Vergine di Oliva', quantity: 1, unit: 'bottiglie' as const, departmentId: 'olio_conserve' },
  { name: 'Biscotti Gocciole', quantity: 1, unit: 'conf' as const, departmentId: 'colazione_caffe' },
  { name: 'Caffè Lavazza Qualità Rossa', quantity: 2, unit: 'conf' as const, departmentId: 'colazione_caffe' },
  { name: 'Acqua Naturale Sant\'Anna', quantity: 6, unit: 'bottiglie' as const, departmentId: 'bevande_vini' },
  { name: 'Carta Igienica Scottex', quantity: 1, unit: 'conf' as const, departmentId: 'casa_detersivi' },
  { name: 'Detersivo Lavatrice Chanteclair', quantity: 1, unit: 'bottiglie' as const, departmentId: 'casa_detersivi' },
  { name: 'Dentifricio Colgate', quantity: 1, unit: 'pz' as const, departmentId: 'igiene_persona' },
  { name: 'Piselli Finissimi Surgelati', quantity: 1, unit: 'conf' as const, departmentId: 'surgelati' },
];
