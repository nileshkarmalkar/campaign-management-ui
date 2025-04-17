import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [triggers, setTriggers] = useState([]);

  const addCampaign = (campaign) => {
    setCampaigns([...campaigns, { ...campaign, id: Date.now(), mappedTriggers: [] }]);
  };

  const updateCampaign = (updatedCampaign) => {
    setCampaigns(campaigns.map(campaign => 
      campaign.id === updatedCampaign.id ? updatedCampaign : campaign
    ));
  };

  const addTrigger = (trigger) => {
    setTriggers([...triggers, { ...trigger, id: Date.now() }]);
  };

  return (
    <AppContext.Provider value={{ campaigns, triggers, addCampaign, updateCampaign, addTrigger }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
