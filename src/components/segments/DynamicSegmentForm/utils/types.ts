export type FilterOperator = 'AND' | 'OR';
export type ComparisonOperator = '=' | '!=' | '>' | '>=' | '<' | '<=' | 'between' | 'contains' | 'not_contains' | 'in' | 'not_in';

export interface ColumnMetadata {
  name: string;
  type: 'numeric' | 'categorical' | 'boolean' | 'freetext' | 'date';
  stats?: {
    uniqueValues?: Set<any>;
    min?: number | string;
    max?: number | string;
    distribution?: Record<string, number>;
  };
}

export interface FilterConfig {
  field: string;
  type: string;
  component: 'slider' | 'checkbox' | 'select' | 'switch' | 'input' | 'date-range' | 'multi-select';
  options?: any[];
  range?: {
    min: number;
    max: number;
    buckets: { start: number; end: number; count: number }[];
  } | {
    min: string;
    max: string;
    buckets: { start: string; end: string; count: number }[];
  };
  dateFormat?: string;
  operator?: ComparisonOperator;
}

export interface FilterCondition {
  field: string;
  type: string;
  operator: ComparisonOperator;
  value: any;
}

export interface FilterGroup {
  operator: FilterOperator;
  conditions: (FilterCondition | FilterGroup)[];
}

export interface FilterState {
  root: FilterGroup;
  activeFilters: {
    [key: string]: {
      type: string;
      value: any;
      operator: ComparisonOperator;
    };
  };
}

export type NumericRangeBucket = { start: number; end: number; count: number };
export type DateRangeBucket = { start: string; end: string; count: number };

export interface ChartData {
  numeric: {
    buckets: NumericRangeBucket[];
    min: number;
    max: number;
  };
  date: {
    buckets: DateRangeBucket[];
    min: string;
    max: string;
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
