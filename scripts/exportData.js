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

// Convert data to JSON Lines format (one object per line)
const writeJsonLines = (data, filename) => {
  const filePath = path.join(dataDir, filename);
  const stream = fs.createWriteStream(filePath);
  
  data.forEach(item => {
    // Create a new object with ordered fields to ensure consistent formatting
    const formattedItem = {
      accountId: item.accountId,
      msf: Number(item.msf.toFixed(2)),
      tenure: Number(item.tenure),
      brand: item.brand,
      lineOfBusiness: item.lineOfBusiness,
      paymentMode: item.paymentMode,
      accountType: item.accountType,
      accountSubType: item.accountSubType,
      numberOfSubscribers: Number(item.numberOfSubscribers),
      geography: item.geography,
      isActive: Boolean(item.isActive)
    };

    // Add churn-specific fields if they exist
    if ('churnScore' in item) {
      Object.assign(formattedItem, {
        churnScore: Number(item.churnScore),
        churnProbability: item.churnProbability,
        predictedChurnDate: item.predictedChurnDate,
        churnReason: item.churnReason,
        recommendedAction: item.recommendedAction
      });
    }

    // Write each object as a single line with proper JSON formatting
    stream.write(JSON.stringify(formattedItem, null, 0) + '\n');
  });
  
  stream.end();
};

// Write customer data to JSON Lines file
writeJsonLines(customerData, 'customer_data.json');

// Write churn data to JSON Lines file
writeJsonLines(churnData, 'churn_data.json');

console.log('Data exported successfully to:');
console.log('- data/customer_data.json');
console.log('- data/churn_data.json');
