# Theme Configuration

The application supports two themes:
1. TELUS branding theme
2. Generic demo theme

## Switching Themes

The theme can be controlled via the `REACT_APP_USE_TELUS_BRANDING` environment variable in `public/env.js`:

```javascript
window._env_ = {
  // ... other env vars
  REACT_APP_USE_TELUS_BRANDING: 'true' // Set to 'false' for generic theme
};
```

## Theme Features

### TELUS Theme
- TELUS purple primary color (#4B286D)
- TELUS green secondary color (#2B8000)
- TELUS logo in header
- TELUS typography (Helvetica Neue)
- TELUS-specific color palette

### Generic Theme
- Material UI blue primary color (#1976d2)
- Material UI purple secondary color (#9c27b0)
- No logo in header
- Standard Material UI typography (Roboto)
- Standard Material UI color palette

## Implementation Details

The theming system is implemented using:
1. `ThemeContext.js` - Manages theme state and provides theme switching
2. Material UI's ThemeProvider - Applies the selected theme
3. Environment variable - Controls which theme is active

## Usage in Components

Components can access the current theme configuration using the `useTheme` hook:

```javascript
import { useTheme } from '../../context/ThemeContext';

const MyComponent = () => {
  const { useBranding } = useTheme();
  
  return (
    <div>
      {useBranding ? 'TELUS Theme' : 'Generic Theme'}
    </div>
  );
};
```

## Adding New Theme Elements

When adding new themed elements:
1. Add the element to both theme configurations in `ThemeContext.js`
2. Use Material UI's theme system for consistent styling
3. Test the element in both themes
