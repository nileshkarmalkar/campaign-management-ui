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

interface ChurnRecord {
  accountId: string;
  churnRisk: string;
  lastInteraction: string;
  revenueChange: number;
  serviceQuality: number;
  competitorOffers: boolean;
}

interface SampleDatasets {
  [key: string]: CustomerRecord[] | ChurnRecord[];
  customer_data: CustomerRecord[];
  churn_data: ChurnRecord[];
}

class DataService {
  private projectId: string = 'aipp-tmf680-orch-dev-a613e8';
  private dataset: string = 'camp_mgmt';
  private currentTable: string = '';

  async initialize(projectId: string, dataset: string): Promise<void> {
    this.projectId = projectId;
    this.dataset = dataset;

    if (!API_BASE_URL) {
      console.log('No API URL found, using sample data');
      return;
    }

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
    if (!API_BASE_URL) {
      console.log('Using sample data');
      return ['customer_data', 'churn_data'];
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/bigquery/tables?projectId=${this.projectId}&dataset=${this.dataset}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tables');
      }
      const result = await response.json();
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
      return [];
    }
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

  // Backward compatibility methods
  async setCurrentTable(tableName: string): Promise<void> {
    this.currentTable = tableName;
  }

  async getCustomerData(limit: number = 1000): Promise<any[]> {
    const result = await this.getTableData('customer_data', limit);
    return result.data;
  }

  async getChurnData(): Promise<any[]> {
    const result = await this.getTableData('churn_data');
    return result.data;
  }

  async getCustomersBySegment(segmentQuery: string, limit: number = 1000): Promise<any[]> {
    if (!this.currentTable) {
      throw new Error('No table selected. Call setCurrentTable first.');
    }

    if (!API_BASE_URL) {
      console.log('Using sample data');
      return [];
    }

    const response = await fetch(`${API_BASE_URL}/api/bigquery/data/${this.currentTable}/segment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ segmentQuery, limit }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch customers by segment');
    }

    const result = await response.json();
    return result.data;
  }

  async validateQuery(query: string): Promise<any> {
    if (!API_BASE_URL) {
      console.log('Using sample data');
      return { success: true, data: [] };
    }

    const response = await fetch(`${API_BASE_URL}/api/bigquery/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error('Failed to validate query');
    }

    const result = await response.json();
    return result;
  }
}

const dataService = new DataService();
export default dataService;
