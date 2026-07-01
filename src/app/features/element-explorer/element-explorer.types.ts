export type ElementCategory =
  | 'alkali-metal'
  | 'alkaline-earth-metal'
  | 'transition-metal'
  | 'post-transition-metal'
  | 'metalloid'
  | 'nonmetal'
  | 'halogen'
  | 'noble-gas'
  | 'lanthanide'
  | 'actinide';

export type ElementState = 'solid' | 'liquid' | 'gas' | 'unknown';
export type ElementBlock = 's' | 'p' | 'd' | 'f';

export interface ChemElement {
  readonly number: number;
  readonly symbol: string;
  readonly name: string;
  readonly atomicMass: string;
  readonly category: ElementCategory;
  readonly block: ElementBlock;
  readonly state: ElementState;
  readonly period: number;
  readonly group: number | null;    // null for Ce-Lu and Th-Lr (f-block annex rows)
  readonly fRow: number | null;     // 9 = lanthanide annex, 10 = actinide annex
  readonly fCol: number | null;     // column 4–17 within the annex row
  readonly electronegativity: number | null;
  readonly radioactive: boolean;
}

export type LayoutStyle  = 'classic' | 'compact' | 'wide' | 'alpha';
export type ColorScheme  = 'category' | 'state' | 'block' | 'period' | 'mono';
export type DetailLevel  = 'symbol' | 'standard' | 'full';
export type FilterMode   = 'all' | 'metals' | 'nonmetals' | 'noble' | 'radioactive';
export type ViewMode     = 'grid' | 'data';

export interface TableConfig {
  layout:      LayoutStyle | null;
  colorScheme: ColorScheme | null;
  detailLevel: DetailLevel | null;
  filter:      FilterMode  | null;
}

export interface LayoutOption {
  readonly id:          LayoutStyle;
  readonly name:        string;
  readonly description: string;
  readonly icon:        string;
}

export interface ColorOption {
  readonly id:          ColorScheme;
  readonly name:        string;
  readonly description: string;
  readonly icon:        string;
  readonly swatches:    readonly string[];
}

export interface DetailOption {
  readonly id:          DetailLevel;
  readonly name:        string;
  readonly description: string;
  readonly lines:       readonly string[];
}

export interface FilterOption {
  readonly id:          FilterMode;
  readonly name:        string;
  readonly description: string;
  readonly icon:        string;
  readonly count:       number;
}

export type { WizardStep } from '../../models/models.js';
