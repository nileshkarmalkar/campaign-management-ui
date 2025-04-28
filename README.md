# Campaign Management UI

A React-based web application for managing marketing campaigns, segments, triggers, and offer mappings. The application provides a streamlined workflow for creating and managing marketing campaigns across different channels.

## Features

### 1. Authentication and Authorization
- User authentication using TELUS SSO (Single Sign-On)
- Role-based access control with three user roles:
  - Read-only (Viewer)
  - Read-write (User)
  - Read-write-modify (Admin)
- Protected routes and components based on user permissions
- Secure API access with role-based restrictions

### 2. Campaign Management
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
- Dynamic segmentation with real-time data visualization
- Define segment criteria:
  - Brand selection (TELUS, Koodo)
  - Line of Business (Mobility, Home Solution, etc.)
  - Account types and sub-types
  - Geographic targeting
  - MSF (Monthly Service Fee) amount ranges
  - Number of subscribers
- Interactive filters with data distribution charts
- Real-time segment size estimation

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
- User action tracking in payloads:
  * Automatically includes user email and role
  * Tracks who created or modified each item
  * Maintains audit trail of changes

### 8. Campaign Workflow
- Guided workflow for campaign creation
- Step-by-step process:
  1. Create Campaign
  2. Define Segment
  3. Configure Triggers
  4. Map Offers
- Access control based on user roles and permissions

### 9. Data Persistence
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
- Authentication and authorization using custom hooks and context
- Protected routes using React Router

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

3. Configure environment variables:
   Create a `.env` file in the root directory and add the following:
   ```
   REACT_APP_TELUS_SSO_URL=https://your-telus-sso-url.com
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Build for production:
   ```bash
   npm run build
   ```

6. Deploy to GitHub Pages:
   ```bash
   npm run deploy
   ```

## Authentication

To use the application, you need to log in using your TELUS email address. The application uses a simple email-based authentication system with predefined user accounts:

- admin@telus.com (Admin role)
- user@telus.com (User role)
- viewer@telus.com (Viewer role)

### User Roles

1. **Viewer (Read-only)**: Can view all data but cannot make any changes.
2. **User (Read-write)**: Can view data and make changes to campaigns, segments, triggers, and offer mappings.
3. **Admin (Read-write-modify)**: Has full access to all features, including user management and system settings.

## Using Sample Data

To help you get started and test the functionality of the application, we've included a sample dataset. You can easily load this data into the application using the following steps:

1. Start the application and navigate to any page.
2. Look for the "Load Sample Data" button in the top-right corner of the screen.
3. Click the button to populate the application with sample campaigns, segments, triggers, communications, and offer mappings.

This sample data includes:
- Two sample campaigns (Summer 2025 Upgrade Promotion and Home Internet Bundle Offer)
- Two sample customer segments (High-Value Mobility Customers and Internet-Only Customers)
- Two sample triggers:
  * VULNERABLE_TRIGGER_EVENTS (monitoring device checkup, rate plans, and service terms)
  * ULTRA_HOT_TRIGGER (monitoring account unlinking, service cancellation events)
- Two sample communications (Summer Upgrade Email and Bundle Offer Direct Mail)
- Two sample offer mappings:
  * TC-BRP-Q12025-ROC-TIER1 for High-Value Mobility Customers
  * TC-BRP-Q13788-BC-TIER1 for Internet-Only Customers

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
- react-query (for API calls and caching)
- axios (for HTTP requests)
- Recharts (for data visualization)

## Project Structure

```
src/
├── assets/
├── components/
│   ├── auth/
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
│   ├── AppContext.js
│   └── AuthContext.js
├── hooks/
│   └── useAuth.js
├── utils/
│   ├── dayjsSetup.js
│   ├── payloadGenerator.js
│   └── api.js
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
