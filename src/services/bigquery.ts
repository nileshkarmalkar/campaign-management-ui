import { BigQuery } from '@google-cloud/bigquery';
import { sampleDatasets } from '../utils/sampleData';
import { bigQueryConfig } from '../config/bigquery';

class DataService {
  private isUsingBigQuery: boolean;
  private bigquery: BigQuery | null = null;

  constructor() {
    this.isUsingBigQuery = !!bigQueryConfig.projectId && !!bigQueryConfig.datasetId;
    if (this.isUsingBigQuery) {
      try {
        this.bigquery = new BigQuery({
          projectId: bigQueryConfig.projectId,
        });
      } catch (error) {
        console.error('Failed to initialize BigQuery:', error);
        this.isUsingBigQuery = false;
      }
    } else {
      console.warn('BigQuery credentials not provided. Using sample data instead.');
    }
  }

  async getCustomerData(): Promise<any[]> {
    if (this.isUsingBigQuery) {
      if (!this.bigquery) throw new Error('BigQuery client not initialized');
      const query = `SELECT * FROM \`${bigQueryConfig.projectId}.${bigQueryConfig.datasetId}.customer_data\``;
      const [rows] = await this.bigquery.query({ query });
      return rows;
    }
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return sampleDatasets.customerData;
  }

  async getChurnData(): Promise<any[]> {
    if (this.isUsingBigQuery) {
      if (!this.bigquery) throw new Error('BigQuery client not initialized');
      const query = `SELECT * FROM \`${bigQueryConfig.projectId}.${bigQueryConfig.datasetId}.churn_data\``;
      const [rows] = await this.bigquery.query({ query });
      return rows;
    }
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return sampleDatasets.churnModelData;
  }

  async executeQuery(query: string): Promise<any[]> {
    if (this.isUsingBigQuery) {
      if (!this.bigquery) throw new Error('BigQuery client not initialized');
      console.log('Executing query on BigQuery:', query);
      const [rows] = await this.bigquery.query({ query });
      return rows;
    } else {
      console.log('Query to be executed (using sample data):', query);
      return this.getCustomerData();
    }
  }
}

export default DataService;
