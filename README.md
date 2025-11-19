# Bruno UI Mockup

A complete UI redesign mockup for Bruno API client.

## Project Structure

```
bruno-mockup/
├── index.html                    # Main HTML file
├── styles/                       # CSS styles organized by component
│   ├── base.css                  # Base styles and scrollbar
│   ├── topbar.css                # Top bar styles
│   ├── layout.css                # Main layout and content area
│   ├── sidebar.css               # Sidebar styles (collections, history)
│   ├── request.css               # Request panel styles
│   ├── response.css              # Response panel styles
│   ├── bottom-panel.css          # Bottom panel styles
│   └── responsive.css             # Responsive breakpoints and utilities
├── scripts/                      # JavaScript modules organized by functionality
│   ├── divider.js                # Draggable divider logic (request/response split)
│   ├── format.js                 # Format dropdown and preview toggle
│   ├── responsive.js             # Responsive tabs and layout management
│   ├── sidebar.js                # Sidebar resize, collapse, and tab switching
│   ├── bottom-panel.js           # Bottom panel resize logic
│   └── dropdowns.js              # Dropdown menu interactions
└── README.md                     # This file
```

## File Organization

### HTML (`index.html`)
- Contains the semantic HTML structure
- References external CSS and JavaScript files in logical order
- Clean and maintainable markup

### CSS (`styles/`)
Organized into logical component files:

- **base.css**: Base styles, reset, body, and scrollbar styling
- **topbar.css**: Top bar with logo, menu, collection name, and action buttons
- **layout.css**: Main layout structure and content area
- **sidebar.css**: Sidebar with collections list, history list, and navigation
- **request.css**: Request panel including URL bar, tabs, and code editor
- **response.css**: Response panel including header, tabs, format controls, and preview
- **bottom-panel.css**: Bottom panel with resizer and controls
- **responsive.css**: Responsive breakpoints and adaptive styles

### JavaScript (`scripts/`)
Organized into functional modules:

- **divider.js**: Handles draggable divider between request and response panels, including minimize/restore functionality
- **format.js**: Manages format selection (JSON, XML, etc.) and preview mode toggle
- **responsive.js**: Handles responsive behavior for tabs, manages overflow, and updates layout classes
- **sidebar.js**: Manages sidebar resize, collapse/expand, and tab switching (Collections/History)
- **bottom-panel.js**: Handles bottom panel resize functionality
- **dropdowns.js**: Manages all dropdown menu interactions for response tabs and controls

## Features

- **Modular Architecture**: Code is split into logical, maintainable modules
- **Component-Based CSS**: Styles are organized by UI component for easy navigation
- **Functional JavaScript**: JavaScript is split by functionality for better maintainability
- **Responsive Design**: Adaptive layouts that work across different screen sizes
- **Performance**: External files can be cached by browsers independently

## Usage

Simply open `index.html` in a web browser. All external resources will be loaded automatically in the correct order.

## Browser Compatibility

Works in all modern browsers that support:
- CSS Flexbox
- ES6 JavaScript
- ResizeObserver API

## Development

The codebase is organized to make it easy to:
- Locate specific functionality
- Modify individual components
- Add new features
- Maintain and debug

Each module is self-contained and can be modified independently, though some modules depend on functions exported to the `window` object for inter-module communication.
