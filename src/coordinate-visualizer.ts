import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
import * as L from "leaflet";

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

export interface GeoCoordinate {
    lat: number; // Latitude
    lng: number; // Longitude
    label?: string; // Optional label
    icon?: string; // Optional custom icon (emoji or SVG path)
    color?: string; // Optional custom marker color
}

export interface RouteStyle {
    color?: string; // Route color
    width?: number; // Route width
    dashed?: boolean; // Dashed line style
    opacity?: number; // Line opacity
}

export interface Route {
    coordinates: GeoCoordinate[];
    style?: RouteStyle;
    label?: string; // Route name/label
}

export class CoordinateVisualizer extends LitElement {
    @property({ type: Array })
    coordinates: GeoCoordinate[] = [];

    @property({ type: Array })
    routes: Route[] = [];

    @property({ type: Number })
    width: number = 800;

    @property({ type: Number })
    height: number = 600;

    @property({ type: String })
    mapStyle: "light" | "dark" | "satellite" = "light";

    private map: L.Map | null = null;
    private mapContainer: HTMLElement | null = null;
    private markers: L.Marker[] = [];
    private routePaths: L.Polyline[] = [];

    static styles = css`
        :host {
            display: block;
            width: 100%;
            height: 100%;
            border-radius: var(--map-border-radius, 12px);
            overflow: hidden;
            box-shadow: var(--map-shadow, 0 4px 20px rgba(0, 0, 0, 0.15));
        }

        .map-container {
            width: 100%;
            height: 100%;
        }

        /* Override Leaflet styles to match our design */
        :host .leaflet-container {
            font-family: var(
                --font-family,
                -apple-system,
                BlinkMacSystemFont,
                "Segoe UI",
                Roboto,
                sans-serif
            );
            border-radius: var(--map-border-radius, 12px);
        }

        :host .leaflet-popup-content-wrapper {
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        :host .leaflet-popup-content {
            margin: 10px 14px;
            font-size: 14px;
            line-height: 1.4;
        }
    `;

    // Override to create a div for Leaflet instead of using shadow DOM
    createRenderRoot() {
        return this;
    }

    firstUpdated() {
        console.log("CoordinateVisualizer first updated");
        this.initializeMap();
    }

    updated(changedProperties: Map<string, any>) {
        console.log("CoordinateVisualizer updated");

        if (
            changedProperties.has("coordinates") ||
            changedProperties.has("routes")
        ) {
            this.updateMapContent();
        }

        if (changedProperties.has("width") || changedProperties.has("height")) {
            this.resizeMap();
        }

        if (changedProperties.has("mapStyle")) {
            this.updateMapStyle();
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.map) {
            this.map.remove();
            this.map = null;
        }
    }

    initializeMap() {
        console.log("Initializing map");

        // Create map container if it doesn't exist
        if (!this.mapContainer) {
            this.mapContainer = document.createElement("div");
            this.mapContainer.className = "map-container";
            this.mapContainer.style.width = `${this.width}px`;
            this.mapContainer.style.height = `${this.height}px`;
            this.appendChild(this.mapContainer);
        }

        // Initialize Leaflet map
        if (!this.map && this.mapContainer) {
            this.map = L.map(this.mapContainer, {
                center: [0, 0],
                zoom: 2,
                attributionControl: true,
                zoomControl: true,
            });

            // Create a custom map style with prominent purple accent
            const purpleAccent = "rgb(163, 123, 251)";

            // Add a monochrome base map with purple tint
            L.tileLayer(
                "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
                {
                    attribution:
                        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                    subdomains: "abcd",
                    maxZoom: 19,
                }
            ).addTo(this.map);

            // Add a purple-colored water layer
            L.tileLayer(
                "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png",
                {
                    attribution:
                        '&copy; <a href="https://carto.com/attributions">CARTO</a>',
                    subdomains: "abcd",
                    maxZoom: 19,
                    opacity: 0.7,
                }
            ).addTo(this.map);

            // Apply purple-themed styling to the map
            const mapContainer = this.map.getContainer();
            mapContainer.style.background = "#f5f0ff"; // Light purple background

            // Add custom CSS for prominent purple styling
            const style = document.createElement("style");
            style.textContent = `
                .leaflet-container {
                    background: #f5f0ff !important;
                }
                .leaflet-tile-pane {
                    filter: grayscale(80%) sepia(20%) hue-rotate(230deg) !important;
                }
                .leaflet-overlay-pane path {
                    stroke: ${purpleAccent} !important;
                    stroke-width: 5px !important;
                }
                .leaflet-control-zoom {
                    border: none !important;
                    box-shadow: 0 2px 10px ${purpleAccent}80 !important;
                    border-radius: 8px !important;
                }
                .leaflet-control-zoom a {
                    background-color: ${purpleAccent} !important;
                    color: white !important;
                    border-color: ${purpleAccent} !important;
                    font-weight: bold !important;
                }
                .leaflet-control-zoom a:hover {
                    background-color: #a37bfb !important;
                    color: white !important;
                }
                .leaflet-control-attribution {
                    background-color: rgba(255, 255, 255, 0.7) !important;
                    font-size: 10px !important;
                    color: ${purpleAccent} !important;
                }
                .custom-marker-icon div {
                    background-color: ${purpleAccent} !important;
                    box-shadow: 0 2px 8px ${purpleAccent}80 !important;
                }
            `;
            document.head.appendChild(style);

            console.log("Map initialized");

            // Update map content
            this.updateMapContent();
        }
    }

