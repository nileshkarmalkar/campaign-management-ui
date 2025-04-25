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
  camp_mgmt: [
    { accountId: "ACC001", msf: 75.50, tenure: 24, brand: "TELUS", lineOfBusiness: "Mobility", paymentMode: "Postpaid", accountType: "Consumer", accountSubType: "Individual", numberOfSubscribers: 1, geography: "BC", isActive: true },
    { accountId: "ACC002", msf: 120.75, tenure: 36, brand: "TELUS", lineOfBusiness: "Home Solution", paymentMode: "Postpaid", accountType: "Consumer", accountSubType: "Family", numberOfSubscribers: 3, geography: "ON", isActive: true },
    { accountId: "ACC003", msf: 45.00, tenure: 12, brand: "Koodo", lineOfBusiness: "Mobility", paymentMode: "Prepaid", accountType: "Consumer", accountSubType: "Individual", numberOfSubscribers: 1, geography: "AB", isActive: true },
    { accountId: "ACC004", msf: 200.00, tenure: 48, brand: "TELUS", lineOfBusiness: "Business", paymentMode: "Postpaid", accountType: "Business", accountSubType: "Small Business", numberOfSubscribers: 5, geography: "QC", isActive: true },
    { accountId: "ACC005", msf: 85.25, tenure: 18, brand: "TELUS", lineOfBusiness: "Mobility", paymentMode: "Postpaid", accountType: "Consumer", accountSubType: "Individual", numberOfSubscribers: 2, geography: "SK", isActive: true },
    { accountId: "ACC006", msf: 150.50, tenure: 30, brand: "TELUS", lineOfBusiness: "Home Solution", paymentMode: "Postpaid", accountType: "Consumer", accountSubType: "Family", numberOfSubscribers: 4, geography: "MB", isActive: true },
    { accountId: "ACC007", msf: 55.00, tenure: 6, brand: "Public Mobile", lineOfBusiness: "Mobility", paymentMode: "Prepaid", accountType: "Consumer", accountSubType: "Individual", numberOfSubscribers: 1, geography: "NS", isActive: true },
    { accountId: "ACC008", msf: 300.00, tenure: 60, brand: "TELUS", lineOfBusiness: "Business", paymentMode: "Postpaid", accountType: "Business", accountSubType: "Enterprise", numberOfSubscribers: 10, geography: "ON", isActive: true },
    { accountId: "ACC009", msf: 95.75, tenure: 24, brand: "TELUS", lineOfBusiness: "Mobility", paymentMode: "Postpaid", accountType: "Consumer", accountSubType: "Individual", numberOfSubscribers: 2, geography: "BC", isActive: true },
    { accountId: "ACC010", msf: 175.25, tenure: 42, brand: "TELUS", lineOfBusiness: "Home Solution", paymentMode: "Postpaid", accountType: "Consumer", accountSubType: "Family", numberOfSubscribers: 5, geography: "AB", isActive: true },
    { accountId: "ACC011", msf: 65.00, tenure: 9, brand: "Koodo", lineOfBusiness: "Mobility", paymentMode: "Prepaid", accountType: "Consumer", accountSubType: "Individual", numberOfSubscribers: 1, geography: "ON", isActive: true },
    { accountId: "ACC012", msf: 250.00, tenure: 54, brand: "TELUS", lineOfBusiness: "Business", paymentMode: "Postpaid", accountType: "Business", accountSubType: "Medium Business", numberOfSubscribers: 8, geography: "QC", isActive: true },
    { accountId: "ACC013", msf: 80.50, tenure: 15, brand: "TELUS", lineOfBusiness: "Mobility", paymentMode: "Postpaid", accountType: "Consumer", accountSubType: "Individual", numberOfSubscribers: 1, geography: "SK", isActive: true },
    { accountId: "ACC014", msf: 140.75, tenure: 33, brand: "TELUS", lineOfBusiness: "Home Solution", paymentMode: "Postpaid", accountType: "Consumer", accountSubType: "Family", numberOfSubscribers: 3, geography: "MB", isActive: true },
    { accountId: "ACC015", msf: 50.00, tenure: 3, brand: "Public Mobile", lineOfBusiness: "Mobility", paymentMode: "Prepaid", accountType: "Consumer", accountSubType: "Individual", numberOfSubscribers: 1, geography: "NS", isActive: true },
    { accountId: "ACC016", msf: 350.00, tenure: 72, brand: "TELUS", lineOfBusiness: "Business", paymentMode: "Postpaid", accountType: "Business", accountSubType: "Enterprise", numberOfSubscribers: 15, geography: "ON", isActive: true },
    { accountId: "ACC017", msf: 90.25, tenure: 21, brand: "TELUS", lineOfBusiness: "Mobility", paymentMode: "Postpaid", accountType: "Consumer", accountSubType: "Individual", numberOfSubscribers: 2, geography: "BC", isActive: true },
    { accountId: "ACC018", msf: 160.50, tenure: 39, brand: "TELUS", lineOfBusiness: "Home Solution", paymentMode: "Postpaid", accountType: "Consumer", accountSubType: "Family", numberOfSubscribers: 4, geography: "AB", isActive: true },
    { accountId: "ACC019", msf: 60.00, tenure: 6, brand: "Koodo", lineOfBusiness: "Mobility", paymentMode: "Prepaid", accountType: "Consumer", accountSubType: "Individual", numberOfSubscribers: 1, geography: "ON", isActive: true },
    { accountId: "ACC020", msf: 275.00, tenure: 57, brand: "TELUS", lineOfBusiness: "Business", paymentMode: "Postpaid", accountType: "Business", accountSubType: "Medium Business", numberOfSubscribers: 9, geography: "QC", isActive: true },
    { accountId: "ACC021", msf: 75.50, tenure: 24, brand: "TELUS", lineOfBusiness: "Mobility", paymentMode: "Postpaid", accountType: "Consumer", accountSubType: "Individual", numberOfSubscribers: 1, geography: "BC", isActive: true},
    { accountId: "ACC022", msf: 120.75, tenure: 36, brand: "TELUS", lineOfBusiness: "Home Solution", paymentMode: "Postpaid", accountType: "Consumer", accountSubType: "Family", numberOfSubscribers: 3, geography: "ON", isActive: true},
    { accountId: "ACC023", msf: 45.00, tenure: 12, brand: "Koodo", lineOfBusiness: "Mobility", paymentMode: "Prepaid", accountType: "Consumer", accountSubType: "Individual", numberOfSubscribers: 1, geography: "AB", isActive: true },
    { accountId: "ACC024", msf: 200.00, tenure: 48, brand: "TELUS", lineOfBusiness: "Business", paymentMode: "Postpaid", accountType: "Business", accountSubType: "Small Business", numberOfSubscribers: 5, geography: "QC", isActive: true},
    { accountId: "ACC025", msf: 85.25, tenure: 18, brand: "TELUS", lineOfBusiness: "Mobility", paymentMode: "Postpaid", accountType: "Consumer", accountSubType: "Individual", numberOfSubscribers: 2, geography: "SK", isActive: true},
    { accountId: "ACC026", msf: 150.50, tenure: 30, brand: "TELUS", lineOfBusiness: "Home Solution", paymentMode: "Postpaid", accountType: "Consumer", accountSubType: "Family", numberOfSubscribers: 4, geography: "MB", isActive: true},
    { accountId: "ACC027", msf: 55.00, tenure: 6, brand: "Public Mobile", lineOfBusiness: "Mobility", paymentMode: "Prepaid", accountType: "Consumer", accountSubType: "Individual", numberOfSubscribers: 1, geography: "NS", isActive: true },
    { accountId: "ACC028", msf: 300.00, tenure: 60, brand: "TELUS", lineOfBusiness: "Business", paymentMode: "Postpaid", accountType: "Business", accountSubType: "Enterprise", numberOfSubscribers: 10, geography: "ON", isActive: true},
    { accountId: "ACC029", msf: 95.75, tenure: 24, brand: "TELUS", lineOfBusiness: "Mobility", paymentMode: "Postpaid", accountType: "Consumer", accountSubType: "Individual", numberOfSubscribers: 2, geography: "BC", isActive: true },
    { accountId: "ACC030", msf: 175.25, tenure: 42, brand: "TELUS", lineOfBusiness: "Home Solution", paymentMode: "Postpaid", accountType: "Consumer", accountSubType: "Family", numberOfSubscribers: 5, geography: "AB", isActive: true },
    { accountId: "ACC031", msf: 65.00, tenure: 9, brand: "Koodo", lineOfBusiness: "Mobility", paymentMode: "Prepaid", accountType: "Consumer", accountSubType: "Individual", numberOfSubscribers: 1, geography: "ON", isActive: true },
    { accountId: "ACC032", msf: 250.00, tenure: 54, brand: "TELUS", lineOfBusiness: "Business", paymentMode: "Postpaid", accountType: "Business", accountSubType: "Medium Business", numberOfSubscribers: 8, geography: "QC", isActive: true },
    { accountId: "ACC033", msf: 80.50, tenure: 15, brand: "TELUS", lineOfBusiness: "Mobility", paymentMode: "Postpaid", accountType: "Consumer", accountSubType: "Individual", numberOfSubscribers: 1, geography: "SK", isActive: true },
    { accountId: "ACC034", msf: 140.75, tenure: 33, brand: "TELUS", lineOfBusiness: "Home Solution", paymentMode: "Postpaid", accountType: "Consumer", accountSubType: "Family", numberOfSubscribers: 3, geography: "MB", isActive: true},
    { accountId: "ACC035", msf: 50.00, tenure: 3, brand: "Public Mobile", lineOfBusiness: "Mobility", paymentMode: "Prepaid", accountType: "Consumer", accountSubType: "Individual", numberOfSubscribers: 1, geography: "NS", isActive: true},
    { accountId: "ACC036", msf: 350.00, tenure: 72, brand: "TELUS", lineOfBusiness: "Business", paymentMode: "Postpaid", accountType: "Business", accountSubType: "Enterprise", numberOfSubscribers: 15, geography: "ON", isActive: true },
    { accountId: "ACC037", msf: 90.25, tenure: 21, brand: "TELUS", lineOfBusiness: "Mobility", paymentMode: "Postpaid", accountType: "Consumer", accountSubType: "Individual", numberOfSubscribers: 2, geography: "BC", isActive: true},
    { accountId: "ACC038", msf: 160.50, tenure: 39, brand: "TELUS", lineOfBusiness: "Home Solution", paymentMode: "Postpaid", accountType: "Consumer", accountSubType: "Family", numberOfSubscribers: 4, geography: "AB", isActive: true },
    { accountId: "ACC039", msf: 60.00, tenure: 6, brand: "Koodo", lineOfBusiness: "Mobility", paymentMode: "Prepaid", accountType: "Consumer", accountSubType: "Individual", numberOfSubscribers: 1, geography: "ON", isActive: true },
  
  ],
  churn_data: [
    { recommendedAction: "Offer Discount", churnReason: "Competitor Offer", predictedChurnDate: "2025-03-15", churnProbability: 0.85, churnScore: 8.5, isActive: true, msf: 75.50, numberOfSubscribers: 1, accountId: "ACC001", accountType: "Consumer", geography: "BC", accountSubType: "Individual", paymentMode: "Postpaid", lineOfBusiness: "Mobility", tenure: 24, brand: "TELUS" },
    { recommendedAction: "Service Review", churnReason: "Service Issues", predictedChurnDate: "2025-02-28", churnProbability: 0.75, churnScore: 7.8, isActive: true, msf: 120.75, numberOfSubscribers: 3, accountId: "ACC002", accountType: "Consumer", geography: "ON", accountSubType: "Family", paymentMode: "Postpaid", lineOfBusiness: "Home Solution", tenure: 36, brand: "TELUS" },
    { recommendedAction: "Retention Call", churnReason: "Moving", predictedChurnDate: "2025-04-10", churnProbability: 0.65, churnScore: 6.5, isActive: true, msf: 45.00, numberOfSubscribers: 1, accountId: "ACC003", accountType: "Consumer", geography: "AB", accountSubType: "Individual", paymentMode: "Prepaid", lineOfBusiness: "Mobility", tenure: 12, brand: "Koodo" },
    { recommendedAction: "Upgrade Offer", churnReason: "Financial Reasons", predictedChurnDate: "2025-03-22", churnProbability: 0.70, churnScore: 7.2, isActive: true, msf: 200.00, numberOfSubscribers: 5, accountId: "ACC004", accountType: "Business", geography: "QC", accountSubType: "Small Business", paymentMode: "Postpaid", lineOfBusiness: "Business", tenure: 48, brand: "TELUS" },
    { recommendedAction: "Service Review", churnReason: "Dissatisfaction", predictedChurnDate: "2025-05-05", churnProbability: 0.80, churnScore: 8.0, isActive: true, msf: 85.25, numberOfSubscribers: 2, accountId: "ACC005", accountType: "Consumer", geography: "SK", accountSubType: "Individual", paymentMode: "Postpaid", lineOfBusiness: "Mobility", tenure: 18, brand: "TELUS" },
    { recommendedAction: "Offer Discount", churnReason: "Competitor Offer", predictedChurnDate: "2025-04-18", churnProbability: 0.90, churnScore: 9.0, isActive: true, msf: 150.50, numberOfSubscribers: 4, accountId: "ACC006", accountType: "Consumer", geography: "MB", accountSubType: "Family", paymentMode: "Postpaid", lineOfBusiness: "Home Solution", tenure: 30, brand: "TELUS" },
    { recommendedAction: "Service Review", churnReason: "Service Issues", predictedChurnDate: "2025-03-30", churnProbability: 0.60, churnScore: 6.0, isActive: true, msf: 55.00, numberOfSubscribers: 1, accountId: "ACC007", accountType: "Consumer", geography: "NS", accountSubType: "Individual", paymentMode: "Prepaid", lineOfBusiness: "Mobility", tenure: 6, brand: "Public Mobile" },
    { recommendedAction: "Retention Call", churnReason: "Moving", predictedChurnDate: "2025-05-12", churnProbability: 0.55, churnScore: 5.5, isActive: true, msf: 300.00, numberOfSubscribers: 10, accountId: "ACC008", accountType: "Business", geography: "ON", accountSubType: "Enterprise", paymentMode: "Postpaid", lineOfBusiness: "Business", tenure: 60, brand: "TELUS" },
    { recommendedAction: "Payment Plan", churnReason: "Financial Reasons", predictedChurnDate: "2025-04-25", churnProbability: 0.75, churnScore: 7.5, isActive: true, msf: 95.75, numberOfSubscribers: 2, accountId: "ACC009", accountType: "Consumer", geography: "BC", accountSubType: "Individual", paymentMode: "Postpaid", lineOfBusiness: "Mobility", tenure: 24, brand: "TELUS" },
    { recommendedAction: "Service Review", churnReason: "Dissatisfaction", predictedChurnDate: "2025-06-01", churnProbability: 0.85, churnScore: 8.5, isActive: true, msf: 175.25, numberOfSubscribers: 5, accountId: "ACC010", accountType: "Consumer", geography: "AB", accountSubType: "Family", paymentMode: "Postpaid", lineOfBusiness: "Home Solution", tenure: 42, brand: "TELUS" },
    { recommendedAction: "Payment Plan", churnReason: "Non-Payment", predictedChurnDate: "2025-03-08", churnProbability: 0.95, churnScore: 9.5, isActive: true, msf: 65.00, numberOfSubscribers: 1, accountId: "ACC011", accountType: "Consumer", geography: "ON", accountSubType: "Individual", paymentMode: "Prepaid", lineOfBusiness: "Mobility", tenure: 9, brand: "Koodo" },
    { recommendedAction: "Fraud Investigation", churnReason: "Fraud", predictedChurnDate: "2025-02-20", churnProbability: 1.00, churnScore: 10.0, isActive: true, msf: 250.00, numberOfSubscribers: 8, accountId: "ACC012", accountType: "Business", geography: "QC", accountSubType: "Medium Business", paymentMode: "Postpaid", lineOfBusiness: "Business", tenure: 54, brand: "TELUS" },
    { recommendedAction: "Payment Plan", churnReason: "Non-Payment", predictedChurnDate: "2025-04-05", churnProbability: 0.80, churnScore: 8.0, isActive: true, msf: 80.50, numberOfSubscribers: 1, accountId: "ACC013", accountType: "Consumer", geography: "SK", accountSubType: "Individual", paymentMode: "Postpaid", lineOfBusiness: "Mobility", tenure: 15, brand: "TELUS" },
    { recommendedAction: "Fraud Investigation", churnReason: "Fraud", predictedChurnDate: "2025-03-17", churnProbability: 0.90, churnScore: 9.0, isActive: true, msf: 140.75, numberOfSubscribers: 3, accountId: "ACC014", accountType: "Consumer", geography: "MB", accountSubType: "Family", paymentMode: "Postpaid", lineOfBusiness: "Home Solution", tenure: 33, brand: "TELUS" },
    { recommendedAction: "Payment Plan", churnReason: "Non-Payment", predictedChurnDate: "2025-05-02", churnProbability: 0.70, churnScore: 7.0, isActive: true, msf: 50.00, numberOfSubscribers: 1, accountId: "ACC015", accountType: "Consumer", geography: "NS", accountSubType: "Individual", paymentMode: "Prepaid", lineOfBusiness: "Mobility", tenure: 3, brand: "Public Mobile" },
    { recommendedAction: "Fraud Investigation", churnReason: "Fraud", predictedChurnDate: "2025-04-14", churnProbability: 0.95, churnScore: 9.5, isActive: true, msf: 350.00, numberOfSubscribers: 15, accountId: "ACC016", accountType: "Business", geography: "ON", accountSubType: "Enterprise", paymentMode: "Postpaid", lineOfBusiness: "Business", tenure: 72, brand: "TELUS" },
    { recommendedAction: "Payment Plan", churnReason: "Non-Payment", predictedChurnDate: "2025-03-26", churnProbability: 0.75, churnScore: 7.5, isActive: true, msf: 90.25, numberOfSubscribers: 2, accountId: "ACC017", accountType: "Consumer", geography: "BC", accountSubType: "Individual", paymentMode: "Postpaid", lineOfBusiness: "Mobility", tenure: 21, brand: "TELUS" },
    { recommendedAction: "Fraud Investigation", churnReason: "Fraud", predictedChurnDate: "2025-05-08", churnProbability: 0.85, churnScore: 8.5, isActive: true, msf: 160.50, numberOfSubscribers: 4, accountId: "ACC018", accountType: "Consumer", geography: "AB", accountSubType: "Family", paymentMode: "Postpaid", lineOfBusiness: "Home Solution", tenure: 39, brand: "TELUS" },
    { recommendedAction: "Payment Plan", churnReason: "Non-Payment", predictedChurnDate: "2025-04-20", churnProbability: 0.65, churnScore: 6.5, isActive: true, msf: 60.00, numberOfSubscribers: 1, accountId: "ACC019", accountType: "Consumer", geography: "ON", accountSubType: "Individual", paymentMode: "Prepaid", lineOfBusiness: "Mobility", tenure: 6, brand: "Koodo" },
    { recommendedAction: "Fraud Investigation", churnReason: "Fraud", predictedChurnDate: "2025-06-03", churnProbability: 0.80, churnScore: 8.0, isActive: true, msf: 275.00, numberOfSubscribers: 9, accountId: "ACC020", accountType: "Business", geography: "QC", accountSubType: "Medium Business", paymentMode: "Postpaid", lineOfBusiness: "Business", tenure: 57, brand: "TELUS" }
  ]
};
