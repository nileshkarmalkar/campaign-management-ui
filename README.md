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

### 4. Segment-Offer Mapping
- Map segments to specific offers
- Set validity periods for offers
- Track mapping status (Created, Live, Sunset)
- Manage offer deployment schedules

### 5. Campaign Workflow
- Guided workflow for campaign creation
- Step-by-step process:
  1. Create Campaign
  2. Define Segment
  3. Configure Triggers
  4. Map Offers

### 6. Data Persistence
- All data is automatically saved to browser's localStorage
- Data persists across page refreshes and browser sessions
- Clear All Data functionality for testing and reset

## Technical Features

- Built with React and Material-UI
- Responsive design for desktop and mobile
- Component-based architecture
- Context API for state management
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
├── components/
│   ├── campaigns/
│   ├── segments/
│   ├── triggers/
│   ├── segment-offer-mapping/
│   ├── workflow/
│   └── layout/
├── context/
│   └── AppContext.js
├── utils/
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
