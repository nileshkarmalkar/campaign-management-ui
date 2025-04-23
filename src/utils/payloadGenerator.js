const formatDate = (date) => {
  if (!date) return null;
  if (date instanceof Date) return date.toISOString();
  return new Date(date).toISOString();
};

export const generatePayload = (type, data, user) => {
  // Create a copy of data to avoid modifying the original
  const processedData = { ...data };

  // Convert date fields to ISO strings
  if (processedData.deploymentDate) {
    processedData.deploymentDate = formatDate(processedData.deploymentDate);
  }
  if (processedData.deploymentEndDate) {
    processedData.deploymentEndDate = formatDate(processedData.deploymentEndDate);
  }
  if (processedData.startDate) {
    processedData.startDate = formatDate(processedData.startDate);
  }
  if (processedData.endDate) {
    processedData.endDate = formatDate(processedData.endDate);
  }

  const basePayload = {
    type,
    timestamp: new Date().toISOString(),
    action: data.id ? 'update' : 'create',
    user: {
      email: user.email,
      role: user.role
    }
  };

  switch (type) {
    case 'offer':
      return {
        ...basePayload,
        offerDetails: { ...processedData },
      };
    case 'trigger':
      return {
        ...basePayload,
        triggerDetails: { ...processedData },
      };
    case 'campaign':
      return {
        ...basePayload,
        campaignDetails: { ...processedData },
      };
    case 'segment':
      return {
        ...basePayload,
        segmentDetails: { ...processedData },
      };
    default:
      return { ...basePayload, data: processedData };
  }
};

export const logPayload = (payload) => {
  console.log('Generated Payload:', JSON.stringify(payload, null, 2));
};
