import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [triggers, setTriggers] = useState([]);
  const [segments, setSegments] = useState([]);

  const addCampaign = (campaign) => {
    setCampaigns([...campaigns, { ...campaign, id: Date.now(), mappedTriggers: [] }]);
  };

  const updateCampaign = (updatedCampaign) => {
    setCampaigns(campaigns.map(campaign => 
      campaign.id === updatedCampaign.id ? updatedCampaign : campaign
    ));
  };

  const addTrigger = (trigger) => {
    setTriggers([...triggers, { ...trigger, id: Date.now(), mappedCampaignId: null }]);
  };

  const updateTrigger = (updatedTrigger) => {
    setTriggers(triggers.map(trigger =>
      trigger.id === updatedTrigger.id ? updatedTrigger : trigger
    ));
  };

  const mapTriggerToCampaign = (triggerId, campaignId) => {
    setTriggers(triggers.map(trigger =>
      trigger.id === triggerId ? { ...trigger, mappedCampaignId: campaignId } : trigger
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

  return (
    <AppContext.Provider value={{ 
      campaigns, 
      triggers, 
      segments,
      addCampaign, 
      updateCampaign, 
      addTrigger,
      updateTrigger,
      mapTriggerToCampaign,
      addSegment,
      updateSegment
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
