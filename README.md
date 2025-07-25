# Geographic Map Visualizer Web Component

A customizable web component for visualizing geographic coordinates with markers and routes, built with TypeScript, Lit, and Leaflet.

## Features

-   Display location markers with custom icons and colors
-   Connect locations with stylized routes
-   Fully customizable appearance with CSS custom properties
-   Responsive design that works across devices
-   Monochrome design with rgb(163, 123, 251) purple accent color

## Screenshots

### Location Markers (San Francisco Bay Area)

![San Francisco Bay Area Map](screenshots/sf-bay-area.png)

_Display geographic locations with custom icons and colors_

### Travel Routes (European Cities)

![European Cities Map](screenshots/european-cities.png)

_Connect cities with stylized routes and labels_

### Combined Map View (California Coast)

![California Coast Map](screenshots/california-coast.png)

_Show both markers and routes together_

## Installation

```bash
npm install coordinate-visualizer
```

## Usage

```html
<!-- Import the component -->
<script
    type="module"
    src="./node_modules/coordinate-visualizer/dist/coordinate-visualizer.js"
></script>

<!-- Use the component -->
<coordinate-visualizer
    id="map"
    width="800"
    height="600"
></coordinate-visualizer>

<script>
    // Get reference to the component
    const map = document.getElementById("map");

    // Set coordinates
    map.coordinates = [
        {
            lat: 37.7749,
            lng: -122.4194,
            label: "San Francisco",
            icon: "🏙️",
            color: "#e74c3c",
        },
        {
            lat: 37.4419,
            lng: -122.143,
            label: "Palo Alto",
            icon: "🏢",
            color: "#3498db",
        },
    ];

    // Set routes
    map.routes = [
        {
            coordinates: [
                { lat: 37.7749, lng: -122.4194 },
                { lat: 37.4419, lng: -122.143 },
            ],
            style: { color: "rgb(163, 123, 251)", width: 5, opacity: 0.8 },
            label: "SF to Palo Alto",
        },
    ];
</script>
```

## Customization

The component can be customized using CSS custom properties:

```css
coordinate-visualizer {
    --map-border-radius: 12px;
    --map-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}
```

## Development

### Prerequisites

-   Node.js (v14 or later)
-   npm (v6 or later)

### Setup

1. Clone the repository
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the development server:
    ```bash
    npm run dev
    ```

## License

MIT

## Assets Directory

The project includes the following assets:

### Screenshots

The `assets/images` directory contains screenshots of the map visualizations:

-   `sf-bay-area.png` - San Francisco Bay Area map with location markers
-   `european-cities.png` - European cities map with travel routes
-   `california-coast.png` - California coast map with combined markers and routes

These screenshots showcase the monochrome design with the rgb(163, 123, 251) purple accent color that has been implemented throughout the application.
