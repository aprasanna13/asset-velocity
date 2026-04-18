// src/features/topology/components/GeographicTopologyView.tsx
import React, { useRef, useEffect } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { PipelineNode, ScadaData } from '../../../types'; // Correct relative path

interface GeographicTopologyViewProps {
    nodes: PipelineNode[];
    alerts: ScadaData[];
}

// Custom OverlayView interface to satisfy TypeScript
interface CustomOverlayView extends google.maps.OverlayView {
    canvas?: HTMLCanvasElement;
}

const MapComponent: React.FC<GeographicTopologyViewProps> = ({ nodes, alerts }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            const map = new window.google.maps.Map(ref.current, {
                center: { lat: 31.0, lng: -100.0 }, // Center of Texas
                zoom: 6,
                styles: [
                    { "elementType": "geometry", "stylers": [{ "color": "#212121" }] },
                    { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
                    { "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
                    { "elementType": "labels.text.stroke", "stylers": [{ "color": "#212121" }] },
                    { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "color": "#757575" }] },
                    { "featureType": "poi", "stylers": [{ "visibility": "off" }] },
                    { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#3c3c3c" }] },
                    { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#8a8a8a" }] },
                    { "featureType": "transit", "stylers": [{ "visibility": "off" }] },
                    { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000000" }] }
                ],
                tilt: 0,
                rotateControl: false,
                mapTypeControl: false,
                streetViewControl: false,
            });

            // Mock Data from cr_googlemaps.md
            const mockNodes = [
                { id: "node_1", name: "Midland Station", lat: 31.9973, lng: -102.0779 },
                { id: "node_2", name: "Odessa Station", lat: 31.8457, lng: -102.3677 },
                { id: "node_3", name: "San Angelo Hub", lat: 31.4638, lng: -100.4370 },
                { id: "node_4", name: "Houston Terminal", lat: 29.7604, lng: -95.3698 }
            ];

            // Add nodes to map (native markers for interaction)
            mockNodes.forEach(node => {
                const marker = new window.google.maps.Marker({
                    position: { lat: node.lat, lng: node.lng },
                    map: map,
                    title: node.name,
                    icon: {
                        path: window.google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: "#10b981",
                        fillOpacity: 1,
                        strokeColor: "#ffffff",
                        strokeWeight: 2,
                    }
                });

                // Add InfoWindow for click interaction
                const infoWindow = new window.google.maps.InfoWindow({
                    content: `<div style="color: #000; padding: 10px;">
                                <h3 style="margin: 0 0 5px 0; font-weight: bold;">${node.name}</h3>
                                <p style="margin: 0; font-size: 12px;">ID: ${node.id}</p>
                                <p style="margin: 0; font-size: 12px;">Status: Optimal</p>
                              </div>`
                });

                marker.addListener('click', () => {
                    infoWindow.open(map, marker);
                });
            });

            // Add paths (native polylines for interaction)
            const paths = [
                [mockNodes[0], mockNodes[1]],
                [mockNodes[1], mockNodes[2]],
                [mockNodes[2], mockNodes[3]]
            ];

            paths.forEach(path => {
                new window.google.maps.Polyline({
                    path: path.map(n => ({ lat: n.lat, lng: n.lng })),
                    map: map,
                    strokeColor: "#3b82f6",
                    strokeOpacity: 0.3, // Made slightly visible to help debug
                    strokeWeight: 4,
                });
            });

            // Custom Overlay for Canvas
            const overlay: CustomOverlayView = new window.google.maps.OverlayView();
            
            overlay.onAdd = function() {
                const canvas = document.createElement('canvas');
                canvas.style.position = 'absolute';
                canvas.style.top = '0';
                canvas.style.left = '0';
                canvas.style.pointerEvents = 'none';
                canvas.style.zIndex = '1000'; // Ensure it's above the map
                this.canvas = canvas;
                const panes = this.getPanes();
                if (panes) {
                    panes.overlayLayer.appendChild(canvas); // Use overlayLayer but with zIndex
                }
            };

            overlay.draw = function() {
                const canvas = this.canvas;
                if (!canvas) return;
                
                const projection = this.getProjection();
                if (!projection) return;
                
                const div = map.getDiv();
                canvas.width = div.clientWidth;
                canvas.height = div.clientHeight;
                
                const ctx = canvas.getContext('2d');
                if (!ctx) return;
                
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Draw flow animations
                ctx.strokeStyle = '#3b82f6';
                ctx.lineWidth = 4;
                ctx.setLineDash([10, 2]);
                ctx.lineDashOffset = -Date.now() / 50 % 12;
                
                paths.forEach(path => {
                    const p1 = projection.fromLatLngToContainerPixel(new window.google.maps.LatLng(path[0].lat, path[0].lng));
                    const p2 = projection.fromLatLngToContainerPixel(new window.google.maps.LatLng(path[1].lat, path[1].lng));
                    
                    // Check if points are valid and finite
                    if (p1 && p2 && isFinite(p1.x) && isFinite(p1.y) && isFinite(p2.x) && isFinite(p2.y)) {
                        const minX = Math.min(p1.x, p2.x);
                        const maxX = Math.max(p1.x, p2.x);
                        const minY = Math.min(p1.y, p2.y);
                        const maxY = Math.max(p1.y, p2.y);

                        // Skip drawing if the line segment is completely off-screen
                        const isOffScreen = maxX < 0 || minX > canvas.width || maxY < 0 || minY > canvas.height;
                        
                        // Also skip if coordinates are extremely large (potential projection artifacts)
                        const isTooLarge = Math.abs(p1.x) > 5000 || Math.abs(p1.y) > 5000 || Math.abs(p2.x) > 5000 || Math.abs(p2.y) > 5000;

                        if (!isOffScreen && !isTooLarge) {
                            ctx.beginPath();
                            ctx.moveTo(p1.x, p1.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.stroke();
                        }
                    }
                });
                
                ctx.setLineDash([]);
            };

            overlay.onRemove = function() {
                if (this.canvas && this.canvas.parentNode) {
                    this.canvas.parentNode.removeChild(this.canvas);
                }
                this.canvas = undefined;
            };

            overlay.setMap(map);

            let animationFrame: number;
            const renderLoop = () => {
                overlay.draw();
                animationFrame = requestAnimationFrame(renderLoop);
            };
            animationFrame = requestAnimationFrame(renderLoop);

            return () => {
                cancelAnimationFrame(animationFrame);
                overlay.setMap(null);
            };
        }
    }, []);

    return <div ref={ref} style={{ width: '100%', height: '100%' }} />;
};

const GeographicTopologyView: React.FC<GeographicTopologyViewProps> = (props) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        return <div className="text-red-500 font-bold p-4">Google Maps API Key missing in .env</div>;
    }

    return (
        <Wrapper apiKey={apiKey} status={Status.LOADING}>
            <MapComponent {...props} />
        </Wrapper>
    );
};

export default GeographicTopologyView;
