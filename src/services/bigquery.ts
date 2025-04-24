import { BigQuery } from '@google-cloud/bigquery';

class BigQueryService {
  private bigquery: BigQuery;
  private projectId: string;
  private datasetId: string;

  constructor(projectId: string, datasetId: string) {
    this.projectId = projectId;
    this.datasetId = datasetId;
    this.bigquery = new BigQuery({
      projectId: this.projectId,
    });
  }

  async getCustomerData(): Promise<any[]> {
    const query = `
      SELECT *
      FROM \`${this.projectId}.${this.datasetId}.customer_data\`
    `;
    
    try {
      const [rows] = await this.bigquery.query({ query });
      return rows;
    } catch (error) {
      console.error('Error fetching customer data:', error);
      throw error;
    }
  }

  async getChurnData(): Promise<any[]> {
    const query = `
      SELECT *
      FROM \`${this.projectId}.${this.datasetId}.churn_data\`
    `;
    
    try {
      const [rows] = await this.bigquery.query({ query });
      return rows;
    } catch (error) {
      console.error('Error fetching churn data:', error);
      throw error;
    }
  }

  async executeQuery(query: string): Promise<any[]> {
    try {
      const [rows] = await this.bigquery.query({ query });
      return rows;
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  }
}

export default BigQueryService;
