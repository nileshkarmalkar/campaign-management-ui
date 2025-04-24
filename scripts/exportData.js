const fs = require('fs');
const path = require('path');

// Import the data generation functions from sampleData.js
const { generateCustomerData, generateChurnModelData } = require('../src/utils/sampleData');

// Generate the data
const customerData = generateCustomerData();
const churnData = generateChurnModelData();

// Create the data directory if it doesn't exist
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Write customer data to JSON file
fs.writeFileSync(
  path.join(dataDir, 'customer_data.json'),
  JSON.stringify(customerData, null, 2)
);

// Write churn data to JSON file
fs.writeFileSync(
  path.join(dataDir, 'churn_data.json'),
  JSON.stringify(churnData, null, 2)
);

console.log('Data exported successfully to:');
console.log('- data/customer_data.json');
console.log('- data/churn_data.json');
