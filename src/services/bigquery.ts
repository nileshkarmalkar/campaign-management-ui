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
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ projectId, datasetId }),
    });
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Failed to initialize BigQuery');
    }
  }

  async listTables(): Promise<string[]> {
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
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
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
    return result.data;
  }
}

export default new DataService();
