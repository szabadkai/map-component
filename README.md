# Coordinate Visualizer Web Component

A TypeScript web component built with Lit.js for visualizing coordinates with pins and paths. Perfect for displaying maps, charts, diagrams, or any coordinate-based data.

## Features

- 📍 **Pin Visualization**: Display individual coordinates with customizable pins and optional labels
- 🛤️ **Path Rendering**: Connect coordinates with styled paths and lines
- 🎨 **Customizable Styling**: Full control over colors, sizes, and appearance via CSS custom properties
- 📱 **Responsive**: SVG-based rendering that scales smoothly
- 🖱️ **Interactive**: Hover tooltips showing coordinate information
- 📦 **TypeScript**: Fully typed with comprehensive interfaces
- ⚡ **Fast**: Built with Vite and esbuild for optimal performance

## Installation

```bash
npm install
npm run dev    # Start development server
npm run build  # Build for production
```

## Quick Start

```html
<!DOCTYPE html>
<html>
<head>
    <script type="module" src="./dist/coordinate-visualizer.js"></script>
</head>
<body>
    <coordinate-visualizer id="demo" width="400" height="300"></coordinate-visualizer>
    
    <script>
        const visualizer = document.getElementById('demo');
        visualizer.coordinates = [
            { x: 10, y: 20, label: "Point A" },
            { x: 50, y: 80, label: "Point B" }
        ];
    </script>
</body>
</html>
```

## API Reference

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `coordinates` | `Coordinate[]` | `[]` | Array of coordinates to display as pins |
| `paths` | `Path[]` | `[]` | Array of paths connecting coordinates |
| `width` | `number` | `400` | Width of the visualization |
| `height` | `number` | `300` | Height of the visualization |
| `minX` | `number \| null` | `null` | Minimum X value (auto-calculated if null) |
| `maxX` | `number \| null` | `null` | Maximum X value (auto-calculated if null) |
| `minY` | `number \| null` | `null` | Minimum Y value (auto-calculated if null) |
| `maxY` | `number \| null` | `null` | Maximum Y value (auto-calculated if null) |
| `padding` | `number` | `20` | Padding around the visualization |

### TypeScript Interfaces

#### `Coordinate`
```typescript
interface Coordinate {
  x: number;        // X coordinate
  y: number;        // Y coordinate
  label?: string;   // Optional label to display
}
```

#### `Path`
```typescript
interface Path {
  coordinates: Coordinate[];  // Array of coordinates to connect
  style?: PathStyle;         // Optional styling
}
```

#### `PathStyle`
```typescript
interface PathStyle {
  color?: string;   // Stroke color (CSS color value)
  width?: number;   // Stroke width in pixels
}
```

## Usage Examples

### Basic Pins

```javascript
const visualizer = document.querySelector('coordinate-visualizer');
visualizer.coordinates = [
  { x: 10, y: 20, label: "Start" },
  { x: 50, y: 80, label: "Middle" },
  { x: 90, y: 30, label: "End" }
];
```

### Paths with Custom Styling

```javascript
visualizer.paths = [
  {
    coordinates: [
      { x: 0, y: 0 },
      { x: 50, y: 50 },
      { x: 100, y: 25 }
    ],
    style: { color: "#e74c3c", width: 3 }
  }
];
```

### Combined Pins and Paths

```javascript
visualizer.coordinates = [
  { x: 0, y: 50, label: "Start" },
  { x: 100, y: 20, label: "End" }
];

visualizer.paths = [
  {
    coordinates: [
      { x: 0, y: 50 },
      { x: 25, y: 70 },
      { x: 75, y: 40 },
      { x: 100, y: 20 }
    ],
    style: { color: "#27ae60", width: 2 }
  }
];
```

### Setting Bounds

```javascript
// Manually set the coordinate system bounds
visualizer.minX = -100;
visualizer.maxX = 100;
visualizer.minY = -50;
visualizer.maxY = 50;
```

## Customization

### CSS Custom Properties

The component supports extensive customization via CSS custom properties:

```css
coordinate-visualizer {
  /* Pin styling */
  --pin-color: #e74c3c;           /* Default pin color */
  --pin-hover-color: #c0392b;     /* Pin color on hover */
  --pin-stroke: #fff;             /* Pin border color */
  
  /* Path styling */
  --path-color: #3498db;          /* Default path color */
  --path-width: 2;                /* Default path width */
  
  /* Background and borders */
  --background-color: #fff;       /* SVG background */
  --border-color: #ccc;           /* SVG border */
  
  /* Text styling */
  --font-family: Arial, sans-serif;
  --font-size: 12px;
  --text-color: #333;
  
  /* Tooltip styling */
  --tooltip-bg: rgba(0, 0, 0, 0.8);
  --tooltip-color: white;
}
```

### Custom Theme Example

```css
.custom-theme {
  --pin-color: #9b59b6;
  --pin-hover-color: #8e44ad;
  --path-color: #e67e22;
  --background-color: #ecf0f1;
  --border-color: #bdc3c7;
}
```

```html
<coordinate-visualizer class="custom-theme"></coordinate-visualizer>
```

## Interactive Features

- **Hover Tooltips**: Hover over pins to see coordinate information and labels
- **Responsive**: Automatically scales with container size when using percentage dimensions

## Development

### Project Structure

```
├── src/
│   └── coordinate-visualizer.ts    # Main component source
├── dist/                           # Built files
├── index.html                      # Demo page
├── package.json
├── tsconfig.json
├── vite.config.js
└── README.md
```

### Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Building

The component builds to both ES modules and UMD format:
- `dist/coordinate-visualizer.js` - ES module
- `dist/coordinate-visualizer.umd.cjs` - UMD format for broader compatibility

## Browser Support

- Modern browsers with ES2020 support
- Web Components support (or polyfill)
- SVG support

## License

MIT License

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Examples in Action

Open `index.html` in your browser to see comprehensive examples including:

- Basic pin visualization
- Path rendering with custom styles
- Combined pins and paths
- Custom themed components
- Large interactive demonstrations

The demo showcases various use cases from simple coordinate plotting to complex route visualization with multiple styled paths and interactive elements.