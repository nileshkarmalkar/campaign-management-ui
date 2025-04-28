<<<<<<< HEAD
const API_BASE_URL = 'http://localhost:3003/api/bigquery';

export class DataService {
  private static instance: DataService | null = null;
  private currentTable: string | null = null;

  constructor() {
    if (DataService.instance) {
      return DataService.instance;
    }
    DataService.instance = this;
  }

  async initialize(projectId: string, datasetId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/initialize`, {
=======
const API_BASE_URL = process.env.REACT_APP_API_URL || (window.location.hostname === 'nileshkarmalkar.github.io' ? null : 'http://localhost:3001');

interface CustomerRecord {
  accountId: string;
  msf: number;
  tenure: number;
  brand: string;
  lineOfBusiness: string;
  paymentMode: string;
  accountType: string;
  accountSubType: string;
  numberOfSubscribers: number;
  geography: string;
  isActive: boolean;
}

interface SampleDatasets {
  [key: string]: CustomerRecord[];
}

class DataService {
  private projectId: string = 'aipp-tmf680-orch-dev-a613e8';
  private dataset: string = 'camp_mgmt';
  private currentTable: string = '';

  async initialize(projectId: string, dataset: string): Promise<void> {
    this.projectId = projectId;
    this.dataset = dataset;

    const response = await fetch(`${API_BASE_URL}/api/bigquery/initialize`, {
>>>>>>> feature/dynamic-segmentation
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
<<<<<<< HEAD
      body: JSON.stringify({ projectId, datasetId }),
    });
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Failed to initialize BigQuery');
=======
      body: JSON.stringify({ projectId, datasetId: dataset }),
    });

    if (!response.ok) {
      throw new Error('Failed to initialize BigQuery');
>>>>>>> feature/dynamic-segmentation
    }
  }

  async listTables(): Promise<string[]> {
<<<<<<< HEAD
    const response = await fetch(`${API_BASE_URL}/tables`);
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch tables');
    }
    return result.data;
  }

  async setCurrentTable(tableName: string): Promise<void> {
    this.currentTable = tableName;
  }

  async getCustomerData(limit: number = 1000): Promise<any[]> {
    if (!this.currentTable) {
      const tables = await this.listTables();
      if (tables.length === 0) {
        throw new Error('No tables available in the dataset');
      }
      this.currentTable = tables[0];
    }

    const response = await fetch(`${API_BASE_URL}/data/${this.currentTable}?limit=${limit}`);
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch customer data');
    }
    return result.data;
  }

  async executeQuery(query: string): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/query`, {
=======
    if (!API_BASE_URL) {
      console.log('Using sample data');
      return ['customer_data', 'churn_data'];
    }
    try {
      // First initialize BigQuery with project and dataset
      await this.initialize(this.projectId, this.dataset);
      
      const response = await fetch(`${API_BASE_URL}/api/bigquery/tables?projectId=${this.projectId}&dataset=${this.dataset}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tables');
      }
      const result = await response.json();
      console.log('API response for tables:', result);
      if (result.success && result.data && result.data.length > 0) {
        return result.data;
      }
      throw new Error('No tables found in dataset');
    } catch (error) {
      console.log('Error fetching tables, falling back to sample data:', error);
      return ['customer_data', 'churn_data'];
    }
  }

  async getTableData(tableName: string, limit: number = 1000): Promise<{ success: boolean; data: any[]; error?: string }> {
    if (!API_BASE_URL) {
      console.log('Using sample data');
      const { sampleDatasets } = await import('../utils/sampleData') as { sampleDatasets: SampleDatasets };
      return {
        success: true,
        data: sampleDatasets[tableName] || []
      };
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/bigquery/data/${encodeURIComponent(tableName)}?projectId=${this.projectId}&dataset=${this.dataset}&limit=${limit}`);
      if (!response.ok) {
        // If API fails, return sample data
        const { sampleDatasets } = await import('../utils/sampleData') as { sampleDatasets: SampleDatasets };
        return {
          success: true,
          data: sampleDatasets[tableName] || []
        };
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.log('Falling back to sample data');
      const { sampleDatasets } = await import('../utils/sampleData') as { sampleDatasets: SampleDatasets };
      return {
        success: true,
        data: sampleDatasets[tableName] || []
      };
    }
  }

  async executeQuery(query: string): Promise<any[]> {
    if (!API_BASE_URL) {
      console.log('Using sample data');
      return ['customer_data', 'churn_data'];
    }
    const response = await fetch(`${API_BASE_URL}/api/bigquery/query`, {
>>>>>>> feature/dynamic-segmentation
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
<<<<<<< HEAD
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to execute query');
    }
    return result.data;
  }

  async getCustomersBySegment(segmentQuery: string, limit: number = 1000): Promise<any[]> {
    if (!this.currentTable) {
      throw new Error('No table selected. Call setCurrentTable first.');
    }

    const response = await fetch(`${API_BASE_URL}/data/${this.currentTable}/segment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ segmentQuery, limit }),
    });
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch customers by segment');
    }
    return result.data;
  }

  async validateQuery(query: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to validate query');
    }
    return result;
  }

  // Keeping this for backward compatibility
  async getChurnData(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/data/churn_data`);
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch churn data');
    }
=======
    if (!response.ok) {
      throw new Error('Failed to execute query');
    }
    const result = await response.json();
>>>>>>> feature/dynamic-segmentation
    return result.data;
  }
}

<<<<<<< HEAD
export default new DataService();
=======
const dataService = new DataService();
export default dataService;
>>>>>>> feature/dynamic-segmentation
