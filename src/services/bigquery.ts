import { sampleDatasets } from '../utils/sampleData';

class DataService {
  private projectId: string = '';
  private dataset: string = '';
  private currentTable: string = '';

  async initialize(projectId: string, dataset: string): Promise<void> {
    this.projectId = projectId;
    this.dataset = dataset;
  }

  async setCurrentTable(table: string): Promise<void> {
    this.currentTable = table;
  }

  async listTables(): Promise<string[]> {
    // For now, return a static list of tables
    return ['customer_data', 'churn_model_data'];
  }

  async getCustomerData(limit: number = 1000): Promise<any[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return sampleDatasets.customerData.slice(0, limit);
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

const dataService = new DataService();
export default dataService;
