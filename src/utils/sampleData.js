export const sampleCampaigns = [
  {
    id: 'camp_001',
    campaignName: 'Summer 2025 Upgrade Promotion',
    campaignCode: 'SUP25',
    subCampCode: 'SUP25-001',
    businessUnit: ['Consumer Mobility'],
    campaignType: 'Upgrade',
    deploymentDate: '2025-06-01',
    deploymentEndDate: '2025-08-31',
    status: 'Draft',
    requestorName: 'John Smith',
    marcommPrime: 'MCP-2025-001',
    description: 'Summer promotion targeting existing customers for device upgrades',
    brand: ['TELUS'],
    lineOfBusiness: ['Mobility'],
    language: ['English', 'French'],
    prepaidPostpaid: ['Postpaid'],
    byod: false,
    mtm: false,
    contractExpiryDuration: 24,
    renewalWindow: {
      operator: '>',
      value: 90
    },
    contactStrategyRule: {
      operator: '<',
      value: 30
    }
  },
  {
    id: 'camp_002',
    campaignName: 'Home Internet Bundle Offer',
    campaignCode: 'HBO25',
    subCampCode: 'HBO25-001',
    businessUnit: ['Home Solutions'],
    campaignType: 'Cross-sell',
    deploymentDate: '2025-07-01',
    deploymentEndDate: '2025-09-30',
    status: 'Draft',
    requestorName: 'Sarah Johnson',
    marcommPrime: 'MCP-2025-002',
    description: 'Bundle offer for existing mobility customers',
    brand: ['TELUS'],
    lineOfBusiness: ['Home Solutions'],
    language: ['English', 'French'],
    prepaidPostpaid: ['Postpaid'],
    byod: true,
    mtm: true,
    contractExpiryDuration: 12,
    renewalWindow: {
      operator: '>',
      value: 60
    },
    contactStrategyRule: {
      operator: '<',
      value: 45
    }
  }
];

export const sampleSegments = [
  {
    id: 'seg_001',
    segmentName: 'High-Value Mobility Customers',
    brand: ['TELUS'],
    lineOfBusiness: ['Mobility'],
    accountType: ['Consumer'],
    accountSubType: ['Postpaid'],
    geography: ['National'],
    status: 'Active',
    msfAmount: {
      operator: 'between',
      value1: 70,
      value2: 150
    },
    numberOfSubscribers: '1-5',
    description: 'High-value customers with monthly spend between $70-$150',
    triggers: ['trig_001'],
    existingSegments: []
  },
  {
    id: 'seg_002',
    segmentName: 'Internet-Only Customers',
    brand: ['TELUS'],
    lineOfBusiness: ['Home Solutions'],
    accountType: ['Consumer'],
    accountSubType: ['Internet'],
    geography: ['Ontario'],
    status: 'Active',
    msfAmount: {
      operator: 'between',
      value1: 85,
      value2: 120
    },
    numberOfSubscribers: '1',
    description: 'Customers with only internet service',
    triggers: ['trig_002'],
    existingSegments: []
  }
];

export const sampleTriggers = [
  {
    id: 'trig_001',
    triggerName: 'Device Age Trigger',
    type: 'event',
    conditions: [{
      field: 'deviceAge',
      operator: '>',
      value: '18'
    }],
    frequency: 'One-time',
    segmentId: 'seg_001',
    campaignId: 'camp_001',
    status: 'active',
    description: 'Triggers when device age exceeds 18 months'
  },
  {
    id: 'trig_002',
    triggerName: 'Usage Pattern Trigger',
    type: 'event',
    conditions: [{
      field: 'dataUsage',
      operator: '>',
      value: '80'
    }],
    frequency: 'Monthly',
    segmentId: 'seg_002',
    campaignId: 'camp_002',
    status: 'active',
    description: 'Triggers when data usage exceeds 80% for 3 consecutive months'
  }
];

export const sampleCommunications = [
  {
    id: 'comm_001',
    name: 'Summer Upgrade Email',
    type: 'Email',
    template: 'UPGRADE_EMAIL_TEMPLATE',
    subject: 'Exclusive Summer Upgrade Offer for You!',
    content: `Dear {customer_name},

We hope this email finds you well. As a valued TELUS customer, we're excited to offer you an exclusive device upgrade opportunity!

🌟 Special Summer Upgrade Offer:
• Up to $300 off on the latest devices
• Premium device selection including iPhone and Samsung
• 24-month term with special pricing
• Free shipping and setup support

Visit telus.com/upgrade or call 1-888-TELUS to take advantage of this offer.

Offer valid until {end_date}.
Terms and conditions apply.

Best regards,
Your TELUS Team`,
    campaignId: 'camp_001',
    schedule: {
      startDate: '2025-06-01',
      frequency: 'One-time',
      timeOfDay: '10:00',
      timezone: 'America/Toronto'
    },
    status: 'Draft',
    version: '1.0'
  },
  {
    id: 'comm_002',
    name: 'Bundle Offer Direct Mail',
    type: 'Direct Mail',
    template: 'BUNDLE_MAIL_TEMPLATE',
    content: `TELUS Home Internet Bundle Offer

Dear {customer_name},

Upgrade your home entertainment experience with our exclusive Internet bundle:

✓ Lightning-fast Internet speeds up to 1.5 Gbps
✓ Unlimited data usage
✓ Free Wi-Fi 6 modem rental
✓ 3 months of free streaming services
✓ Professional installation included

Special offer: $99/month for 12 months
Regular price: $120/month

Call 1-888-TELUS or visit telus.com/bundle to sign up today!

Offer ends {end_date}.
Terms and conditions apply.`,
    campaignId: 'camp_002',
    schedule: {
      startDate: '2025-07-01',
      frequency: 'One-time',
      mailClass: 'First Class',
      printDeadline: '2025-06-15'
    },
    status: 'Draft',
    version: '1.0'
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
        details: {
          discount: 300,
          term: 24,
          deviceTypes: ['iPhone', 'Samsung Galaxy', 'Google Pixel'],
          planRequirement: 'Peace of Mind Connect'
        },
        validFrom: '2025-06-01',
        validTo: '2025-08-31',
        status: 'Created',
        terms: [
          'Minimum $80/month plan required',
          'Credit check required',
          'Early cancellation fees apply',
          'Cannot be combined with other offers'
        ]
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
        details: {
          speed: '1.5 Gbps',
          regularPrice: 120,
          promoPrice: 99,
          promoDuration: 12,
          extras: [
            'Unlimited data',
            'Wi-Fi 6 modem rental',
            '3 months free streaming'
          ]
        },
        validFrom: '2025-07-01',
        validTo: '2025-09-30',
        status: 'Created',
        terms: [
          '12-month term required',
          'Available where technology permits',
          'Price increases after promotional period',
          'Installation fees may apply'
        ]
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
