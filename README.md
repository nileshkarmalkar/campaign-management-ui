# Campaign Management UI

A React-based web application for managing marketing campaigns, segments, triggers, and offer mappings. The application provides a streamlined workflow for creating and managing marketing campaigns across different channels.

## Features

### 1. Campaign Management
- Create and manage marketing campaigns
- Set deployment dates and end dates
- Define campaign metadata:
  - Campaign name and code
  - Business unit and campaign type
  - Target bases and segments per base
  - Medium/channels (Email, SMS, Direct Mail, etc.)
  - Marcomm Prime information

### 2. Segment Management
- Create and manage customer segments
- Define segment criteria:
  - Brand selection (TELUS, Koodo)
  - Line of Business (Mobility, Home Solution, etc.)
  - Account types and sub-types
  - Geographic targeting
  - MSF (Monthly Service Fee) amount ranges
  - Number of subscribers

### 3. Trigger Management
- Set up and manage campaign triggers
- Define trigger conditions and rules
- Link triggers to segments and campaigns

### 4. Communications Management
- Configure communication templates and content
- Set up email, SMS, and direct mail communications
- Define communication schedules and frequencies
- Track communication status and history

### 5. Segment-Offer Mapping
- Map segments to specific offers
- Set validity periods for offers
- Track mapping status (Created, Live, Sunset)
- Manage offer deployment schedules

### 6. Payload Generation & Viewing
- Generate standardized JSON payloads for campaign data
- Real-time payload preview and validation
- Export payload data for external systems
- Track payload version history

### 7. Campaign Workflow
- Guided workflow for campaign creation
- Step-by-step process:
  1. Create Campaign
  2. Define Segment
  3. Configure Triggers
  4. Map Offers

### 8. Data Persistence
- All data is automatically saved to browser's localStorage
- Data persists across page refreshes and browser sessions
- Clear All Data functionality for testing and reset

## Technical Features

- Built with React 18 and Material-UI v5
- Responsive design for desktop and mobile
- Component-based architecture
- Context API for state management
- Custom hooks for business logic
- Payload generation utilities
- Date handling with @mui/x-date-pickers
- Form validation and error handling
- Search and filter capabilities
- Card-based UI for better data visualization

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/campaign-management-ui.git
   ```

2. Install dependencies:
   ```bash
   cd campaign-management-ui
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Build for production:
   ```bash
   npm run build
   ```

5. Deploy to GitHub Pages:
   ```bash
   npm run deploy
   ```

## Using Sample Data

To help you get started and test the functionality of the application, we've included a sample dataset. You can easily load this data into the application using the following steps:

1. Start the application and navigate to any page.
2. Look for the "Load Sample Data" button in the top-right corner of the screen.
3. Click the button to populate the application with sample campaigns, segments, triggers, communications, and offer mappings.

This sample data includes:
- Two sample campaigns
- Two sample customer segments
- Two sample triggers
- Two sample communications
- Two sample offer mappings

You can use this data to explore the various features of the application, including the campaign workflow, segment creation, trigger setup, and offer mapping.

To clear all data and start fresh:
1. Click the "Clear All Data" button in the top-right corner of the screen.
2. This will remove all data from the application, including any sample data or data you've entered manually.

Note: The sample data is stored in your browser's local storage. It will persist across page refreshes but will be cleared if you clear your browser data.

## Dependencies

- React
- Material-UI (@mui/material)
- @mui/x-date-pickers
- date-fns
- react-router-dom
- gh-pages (for deployment)

## Project Structure

```
src/
├── assets/
├── components/
│   ├── campaigns/
│   ├── communications/
│   ├── common/
│   ├── layout/
│   ├── offers/
│   ├── segments/
│   ├── segment-offer-mapping/
│   ├── triggers/
│   └── workflow/
├── context/
│   └── AppContext.js
├── utils/
│   ├── dayjsSetup.js
│   └── payloadGenerator.js
├── App.js
└── index.js
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
