import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [triggers, setTriggers] = useState([]);
  const [segments, setSegments] = useState([]);

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
      getSegmentById
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
