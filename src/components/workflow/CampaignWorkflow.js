import React, { useState } from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Box,
  Paper,
  StepContent,
  StepButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CampaignForm from '../campaigns/CampaignForm';
import SegmentForm from '../segments/SegmentForm';
import TriggerForm from '../triggers/TriggerForm';
import SegmentOfferMappingForm from '../segment-offer-mapping/SegmentOfferMappingForm';
import { useAppContext } from '../../context/AppContext';

const steps = [
  {
    label: 'Create Campaign',
    description: 'Set up your campaign details including name, description, and schedule.'
  },
  {
    label: 'Define Segment',
    description: 'Create a segment to target specific customers based on various criteria.'
  },
  {
    label: 'Configure Triggers',
    description: 'Set up triggers that will initiate campaign actions.'
  },
  {
    label: 'Map Offers',
    description: 'Associate offers with your segments for this campaign.'
  }
];

const TelусStepLabel = styled(StepLabel)(({ theme }) => ({
  '& .MuiStepLabel-label': {
    color: theme.palette.text.primary,
  },
  '& .MuiStepLabel-label.Mui-active': {
    color: theme.palette.primary.main,
  },
  '& .MuiStepLabel-label.Mui-completed': {
    color: theme.palette.secondary.main,
  },
}));

const TelусStepButton = styled(StepButton)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.background.paper,
  },
}));

const CampaignWorkflow = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const { 
    addCampaign, 
    addSegment, 
    addTrigger, 
    addSegmentOfferMapping,
    triggers,
    segments
  } = useAppContext();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleCampaignSubmit = (campaignData) => {
    addCampaign(campaignData);
    handleComplete();
  };

  const handleSegmentSubmit = (segmentData) => {
    addSegment(segmentData);
    handleComplete();
  };

  const handleTriggerSubmit = (triggerData) => {
    addTrigger(triggerData);
    handleComplete();
  };

  const handleMappingSubmit = (mappingData) => {
    addSegmentOfferMapping(mappingData);
    handleComplete();
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <CampaignForm 
            onSubmit={handleCampaignSubmit}
            onCancel={() => {}}
          />
        );
      case 1:
        return (
          <SegmentForm 
            onSubmit={handleSegmentSubmit}
            onCancel={() => {}}
            availableTriggers={triggers}
            availableSegments={segments}
          />
        );
      case 2:
        return (
          <TriggerForm 
            onSubmit={handleTriggerSubmit}
            onCancel={() => {}}
          />
        );
      case 3:
        return (
          <SegmentOfferMappingForm 
            onSubmit={handleMappingSubmit}
            onCancel={() => {}}
          />
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
        Campaign Setup Workflow
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Follow these steps to create and configure your campaign
      </Typography>
      
      <Stepper nonLinear activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label} completed={completed[index]}>
            <TelусStepButton onClick={handleStep(index)}>
              <TelусStepLabel>
                <Typography variant="subtitle1">{step.label}</Typography>
              </TelусStepLabel>
            </TelусStepButton>
            <StepContent>
              <Typography color="text.secondary" paragraph>
                {step.description}
              </Typography>
              <Paper sx={{ p: 3, bgcolor: 'background.paper' }}>
                {getStepContent(index)}
              </Paper>
              <Box sx={{ mb: 2, mt: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                    color="secondary"
                  >
                    {index === steps.length - 1 ? 'Finish' : 'Continue'}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1, color: 'primary.main' }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3, bgcolor: 'background.paper' }}>
          <Typography sx={{ color: 'secondary.main' }}>All steps completed - you&apos;re finished</Typography>
          <Button onClick={() => setActiveStep(0)} sx={{ mt: 1, mr: 1, color: 'primary.main' }}>
            Reset
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default CampaignWorkflow;
