export const bigQueryConfig = {
  projectId: process.env.REACT_APP_BQ_PROJECT_ID || '',
  datasetId: process.env.REACT_APP_BQ_DATASET_ID || '',
};

// Validate configuration
if (!bigQueryConfig.projectId) {
  console.error('BigQuery Project ID is not configured. Set REACT_APP_BQ_PROJECT_ID in your environment.');
}

if (!bigQueryConfig.datasetId) {
  console.error('BigQuery Dataset ID is not configured. Set REACT_APP_BQ_DATASET_ID in your environment.');
}
