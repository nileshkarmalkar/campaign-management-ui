const API_BASE_URL = process.env.REACT_APP_API_URL || (window.location.hostname === 'nileshkarmalkar.github.io' ? null : 'http://localhost:3003');

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
  private sampleDatasets: SampleDatasets | null = null;

  private async loadSampleData(): Promise<void> {
    if (!this.sampleDatasets) {
      const { sampleDatasets } = await import('../utils/sampleData');
      this.sampleDatasets = sampleDatasets;
    }
  }

  async initialize(projectId: string, dataset: string): Promise<void> {
    this.projectId = projectId;
    this.dataset = dataset;

    // Always load sample data for GitHub Pages
    if (window.location.hostname === 'nileshkarmalkar.github.io') {
      await this.loadSampleData();
      return;
    }

    if (!API_BASE_URL) {
      console.log('No API URL found, using sample data');
      await this.loadSampleData();
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/bigquery/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId, datasetId: dataset }),
      });

      if (!response.ok) {
        console.log('Failed to initialize BigQuery, falling back to sample data');
        await this.loadSampleData();
      }
    } catch (error) {
      console.log('Error initializing BigQuery, falling back to sample data:', error);
      await this.loadSampleData();
    }
  }

  async listTables(): Promise<string[]> {
    if (window.location.hostname === 'nileshkarmalkar.github.io' || !API_BASE_URL) {
      console.log('Using sample data');
      await this.loadSampleData();
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
      await this.loadSampleData();
      return ['customer_data', 'churn_data'];
    }
  }

  async getTableData(tableName: string, limit: number = 1000): Promise<{ success: boolean; data: any[]; error?: string }> {
    if (window.location.hostname === 'nileshkarmalkar.github.io' || !API_BASE_URL) {
      console.log('Using sample data');
      await this.loadSampleData();
      return {
        success: true,
        data: this.sampleDatasets?.[tableName] || []
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/bigquery/data/${encodeURIComponent(tableName)}?projectId=${this.projectId}&dataset=${this.dataset}&limit=${limit}`);
      if (!response.ok) {
        await this.loadSampleData();
        return {
          success: true,
          data: this.sampleDatasets?.[tableName] || []
        };
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.log('Falling back to sample data');
      await this.loadSampleData();
      return {
        success: true,
        data: this.sampleDatasets?.[tableName] || []
      };
    }
  }

  async executeQuery(query: string): Promise<any[]> {
    if (window.location.hostname === 'nileshkarmalkar.github.io' || !API_BASE_URL) {
      console.log('Using sample data for query execution');
      return [];
    }

    try {
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
    } catch (error) {
      console.log('Error executing query, returning empty result:', error);
      return [];
    }
  }

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

    if (window.location.hostname === 'nileshkarmalkar.github.io' || !API_BASE_URL) {
      console.log('Using sample data for segment query');
      return [];
    }

    try {
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
    } catch (error) {
      console.log('Error fetching customers by segment, returning empty result:', error);
      return [];
    }
  }

  async validateQuery(query: string): Promise<any> {
    if (window.location.hostname === 'nileshkarmalkar.github.io' || !API_BASE_URL) {
      console.log('Using sample data for query validation');
      return { success: true, data: [] };
    }

    try {
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
    } catch (error) {
      console.log('Error validating query, returning success:', error);
      return { success: true, data: [] };
    }
  }
}

const dataService = new DataService();
export default dataService;
