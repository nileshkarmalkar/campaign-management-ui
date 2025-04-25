const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

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
  private projectId: string = '';
  private dataset: string = '';
  private currentTable: string = '';

  async initialize(projectId: string, dataset: string): Promise<void> {
    this.projectId = projectId;
    this.dataset = dataset;

    const response = await fetch(`${API_BASE_URL}/api/bigquery/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ projectId, datasetId: dataset }),
    });

    if (!response.ok) {
      throw new Error('Failed to initialize BigQuery');
    }
  }

  async listTables(): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/bigquery/tables`);
      if (!response.ok) {
        // If API fails, return sample data table names
        return ['camp_mgmt'];
      }
      const result = await response.json();
      console.log('API response for tables:', result);
      return result.data || [];
    } catch (error) {
      console.log('Falling back to sample data');
      return ['camp_mgmt'];
    }
  }

  async getTableData(tableName: string, limit: number = 1000): Promise<{ success: boolean; data: any[]; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/bigquery/data/${encodeURIComponent(tableName)}?limit=${limit}`);
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
    const response = await fetch(`${API_BASE_URL}/api/bigquery/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
    if (!response.ok) {
      throw new Error('Failed to execute query');
    }
    const result = await response.json();
    return result.data;
  }
}

const dataService = new DataService();
export default dataService;
