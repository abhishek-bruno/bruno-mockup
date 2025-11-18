# Bruno UI Mockup

A complete UI redesign mockup for Bruno API client.

## Project Structure

```
mockup-bruno/
├── bruno-complete-mockup.html  # Main HTML file
├── styles/
│   └── main.css                 # All CSS styles organized by sections
├── scripts/
│   └── main.js                  # All JavaScript functionality
└── README.md                    # This file
```

## File Organization

### HTML (`bruno-complete-mockup.html`)
- Contains the semantic HTML structure
- References external CSS and JavaScript files
- Clean and maintainable markup

### CSS (`styles/main.css`)
Organized into logical sections:
- Base Styles
- Top Bar
- Main Layout
- Sidebar
- Content Area
- Request Tabs
- Request/Response Split
- Request URL Bar
- Request Tabs Panel
- Responsive Request Tabs
- Code Editor
- Response Panel Header
- Responsive Response Header
- Response Tree View
- Preview Container
- Scrollbar Styling

### JavaScript (`scripts/main.js`)
Organized into functional modules:
- Draggable Divider Logic
- Preview Toggle Logic
- Responsive Tabs Logic

## Features

- **Code Splitting**: CSS and JavaScript are separated from HTML
- **Modular Organization**: Code is organized into logical sections
- **Maintainability**: Easy to locate and modify specific functionality
- **Performance**: External files can be cached by browsers

## Usage

Simply open `bruno-complete-mockup.html` in a web browser. All external resources will be loaded automatically.

## Browser Compatibility

Works in all modern browsers that support:
- CSS Flexbox
- ES6 JavaScript
- ResizeObserver API

