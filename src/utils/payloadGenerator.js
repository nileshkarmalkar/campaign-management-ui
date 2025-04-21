export const generatePayload = (type, data) => {
  const basePayload = {
    type,
    timestamp: new Date().toISOString(),
    action: data.id ? 'update' : 'create',
  };

  switch (type) {
    case 'offer':
      return {
        ...basePayload,
        offerDetails: { ...data },
      };
    case 'trigger':
      return {
        ...basePayload,
        triggerDetails: { ...data },
      };
    case 'campaign':
      return {
        ...basePayload,
        campaignDetails: { ...data },
      };
    case 'segment':
      return {
        ...basePayload,
        segmentDetails: { ...data },
      };
    default:
      return { ...basePayload, data };
  }
};

export const logPayload = (payload) => {
  console.log('Generated Payload:', JSON.stringify(payload, null, 2));
};
