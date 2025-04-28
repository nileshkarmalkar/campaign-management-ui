import React, { createContext, useState, useContext, useEffect } from 'react';
import dataService from '../services/bigquery.ts';

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
  const [availableTables, setAvailableTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [segmentOfferMappings, setSegmentOfferMappings] = useState(() => loadFromLocalStorage('offerMappings', []));
  const [customerData, setCustomerData] = useState([]);
  const [isBigQueryInitialized, setIsBigQueryInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize with empty arrays if BigQuery fails
  useEffect(() => {
    if (!segments || !Array.isArray(segments)) {
      setSegments([]);
    }
  }, [segments]);

  // Initialize BigQuery service and set up periodic data refresh
  useEffect(() => {
    const initializeBigQuery = async () => {
      try {
        const projectId = window._env_?.REACT_APP_BQ_PROJECT_ID || process.env.REACT_APP_BQ_PROJECT_ID || 'aipp-tmf680-orch-dev-a613e8';
        const datasetId = window._env_?.REACT_APP_BQ_DATASET_ID || process.env.REACT_APP_BQ_DATASET_ID || 'camp_mgmt';
        
        if (!projectId || !datasetId) {
          console.error('BigQuery project ID or dataset ID not found in environment variables');
          return;
        }

        await dataService.initialize(projectId, datasetId);
        console.log('BigQuery service initialized successfully');
        
        // Load available tables
        const tables = await dataService.listTables();
        if (tables && Array.isArray(tables)) {
          setAvailableTables(tables);
          if (tables.length > 0) {
            // Set default table and load its data
            const defaultTable = 'customer_data';
            setSelectedTable(defaultTable);
            await loadTableData(defaultTable);
          }
        }
        
        setIsBigQueryInitialized(true);
      } catch (error) {
        console.error('Failed to initialize BigQuery service:', error);
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

  const loadTableData = async (tableName) => {
    try {
      if (!tableName) {
        setCustomerData([]);
        return;
      }

      const result = await dataService.getTableData(tableName);
      if (result.success) {
        setCustomerData(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch table data');
      }
    } catch (error) {
      console.error('Failed to load data from BigQuery:', error);
      setError(error.message);
      setCustomerData([]);
    }
  };

  const handleTableSelect = async (tableName) => {
    setSelectedTable(tableName);
    await loadTableData(tableName);
  };

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

    return `SELECT * FROM \`${selectedTable}\` WHERE ${whereClause}`;
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
      availableTables,
      selectedTable,
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
      handleTableSelect,
      setCampaigns,
      setTriggers,
      setSegments,
      setSegmentOfferMappings,
      setError
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

export { loadFromLocalStorage };
