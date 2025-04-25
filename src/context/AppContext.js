import React, { createContext, useState, useContext, useEffect } from 'react';
import dataService from '../services/bigquery';

const AppContext = createContext();

const loadFromLocalStorage = (key, defaultValue) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const saveToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

export const AppProvider = ({ children }) => {
  const [campaigns, setCampaigns] = useState(() => loadFromLocalStorage('campaigns', []));
  const [triggers, setTriggers] = useState(() => loadFromLocalStorage('triggers', []));
  const [segments, setSegments] = useState(() => loadFromLocalStorage('segments', []));
  const [segmentOfferMappings, setSegmentOfferMappings] = useState(() => loadFromLocalStorage('offerMappings', []));
  const [customerData, setCustomerData] = useState([]);
  const [isBigQueryInitialized, setIsBigQueryInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeBigQuery = async () => {
      try {
        // Initialize BigQuery
        await dataService.initialize('aipp-tmf680-orch-dev-a613e8', 'camp_mgmt');
        
        // Set the current table
        await dataService.setCurrentTable('customer_data');
        
        // Fetch initial customer data
        const data = await dataService.getCustomerData();
        setCustomerData(data);
        
        setIsBigQueryInitialized(true);
      } catch (err) {
        console.error('Error initializing BigQuery:', err);
        setError('Failed to initialize BigQuery. Some features may not work properly.');
      }
    };

    initializeBigQuery();
  }, []);

  useEffect(() => {
    saveToLocalStorage('campaigns', campaigns);
  }, [campaigns]);

  useEffect(() => {
    saveToLocalStorage('triggers', triggers);
  }, [triggers]);

  useEffect(() => {
    saveToLocalStorage('segments', segments);
  }, [segments]);

  useEffect(() => {
    saveToLocalStorage('offerMappings', segmentOfferMappings);
  }, [segmentOfferMappings]);

  const addCampaign = (campaign) => {
    setCampaigns([...campaigns, { ...campaign, id: Date.now() }]);
  };

  const updateCampaign = (updatedCampaign) => {
    setCampaigns(campaigns.map(campaign => 
      campaign.id === updatedCampaign.id ? updatedCampaign : campaign
    ));
  };

  const addTrigger = (trigger) => {
    setTriggers([...triggers, { ...trigger, id: Date.now() }]);
  };

  const updateTrigger = (updatedTrigger) => {
    setTriggers(triggers.map(trigger =>
      trigger.id === updatedTrigger.id ? updatedTrigger : trigger
    ));
  };

  const addSegment = async (segment) => {
    if (!isBigQueryInitialized) {
      throw new Error('BigQuery is not initialized. Please try again later.');
    }
    setIsLoading(true);
    try {
      let filteredAccounts = [];
      if (segment.filters && segment.filters.root.conditions.length > 0) {
        const query = buildBigQueryFilter(segment.filters);
        const result = await dataService.executeQuery(query);
        filteredAccounts = result;
      }

      const newSegment = {
        ...segment,
        id: Date.now(),
        filteredAccounts
      };

      setSegments([...segments, newSegment]);
      return newSegment;
    } catch (error) {
      console.error('Error creating segment:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSegment = async (updatedSegment) => {
    if (!isBigQueryInitialized) {
      throw new Error('BigQuery is not initialized. Please try again later.');
    }
    setIsLoading(true);
    try {
      if (updatedSegment.filters && updatedSegment.filters.root.conditions.length > 0) {
        const query = buildBigQueryFilter(updatedSegment.filters);
        const result = await dataService.executeQuery(query);
        updatedSegment.filteredAccounts = result;
      }

      setSegments(segments.map(segment =>
        segment.id === updatedSegment.id ? updatedSegment : segment
      ));
    } catch (error) {
      console.error('Error updating segment:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const buildBigQueryFilter = (filters) => {
    const conditions = filters.root.conditions.map(condition => {
      const { field, operator, value } = condition;
      switch (operator) {
        case '=':
          return `${field} = '${value}'`;
        case '!=':
          return `${field} != '${value}'`;
        case '>':
          return `${field} > ${value}`;
        case '>=':
          return `${field} >= ${value}`;
        case '<':
          return `${field} < ${value}`;
        case '<=':
          return `${field} <= ${value}`;
        case 'between':
          return `${field} BETWEEN ${value[0]} AND ${value[1]}`;
        case 'contains':
          return `CONTAINS(${field}, '${value}')`;
        case 'not_contains':
          return `NOT CONTAINS(${field}, '${value}')`;
        case 'in':
          return `${field} IN (${value.map(v => `'${v}'`).join(', ')})`;
        case 'not_in':
          return `${field} NOT IN (${value.map(v => `'${v}'`).join(', ')})`;
        default:
          return '';
      }
    }).filter(Boolean);

    const whereClause = conditions.join(
      filters.root.operator === 'AND' ? ' AND ' : ' OR '
    );

    return `SELECT * FROM \`aipp-tmf680-orch-dev-a613e8.camp_mgmt.customer_data\` WHERE ${whereClause}`;
  };

  const getSegmentById = (id) => {
    return segments.find(segment => segment.id === id);
  };

  const addSegmentOfferMapping = (mapping) => {
    setSegmentOfferMappings([...segmentOfferMappings, { ...mapping, id: Date.now() }]);
  };

  const updateSegmentOfferMapping = (updatedMapping) => {
    setSegmentOfferMappings(segmentOfferMappings.map(mapping =>
      mapping.id === updatedMapping.id ? updatedMapping : mapping
    ));
  };

  const clearAllData = () => {
    setCampaigns([]);
    setTriggers([]);
    setSegments([]);
    setSegmentOfferMappings([]);
    localStorage.removeItem('campaigns');
    localStorage.removeItem('triggers');
    localStorage.removeItem('segments');
    localStorage.removeItem('offerMappings');
  };

  return (
    <AppContext.Provider value={{ 
      campaigns, 
      triggers, 
      segments,
      customerData,
      isBigQueryInitialized,
      isLoading,
      error,
      addCampaign, 
      updateCampaign, 
      addTrigger,
      updateTrigger,
      addSegment,
      updateSegment,
      getSegmentById,
      segmentOfferMappings,
      addSegmentOfferMapping,
      updateSegmentOfferMapping,
      clearAllData,
      setCampaigns,
      setTriggers,
      setSegments,
      setSegmentOfferMappings
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

export { loadFromLocalStorage };
