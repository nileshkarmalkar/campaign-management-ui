import { ColumnMetadata, FilterConfig, ChartData } from './types';

const CATEGORICAL_THRESHOLD = 20; // Maximum unique values for categorical data
const NUMERIC_BUCKET_COUNT = 10; // Number of buckets for numeric data histogram

export const inferColumnType = (values: any[]): ColumnMetadata['type'] => {
  // Skip empty arrays
  if (!values.length) return 'freetext';

  // Check if all values are numbers
  const numericValues = values.filter(v => !isNaN(Number(v)) && v !== null && v !== '');
  if (numericValues.length === values.filter(v => v !== null && v !== '').length) {
    return 'numeric';
  }

  // Check if all values are boolean
  const booleanValues = values.filter(v => typeof v === 'boolean' || v === 'true' || v === 'false');
  if (booleanValues.length === values.filter(v => v !== null && v !== '').length) {
    return 'boolean';
  }

  // Count unique values for categorical check
  const uniqueValues = new Set(values.filter(v => v !== null && v !== ''));
  if (uniqueValues.size <= CATEGORICAL_THRESHOLD) {
    return 'categorical';
  }

  return 'freetext';
};

export const analyzeColumn = (name: string, values: any[]): ColumnMetadata => {
  const type = inferColumnType(values);
  const stats: ColumnMetadata['stats'] = {};

  switch (type) {
    case 'numeric': {
      const numbers = values
        .filter(v => !isNaN(Number(v)) && v !== null && v !== '')
        .map(Number);
      stats.min = Math.min(...numbers);
      stats.max = Math.max(...numbers);
      stats.distribution = generateNumericDistribution(numbers);
      break;
    }
    case 'categorical':
    case 'boolean': {
      stats.uniqueValues = new Set(values.filter(v => v !== null && v !== ''));
      stats.distribution = generateCategoricalDistribution(values);
      break;
    }
  }

  return { name, type, stats };
};

export const generateFilterConfig = (metadata: ColumnMetadata): FilterConfig => {
  const config: FilterConfig = {
    field: metadata.name,
    type: metadata.type,
    component: 'input'
  };

  switch (metadata.type) {
    case 'numeric':
      config.component = 'slider';
      if (metadata.stats?.min !== undefined && metadata.stats?.max !== undefined) {
        config.range = {
          min: metadata.stats.min,
          max: metadata.stats.max,
          buckets: generateNumericBuckets(
            metadata.stats.min,
            metadata.stats.max,
            metadata.stats.distribution || {}
          )
        };
      }
      break;

    case 'categorical':
      config.component = metadata.stats?.uniqueValues && metadata.stats.uniqueValues.size <= 5 
        ? 'checkbox' 
        : 'select';
      config.options = Array.from(metadata.stats?.uniqueValues || []);
      break;

    case 'boolean':
      config.component = 'switch';
      config.options = [true, false];
      break;
  }

  return config;
};

const generateNumericDistribution = (numbers: number[]): Record<string, number> => {
  const distribution: Record<string, number> = {};
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  const range = max - min;
  const bucketSize = range / NUMERIC_BUCKET_COUNT;

  numbers.forEach(num => {
    const bucketIndex = Math.floor((num - min) / bucketSize);
    const bucketStart = min + bucketIndex * bucketSize;
    const bucketKey = `${bucketStart.toFixed(2)}-${(bucketStart + bucketSize).toFixed(2)}`;
    distribution[bucketKey] = (distribution[bucketKey] || 0) + 1;
  });

  return distribution;
};

const generateCategoricalDistribution = (values: any[]): Record<string, number> => {
  return values.reduce((acc, value) => {
    if (value !== null && value !== '') {
      acc[String(value)] = (acc[String(value)] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
};

const generateNumericBuckets = (
  min: number,
  max: number,
  distribution: Record<string, number>
): { start: number; end: number; count: number }[] => {
  return Object.entries(distribution).map(([range, count]) => {
    const [start, end] = range.split('-').map(Number);
    return { start, end, count };
  });
};

export const generateChartData = (metadata: ColumnMetadata): ChartData[keyof ChartData] => {
  switch (metadata.type) {
    case 'numeric':
      if (!metadata.stats?.distribution) return { buckets: [], min: 0, max: 0 };
      return {
        buckets: generateNumericBuckets(
          metadata.stats.min!,
          metadata.stats.max!,
          metadata.stats.distribution
        ),
        min: metadata.stats.min!,
        max: metadata.stats.max!
      };

    case 'categorical':
      if (!metadata.stats?.distribution) return { values: [], total: 0 };
      const total = Object.values(metadata.stats.distribution).reduce((sum, count) => sum + count, 0);
      return {
        values: Object.entries(metadata.stats.distribution).map(([label, count]) => ({
          label,
          count
        })),
        total
      };

    case 'boolean':
      if (!metadata.stats?.distribution) return { true: 0, false: 0, total: 0 };
      const { true: trueCount = 0, false: falseCount = 0 } = metadata.stats.distribution;
      return {
        true: trueCount,
        false: falseCount,
        total: trueCount + falseCount
      };

    default:
      return { values: [], total: 0 };
  }
};
