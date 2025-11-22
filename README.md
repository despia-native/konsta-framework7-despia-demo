# Despia Native SDK - Konsta UI React Kitchen Sink

This project is a complete Konsta UI React Kitchen Sink example with Konsta UI v5 configured.

## About

- **Framework**: React 19
- **UI Library**: Konsta UI v5.0.4
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite v7
- **Router**: React Router DOM v7

## Features

Konsta UI is a mobile UI components framework built with Tailwind CSS, designed to develop hybrid mobile apps, Web Native apps, or web apps with iOS & Android native look and feel.

This Kitchen Sink includes examples for all Konsta UI components:
- Action Sheets, Badges, Blocks, Breadcrumbs
- Buttons, Cards, Checkboxes, Chips
- Contacts Lists, Data Tables, Dialogs
- FABs, Form Inputs, Lists, Menu Lists
- Messagesbars, Messages, Navbars, Notifications
- Panels, Popovers, Popups, Preloaders
- Progressbars, Radios, Range Sliders, Searchbars
- Segmented Controls, Sheet Modals, Steppers
- Subnvabars, Tabbars, Toasts, Toggles, Toolbars

## Getting Started

### Development

Run the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

Build for production:

```bash
npm run build
```

### Preview

Preview the production build:

```bash
npm run preview
```

## Configuration

### Theme

The project is configured to support both iOS and Material Design themes. You can switch between themes using the query parameter:
- iOS: `?theme=ios` (default)
- Material: `?theme=material`

### Styling

The main CSS file is located at `styles/index.css` and includes:
- Roboto font from Google Fonts (for Material Design theme)
- Konsta UI React theme (`konsta/react/theme.css`)
- Tailwind CSS base styles
- Custom color theme variables

### Components

All Konsta UI components are imported from `konsta/react`:

```jsx
import { App, Page, Navbar, Block, Button } from 'konsta/react';
```

## Documentation

- [Konsta UI Documentation](https://konstaui.com/react)
- [Installation Guide](https://konstaui.com/react/installation)
- [Usage Guide](https://konstaui.com/react/usage)

## License

MIT

