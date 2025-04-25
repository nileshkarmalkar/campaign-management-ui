export const sampleCampaigns = [
  {
    id: 'camp_001',
    requestorName: 'John Smith',
    deploymentDate: '2025-05-25T04:00:00.000Z',
    deploymentEndDate: '2025-08-30T04:00:00.000Z',
    campaignName: 'Summer 2025 Upgrade Promotion',
    targetBases: 2,
    segmentsPerBase: '7-20',
    businessUnit: ['Mobility - TELUS'],
    campaignType: 'Loyalty',
    campaignCode: 'RNW',
    subCampCode: 'TRTRIG',
    medium: ['SMS'],
    marcommPrime: 'John Smith',
    brand: ['TELUS'],
    lineOfBusiness: ['Mobility'],
    contractStrategyWaiver: false,
    contractStrategyWaiverReason: '',
    contractExpiryDuration: '6',
    language: ['English'],
    prepaidPostpaid: ['Postpaid'],
    byod: true,
    mtm: true,
    renewalWindow: {
      operator: '>=',
      value: '90'
    },
    contactStrategyRule: {
      operator: '<=',
      value: '60'
    }
  },
  {
    id: 'camp_002',
    requestorName: 'Sarah Johnson',
    deploymentDate: '2025-07-01T04:00:00.000Z',
    deploymentEndDate: '2025-09-30T04:00:00.000Z',
    campaignName: 'Home Internet Bundle Offer',
    targetBases: 1,
    segmentsPerBase: '1-6',
    businessUnit: ['FFH - Home Solutions'],
    campaignType: 'Cross-sell',
    campaignCode: 'HBO25',
    subCampCode: 'HBO25-001',
    medium: ['DM', 'EM'],
    marcommPrime: 'Sarah Johnson',
    brand: ['TELUS'],
    lineOfBusiness: ['Home Solutions'],
    contractStrategyWaiver: false,
    contractStrategyWaiverReason: '',
    contractExpiryDuration: '3',
    language: ['English', 'French'],
    prepaidPostpaid: ['Postpaid'],
    byod: true,
    mtm: true,
    renewalWindow: {
      operator: '>=',
      value: '60'
    },
    contactStrategyRule: {
      operator: '<=',
      value: '45'
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
    triggerName: 'VULNERABLE_TRIGGER_EVENTS',
    type: 'event',
    conditions: [
      {
        field: 'triggerName',
        operator: '=',
        value: 'TELUS>SUPPORT>ARTICLE>TELUS_DEVICE_CHECKUP_APP'
      },
      {
        field: 'triggerName',
        operator: '=',
        value: 'TELUS>SUPPORT>ARTICLE>TELUS_MOBILITY_RATE_PLANS_AND_ELIGIBILITY'
      },
      {
        field: 'triggerName',
        operator: '=',
        value: 'TELUS>SUPPORT>ARTICLE>SERVICE_TERMS_BETWEEN_YOU_AND_TELUS'
      }
    ],
    frequency: 'One-time',
    segmentId: 'seg_001',
    campaignId: 'camp_001',
    status: 'active',
    description: 'List of VULNERABLE_TRIGGER_EVENTS'
  },
  {
    id: 'trig_002',
    triggerName: 'ULTRA_HOT_TRIGGER',
    type: 'event',
    conditions: [
      {
        field: 'triggerName',
        operator: '=',
        value: 'TELUS>SUPPORT>ARTICLE>UNLINK_A_MOBILITY_ACCOUNT'
      },
      {
        field: 'triggerName',
        operator: '=',
        value: 'TELUS>SUPPORT>ARTICLE>CANCELLING_TELUS'
      },
      {
        field: 'triggerName',
        operator: '=',
        value: 'TELUS>BUSINESS>SUPPORT>ARTICLE>CANCEL_ACCOUNT_OR_SERVICE'
      }
    ],
    frequency: 'One-time',
    segmentId: 'seg_002',
    campaignId: 'camp_002',
    status: 'active',
    description: 'List of ULTRA_HOT_TRIGGER events'
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
    segmentName: 'High-Value Mobility Customers',
    offerId: 'TC-BRP-Q12025-ROC-TIER1',
    offerName: 'TC-BRP-Q12025-ROC-TIER1',
    startDate: '2025-04-01T04:00:00.000Z',
    endDate: null,
    status: 'Created'
  },
  {
    id: 'map_002',
    segmentId: 'seg_002',
    segmentName: 'Internet-Only Customers',
    offerId: 'TC-BRP-Q13788-BC-TIER1',
    offerName: 'TC-BRP-Q13788-BC-TIER1',
    startDate: '2025-02-01T05:00:00.000Z',
    endDate: null,
    status: 'Created'
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

// Sample datasets for BigQuery service
export const sampleDatasets = {
  customerData: sampleSegments,
  churnModelData: sampleSegments
};
