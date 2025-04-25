import React, { createContext, useState, useContext, useEffect } from 'react';
import { sampleCampaigns, sampleTriggers, sampleSegments, sampleOfferMappings } from '../utils/sampleData';

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

  const addSegment = (segment) => {
    setSegments([...segments, { ...segment, id: Date.now() }]);
  };

  const updateSegment = (updatedSegment) => {
    setSegments(segments.map(segment =>
      segment.id === updatedSegment.id ? updatedSegment : segment
    ));
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

  const loadSampleData = () => {
    setCampaigns(sampleCampaigns);
    setTriggers(sampleTriggers);
    setSegments(sampleSegments);
    setSegmentOfferMappings(sampleOfferMappings);
    
    // Save to localStorage
    saveToLocalStorage('campaigns', sampleCampaigns);
    saveToLocalStorage('triggers', sampleTriggers);
    saveToLocalStorage('segments', sampleSegments);
    saveToLocalStorage('offerMappings', sampleOfferMappings);
  };

  return (
    <AppContext.Provider value={{ 
      campaigns, 
      triggers, 
      segments,
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
      loadSampleData,
      // Add setter functions
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
