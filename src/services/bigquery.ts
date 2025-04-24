import { sampleDatasets } from '../utils/sampleData';

class DataService {
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
    console.log('Query to be executed:', query);
    // For now, return customer data as a sample
    return this.getCustomerData();
  }
}

export default DataService;
