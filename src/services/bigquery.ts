import { sampleDatasets } from '../utils/sampleData';

class DataService {
  private projectId: string = '';
  private dataset: string = '';

  async initialize(projectId: string, dataset: string): Promise<void> {
    this.projectId = projectId;
    this.dataset = dataset;
  }

  async listTables(): Promise<string[]> {
    // For now, return a static list of tables
    return ['customer_data', 'churn_model_data'];
  }

  async getCustomerData(): Promise<any[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return sampleDatasets.customerData;
  }

  async getChurnData(): Promise<any[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return sampleDatasets.churnModelData;
  }

  async executeQuery(query: string): Promise<any[]> {
    console.log('Query to be executed (using sample data):', query);
    return this.getCustomerData();
  }
}

export default DataService;
