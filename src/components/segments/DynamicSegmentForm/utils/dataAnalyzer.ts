import { ColumnMetadata, FilterConfig, ChartData, ComparisonOperator } from './types';
import dayjs from 'dayjs';

const CATEGORICAL_THRESHOLD = 20; // Maximum unique values for categorical data
const NUMERIC_BUCKET_COUNT = 10; // Number of buckets for numeric data histogram

export const inferColumnType = (values: any[]): ColumnMetadata['type'] => {
  // Skip empty arrays
  if (!values.length) return 'freetext';

  const nonEmptyValues = values.filter(v => v !== null && v !== '');
  if (!nonEmptyValues.length) return 'freetext';

  // Check if all values are dates
  const dateValues = nonEmptyValues.filter(v => dayjs(v, 'YYYY-MM-DD', true).isValid());
  if (dateValues.length === nonEmptyValues.length) {
    return 'date';
  }

  // Check if all values are numbers
  const numericValues = nonEmptyValues.filter(v => !isNaN(Number(v)));
  if (numericValues.length === nonEmptyValues.length) {
    return 'numeric';
  }

  // Check if all values are boolean
  const booleanValues = nonEmptyValues.filter(v => typeof v === 'boolean' || v === 'true' || v === 'false');
  if (booleanValues.length === nonEmptyValues.length) {
    return 'boolean';
  }

  // Count unique values for categorical check
  const uniqueValues = new Set(nonEmptyValues);
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
    case 'date': {
      const validDates = values
        .filter(v => dayjs(v, 'YYYY-MM-DD', true).isValid())
        .map(v => dayjs(v));
      const minDate = validDates.reduce((min, curr) => (curr.isBefore(min) ? curr : min), validDates[0]);
      const maxDate = validDates.reduce((max, curr) => (curr.isAfter(max) ? curr : max), validDates[0]);
      stats.min = minDate.format('YYYY-MM-DD');
      stats.max = maxDate.format('YYYY-MM-DD');
      stats.distribution = generateDateDistribution(validDates, minDate, maxDate);
      break;
    }
  }

  return { name, type, stats };
};

const generateDateDistribution = (dates: dayjs.Dayjs[], minDate: dayjs.Dayjs, maxDate: dayjs.Dayjs): Record<string, number> => {
  const distribution: Record<string, number> = {};
  const range = maxDate.diff(minDate, 'day');
  const bucketSize = Math.max(1, Math.ceil(range / NUMERIC_BUCKET_COUNT));

  dates.forEach(date => {
    const bucketIndex = Math.floor(date.diff(minDate, 'day') / bucketSize);
    const bucketStart = minDate.add(bucketIndex * bucketSize, 'day');
    const bucketKey = `${bucketStart.format('YYYY-MM-DD')}-${bucketStart.add(bucketSize, 'day').format('YYYY-MM-DD')}`;
    distribution[bucketKey] = (distribution[bucketKey] || 0) + 1;
  });

  return distribution;
};

export const generateFilterConfig = (metadata: ColumnMetadata): FilterConfig => {
  const config: FilterConfig = {
    field: metadata.name,
    type: metadata.type,
    component: 'input',
    operator: '='
  };

  switch (metadata.type) {
    case 'numeric':
      config.component = 'slider';
      config.operator = 'between';
      if (metadata.stats?.min !== undefined && metadata.stats?.max !== undefined) {
        const min = Number(metadata.stats.min);
        const max = Number(metadata.stats.max);
        config.range = {
          min,
          max,
          buckets: Object.entries(metadata.stats.distribution || {}).map(([range, count]) => {
            const [start, end] = range.split('-').map(Number);
            return { start, end, count };
          })
        };
      }
      break;

    case 'categorical':
      config.component = metadata.stats?.uniqueValues && metadata.stats.uniqueValues.size <= 5 
        ? 'checkbox' 
        : 'multi-select';
      config.operator = 'in';
      config.options = Array.from(metadata.stats?.uniqueValues || []);
      break;

    case 'boolean':
      config.component = 'switch';
      config.options = [true, false];
      break;

    case 'date':
      config.component = 'date-range';
      config.operator = 'between';
      config.dateFormat = 'YYYY-MM-DD';
      if (metadata.stats?.min !== undefined && metadata.stats?.max !== undefined) {
        const min = metadata.stats.min as string;
        const max = metadata.stats.max as string;
        config.range = {
          min,
          max,
          buckets: Object.entries(metadata.stats.distribution || {}).map(([range, count]) => {
            const [start, end] = range.split('-');
            return { start, end, count };
          })
        };
      }
      break;
  }

  return config;
};

export const getAvailableOperators = (type: ColumnMetadata['type']): ComparisonOperator[] => {
  switch (type) {
    case 'numeric':
    case 'date':
      return ['=', '!=', '>', '>=', '<', '<=', 'between'];
    case 'categorical':
      return ['in', 'not_in'];
    case 'boolean':
      return ['=', '!='];
    default:
      return ['=', '!=', 'contains', 'not_contains'];
  }
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

// This function is kept for future use in advanced analytics features
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const generateNumericBuckets = (
  min: number,
  max: number,
  distribution: Record<string, number>
): { start: number; end: number; count: number }[] => {
  return Object.entries(distribution).map(([range, count]) => {
    const [start, end] = range.split('-').map(Number);
    return { start, end, count: count };
  });
};

export const generateChartData = (metadata: ColumnMetadata): ChartData[keyof ChartData] => {
  switch (metadata.type) {
    case 'numeric':
      if (!metadata.stats?.distribution) return { buckets: [], min: 0, max: 0 };
      return {
        buckets: Object.entries(metadata.stats.distribution).map(([range, count]) => {
          const [start, end] = range.split('-').map(Number);
          return { start, end, count };
        }),
        min: metadata.stats.min as number,
        max: metadata.stats.max as number
      };

    case 'date':
      if (!metadata.stats?.distribution) return { buckets: [], min: '', max: '' };
      return {
        buckets: Object.entries(metadata.stats.distribution).map(([range, count]) => {
          const [start, end] = range.split('-');
          return { start, end, count };
        }),
        min: metadata.stats.min as string,
        max: metadata.stats.max as string
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
