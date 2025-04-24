const generateSampleData = () => {
  const data = [];
  const brands = ['TELUS', 'Koodo'];
  const lobs = ['Mobility', 'Home Solution', 'Subscription on Demand'];
  const paymentModes = ['Prepaid', 'Postpaid'];
  const accountTypes = ['Consumer', 'Business', 'Enterprise'];
  const accountSubTypes = ['Individual', 'Small Business', 'Corporate'];
  const geographies = ['ON', 'BC', 'AB', 'QC', 'NS', 'MB', 'SK', 'NL', 'NB', 'PE'];

  for (let i = 0; i < 1000; i++) {
    const tenure = Math.floor(Math.random() * 4); // Random tenure between 0 and 3 years

    data.push({
      accountId: `ACC${String(i + 1000).padStart(6, '0')}`,
      msf: Math.floor(Math.random() * 30000) / 100, // Monthly Service Fee: $0-$300
      tenure: tenure,
      brand: brands[Math.floor(Math.random() * brands.length)],
      lineOfBusiness: lobs[Math.floor(Math.random() * lobs.length)],
      paymentMode: paymentModes[Math.floor(Math.random() * paymentModes.length)],
      accountType: accountTypes[Math.floor(Math.random() * accountTypes.length)],
      accountSubType: accountSubTypes[Math.floor(Math.random() * accountSubTypes.length)],
      numberOfSubscribers: Math.floor(Math.random() * 10) + 1,
      geography: geographies[Math.floor(Math.random() * geographies.length)],
      isActive: Math.random() > 0.1 // 90% active accounts
    });
  }

  return data;
};

export const sampleData = generateSampleData();

export const loadSampleData = () => {
  const data = generateSampleData();
  localStorage.setItem('segments', JSON.stringify([{
    id: 'sample-segment-1',
    name: 'High Value Customers',
    description: 'Customers with high MSF and long tenure',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    data: data,
    filters: {
      root: {
        operator: 'AND',
        conditions: [
          { field: 'msf', operator: '>=', value: 100, type: 'number' },
          { field: 'tenure', operator: '>=', value: 5, type: 'number' }
        ]
      },
      activeFilters: {
        msf: { type: 'number', value: 100, operator: '>=' },
        tenure: { type: 'number', value: 5, operator: '>=' }
      }
    }
  }]));

  // Initialize other collections if they don't exist
  if (!localStorage.getItem('campaigns')) {
    localStorage.setItem('campaigns', '[]');
  }
  if (!localStorage.getItem('triggers')) {
    localStorage.setItem('triggers', '[]');
  }
  if (!localStorage.getItem('offerMappings')) {
    localStorage.setItem('offerMappings', '[]');
  }
};
