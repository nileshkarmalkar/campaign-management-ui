export interface ColumnMetadata {
  name: string;
  type: 'numeric' | 'categorical' | 'boolean' | 'freetext';
  stats?: {
    uniqueValues?: Set<any>;
    min?: number;
    max?: number;
    distribution?: Record<string, number>;
  };
}

export interface FilterConfig {
  field: string;
  type: string;
  component: 'slider' | 'checkbox' | 'select' | 'switch' | 'input';
  options?: any[];
  range?: {
    min: number;
    max: number;
    buckets: { start: number; end: number; count: number }[];
  };
}

export interface FilterState {
  [key: string]: {
    type: string;
    value: any;
  };
}

export interface ChartData {
  numeric: {
    buckets: { start: number; end: number; count: number }[];
    min: number;
    max: number;
  };
  categorical: {
    values: { label: string; count: number }[];
    total: number;
  };
  boolean: {
    true: number;
    false: number;
    total: number;
  };
}
