export const sampleCampaigns = [
  {
    id: 'camp_001',
    name: 'Summer 2025 Upgrade Promotion',
    code: 'SUP25',
    businessUnit: 'Consumer Mobility',
    campaignType: 'Upgrade',
    deploymentDate: '2025-06-01',
    endDate: '2025-08-31',
    status: 'Draft',
    channels: ['Email', 'SMS'],
    marcommPrimeId: 'MCP-2025-001',
    description: 'Summer promotion targeting existing customers for device upgrades'
  },
  {
    id: 'camp_002',
    name: 'Home Internet Bundle Offer',
    code: 'HBO25',
    businessUnit: 'Home Solutions',
    campaignType: 'Cross-sell',
    deploymentDate: '2025-07-01',
    endDate: '2025-09-30',
    status: 'Draft',
    channels: ['Direct Mail', 'Email'],
    marcommPrimeId: 'MCP-2025-002',
    description: 'Bundle offer for existing mobility customers'
  }
];

export const sampleSegments = [
  {
    id: 'seg_001',
    name: 'High-Value Mobility Customers',
    brand: ['TELUS'],
    lineOfBusiness: ['Mobility'],
    accountType: ['Consumer'],
    accountSubType: ['Postpaid'],
    geography: ['National'],
    msfRange: {
      min: 70,
      max: 150
    },
    subscriberCount: {
      min: 1,
      max: 5
    },
    description: 'High-value customers with monthly spend between $70-$150'
  },
  {
    id: 'seg_002',
    name: 'Internet-Only Customers',
    brand: ['TELUS'],
    lineOfBusiness: ['Home Solutions'],
    accountType: ['Consumer'],
    accountSubType: ['Internet'],
    geography: ['Ontario'],
    msfRange: {
      min: 85,
      max: 120
    },
    description: 'Customers with only internet service'
  }
];

export const sampleTriggers = [
  {
    id: 'trig_001',
    name: 'Device Age Trigger',
    type: 'Time-based',
    condition: 'Device Age > 18 months',
    frequency: 'One-time',
    segmentId: 'seg_001',
    campaignId: 'camp_001',
    status: 'Active'
  },
  {
    id: 'trig_002',
    name: 'Usage Pattern Trigger',
    type: 'Event-based',
    condition: 'Data Usage > 80% of limit for 3 consecutive months',
    frequency: 'Monthly',
    segmentId: 'seg_002',
    campaignId: 'camp_002',
    status: 'Active'
  }
];

export const sampleCommunications = [
  {
    id: 'comm_001',
    name: 'Summer Upgrade Email',
    type: 'Email',
    template: 'UPGRADE_EMAIL_TEMPLATE',
    subject: 'Exclusive Summer Upgrade Offer for You!',
    content: 'Dear {customer_name}, \n\nUpgrade your device today and get up to $300 off!',
    campaignId: 'camp_001',
    schedule: {
      startDate: '2025-06-01',
      frequency: 'One-time'
    }
  },
  {
    id: 'comm_002',
    name: 'Bundle Offer Direct Mail',
    type: 'Direct Mail',
    template: 'BUNDLE_MAIL_TEMPLATE',
    content: 'Get our best Home Internet bundle deal!',
    campaignId: 'camp_002',
    schedule: {
      startDate: '2025-07-01',
      frequency: 'One-time'
    }
  }
];

export const sampleOfferMappings = [
  {
    id: 'map_001',
    segmentId: 'seg_001',
    offers: [
      {
        id: 'off_001',
        name: 'Premium Device Upgrade',
        description: '$300 off on premium devices with 2-year term',
        validFrom: '2025-06-01',
        validTo: '2025-08-31',
        status: 'Created'
      }
    ]
  },
  {
    id: 'map_002',
    segmentId: 'seg_002',
    offers: [
      {
        id: 'off_002',
        name: 'Internet Speed Upgrade',
        description: 'Upgrade to 1.5Gbps Internet for $99/month',
        validFrom: '2025-07-01',
        validTo: '2025-09-30',
        status: 'Created'
      }
    ]
  }
];

// Helper function to load all sample data
export const loadSampleData = () => {
  localStorage.setItem('campaigns', JSON.stringify(sampleCampaigns));
  localStorage.setItem('segments', JSON.stringify(sampleSegments));
  localStorage.setItem('triggers', JSON.stringify(sampleTriggers));
  localStorage.setItem('communications', JSON.stringify(sampleCommunications));
  localStorage.setItem('offerMappings', JSON.stringify(sampleOfferMappings));
};

// Helper function to clear all data
export const clearAllData = () => {
  localStorage.removeItem('campaigns');
  localStorage.removeItem('segments');
  localStorage.removeItem('triggers');
  localStorage.removeItem('communications');
  localStorage.removeItem('offerMappings');
};