    updateMapContent() {
        if (!this.map) return;
        console.log("Updating map content");

        // Clear existing markers and routes
        this.clearMapContent();

        // Add markers for coordinates
        this.addMarkers();

        // Add routes
        this.addRoutes();

        // Fit bounds if we have any content
        this.fitMapBounds();
    }

    clearMapContent() {
        // Remove markers
        this.markers.forEach((marker) => marker.remove());
        this.markers = [];

        // Remove routes
        this.routePaths.forEach((path) => path.remove());
        this.routePaths = [];
    }

    addMarkers() {
        if (!this.map) return;
        console.log("Adding markers:", this.coordinates.length);

        this.coordinates.forEach((coord, index) => {
            const markerColor = coord.color || "#ff4757";
            const icon = coord.icon || "📍";

            // Create custom icon with vibrant colors and funky design
            const customIcon = L.divIcon({
                html: `<div style="background-color: ${markerColor}; color: white; border-radius: 50%; width: 32px; height: 32px; display: flex; justify-content: center; align-items: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3); font-size: 16px; opacity: 0.95; border: 3px solid white;">${icon}</div>`,
                className: "custom-marker-icon",
                iconSize: [32, 32],
                iconAnchor: [16, 16],
            });

            // Create marker
            const marker = L.marker([coord.lat, coord.lng], {
                icon: customIcon,
            }).addTo(this.map!);

            // Add popup if label exists with monochrome styling
            if (coord.label) {
                marker.bindPopup(
                    `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; color: rgb(163, 123, 251); background: white; padding: 5px; border-radius: 8px; border: 1px solid rgba(163, 123, 251, 0.3);">
                        <div style="font-weight: bold; margin-bottom: 4px;">${
                            coord.label
                        }</div>
                        <div style="color: rgba(163, 123, 251, 0.7); font-size: 12px;">📍 ${coord.lat.toFixed(
                            4
                        )}°, ${coord.lng.toFixed(4)}°</div>
                    </div>`,
                    { closeButton: false }
                );
            }

            this.markers.push(marker);
            console.log(
                `Added marker ${index}: lat=${coord.lat}, lng=${coord.lng}`
            );
        });
    }

    addRoutes() {
        if (!this.map) return;
        console.log("Adding routes:", this.routes.length);

        this.routes.forEach((route, index) => {
            if (!route.coordinates || route.coordinates.length < 2) return;

            // Use vibrant colors for routes with thicker lines
            const style = route.style || {};
            const color = style.color || "#8a2be2"; // Vibrant purple
            const weight = style.width || 5; // Thicker lines
            const opacity = style.opacity || 0.8;
            const dashArray = style.dashed ? "10, 10" : undefined;

            // Create path
            const latLngs = route.coordinates.map(
                (coord) => [coord.lat, coord.lng] as L.LatLngExpression
            );
            const path = L.polyline(latLngs, {
                color,
                weight,
                opacity,
                dashArray,
            }).addTo(this.map!);

            // Add popup if label exists with funky styling
            if (route.label) {
                path.bindPopup(
                    `<div style="font-family: 'Comic Sans MS', cursive, sans-serif; font-size: 14px; color: #8a2be2; background: linear-gradient(135deg, #f0e6ff 0%, #e6f0ff 100%); padding: 5px; border-radius: 8px;">${route.label}</div>`
                );
            }

            this.routePaths.push(path);
            console.log(
                `Added route ${index} with ${route.coordinates.length} points`
            );
        });
    }

    fitMapBounds() {
        if (!this.map) return;

        // Collect all coordinates from markers and routes
        const allPoints: L.LatLngExpression[] = [];

        // Add marker coordinates
        this.coordinates.forEach((coord) => {
            allPoints.push([coord.lat, coord.lng]);
        });

        // Add route coordinates
        this.routes.forEach((route) => {
            if (route.coordinates) {
                route.coordinates.forEach((coord) => {
                    allPoints.push([coord.lat, coord.lng]);
                });
            }
        });

        // Fit bounds if we have points
        if (allPoints.length > 0) {
            console.log(
                "Fitting map to bounds with",
                allPoints.length,
                "points"
            );
            this.map.fitBounds(L.latLngBounds(allPoints), {
                padding: [30, 30],
                maxZoom: 10, // Lower max zoom for more minimalist view
            });
        }
    }

    resizeMap() {
        if (this.mapContainer) {
            this.mapContainer.style.width = `${this.width}px`;
            this.mapContainer.style.height = `${this.height}px`;
        }

        if (this.map) {
            this.map.invalidateSize();
        }
    }

    updateMapStyle() {
        // Could implement different map styles here using different tile layers
        console.log("Map style updated to:", this.mapStyle);
    }

    render() {
        console.log("Rendering CoordinateVisualizer");
        return html`<div class="map-container"></div>`;
    }
}

customElements.define("coordinate-visualizer", CoordinateVisualizer);
console.log("CoordinateVisualizer defined");
