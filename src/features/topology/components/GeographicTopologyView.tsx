// src/features/topology/components/GeographicTopologyView.tsx
import React, { useRef, useEffect, useState } from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';
import { PipelineNode, ScadaData } from '../../../types'; // Correct relative path
import { 
    ZoomIn, 
    ZoomOut, 
    Locate, 
    Layers, 
    X, 
    Activity, 
    AlertTriangle, 
    ShieldCheck,
    Flame 
} from 'lucide-react';

interface GeographicTopologyViewProps {
    nodes: PipelineNode[];
    alerts: ScadaData[];
}

// Custom OverlayView interface to satisfy TypeScript
interface CustomOverlayView extends google.maps.OverlayView {
    canvas?: HTMLCanvasElement;
}

const MAIN_HUB_ALPHA: PipelineNode = {
    id: "MAIN-HUB-ALPHA",
    name: "MAIN HUB ALPHA",
    current: 200,
    max: 300,
    role: "Distribution",
    status: "Active",
    lat: 29.7604,
    lng: -95.3698
};

// Curated Midnight Theme Map Style
const midnightMapStyles: google.maps.MapTypeStyle[] = [
    { "elementType": "geometry", "stylers": [{ "color": "#070708" }] },
    { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
    { "elementType": "labels.text.fill", "stylers": [{ "color": "#5a6170" }] },
    { "elementType": "labels.text.stroke", "stylers": [{ "color": "#070708" }] },
    { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "color": "#21252d" }] },
    { "featureType": "administrative.country", "elementType": "labels.text.fill", "stylers": [{ "color": "#848f9f" }] },
    { "featureType": "poi", "stylers": [{ "visibility": "off" }] },
    { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#13161b" }] },
    { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#3d4450" }] },
    { "featureType": "transit", "stylers": [{ "visibility": "off" }] },
    { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000205" }] }
];

interface InnerMapComponentProps extends GeographicTopologyViewProps {
    selectedNode: PipelineNode | null;
    setSelectedNode: React.Dispatch<React.SetStateAction<PipelineNode | null>>;
    showFlow: boolean;
    mapRef: React.MutableRefObject<google.maps.Map | null>;
}

const MapComponent: React.FC<InnerMapComponentProps> = ({ 
    nodes, 
    alerts, 
    setSelectedNode, 
    showFlow,
    mapRef 
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const markersRef = useRef<google.maps.Marker[]>([]);

    useEffect(() => {
        if (ref.current) {
            const map = new window.google.maps.Map(ref.current, {
                center: { lat: 31.0, lng: -99.5 }, // Center of Texas pipeline grid
                zoom: 6,
                styles: midnightMapStyles,
                tilt: 0,
                disableDefaultUI: true, // Disable standard white Google controls
                rotateControl: false,
                mapTypeControl: false,
                streetViewControl: false,
            });

            mapRef.current = map;

            // Resolve physical coordinates dynamically + attach the Main Hub Alpha distribution node
            const activeNodes = [
                ...nodes.filter(n => n.lat && n.lng),
                MAIN_HUB_ALPHA
            ];

            // Create markers
            activeNodes.forEach(node => {
                const isAnomalous = alerts.some(a => a.asset_id === node.id) || node.status === 'Maintenance';
                
                let markerColor = "#00ff66"; // Optimal Green
                if (node.status === 'Maintenance') markerColor = "#ef4444"; // Failure Red
                else if (node.status === 'Compensating') markerColor = "#ff7a00"; // Warning Amber

                const marker = new window.google.maps.Marker({
                    position: { lat: node.lat!, lng: node.lng! },
                    map: map,
                    title: node.name,
                    icon: {
                        path: window.google.maps.SymbolPath.CIRCLE,
                        scale: node.role === "Distribution" ? 12 : 8,
                        fillColor: markerColor,
                        fillOpacity: 1,
                        strokeColor: isAnomalous ? "#ffffff" : "#0d0d0d",
                        strokeWeight: node.role === "Distribution" ? 3 : 2,
                    }
                });

                marker.addListener('click', () => {
                    setSelectedNode(node);
                });

                markersRef.current.push(marker);
            });

            // Define structural pipeline connections dynamically
            const node1 = activeNodes.find(n => n.id === "COMP-TX-VALLEY-01");
            const node2 = activeNodes.find(n => n.id === "COMP-TX-VALLEY-02");
            const node3 = activeNodes.find(n => n.id === "COMP-TX-VALLEY-03");
            const hubNode = activeNodes.find(n => n.id === "MAIN-HUB-ALPHA");

            const paths: { from: PipelineNode; to: PipelineNode; type: 'standby' | 'flow' }[] = [];
            if (node1 && node2) paths.push({ from: node1, to: node2, type: 'standby' });
            if (node1 && node3) paths.push({ from: node1, to: node3, type: 'standby' });
            if (node2 && hubNode) paths.push({ from: node2, to: hubNode, type: 'flow' });
            if (node3 && hubNode) paths.push({ from: node3, to: hubNode, type: 'flow' });

            // Native base polylines (rendered underneath for clicks/interactions if needed)
            paths.forEach(path => {
                new window.google.maps.Polyline({
                    path: [
                        { lat: path.from.lat!, lng: path.from.lng! },
                        { lat: path.to.lat!, lng: path.to.lng! }
                    ],
                    map: map,
                    strokeColor: path.type === 'flow' ? "#00ff66" : "#ef4444",
                    strokeOpacity: 0.02, // Invisible native polylines (canvas overlay handles visual styles)
                    strokeWeight: 6,
                });
            });

            // Custom WebGL/HTML Canvas Overlay
            const overlay: CustomOverlayView = new window.google.maps.OverlayView();
            
            overlay.onAdd = function() {
                const canvas = document.createElement('canvas');
                canvas.style.position = 'absolute';
                canvas.style.top = '0';
                canvas.style.left = '0';
                canvas.style.pointerEvents = 'none';
                canvas.style.zIndex = '1000';
                this.canvas = canvas;
                const panes = this.getPanes();
                if (panes) {
                    panes.overlayLayer.appendChild(canvas);
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

                // 1. Render pipeline conduits and fluid flows
                paths.forEach(path => {
                    const p1 = projection.fromLatLngToContainerPixel(new window.google.maps.LatLng(path.from.lat!, path.from.lng!));
                    const p2 = projection.fromLatLngToContainerPixel(new window.google.maps.LatLng(path.to.lat!, path.to.lng!));
                    
                    if (p1 && p2 && isFinite(p1.x) && isFinite(p1.y) && isFinite(p2.x) && isFinite(p2.y)) {
                        const minX = Math.min(p1.x, p2.x);
                        const maxX = Math.max(p1.x, p2.x);
                        const minY = Math.min(p1.y, p2.y);
                        const maxY = Math.max(p1.y, p2.y);

                        const isOffScreen = maxX < 0 || minX > canvas.width || maxY < 0 || minY > canvas.height;
                        const isTooLarge = Math.abs(p1.x) > 5000 || Math.abs(p1.y) > 5000 || Math.abs(p2.x) > 5000 || Math.abs(p2.y) > 5000;

                        if (!isOffScreen && !isTooLarge) {
                            // Draw wide transparent track conduit
                            ctx.beginPath();
                            ctx.moveTo(p1.x, p1.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.lineWidth = 8;
                            ctx.lineCap = 'round';
                            ctx.strokeStyle = path.from.status === 'Maintenance' ? 'rgba(239, 68, 68, 0.06)' : 'rgba(0, 240, 255, 0.05)';
                            ctx.stroke();

                            // Draw dynamic glowing flow pulses
                            if (showFlow && path.type === 'flow') {
                                ctx.beginPath();
                                ctx.moveTo(p1.x, p1.y);
                                ctx.lineTo(p2.x, p2.y);
                                ctx.lineWidth = 3;
                                ctx.lineCap = 'round';

                                // Emerald green if optimal, amber if compensating
                                const pulseColor = path.from.status === 'Compensating' ? 'rgba(255, 122, 0, 0.8)' : 'rgba(0, 255, 102, 0.8)';
                                ctx.strokeStyle = pulseColor;
                                
                                ctx.shadowColor = pulseColor;
                                ctx.shadowBlur = 5;
                                ctx.setLineDash([12, 20]);
                                ctx.lineDashOffset = -Date.now() / 24 % 32;
                                ctx.stroke();
                                ctx.setLineDash([]);
                                ctx.shadowBlur = 0;
                            } else if (path.type === 'standby' && path.from.status === 'Maintenance') {
                                // Broken pipeline warning ticks
                                ctx.beginPath();
                                ctx.moveTo(p1.x, p1.y);
                                ctx.lineTo(p2.x, p2.y);
                                ctx.lineWidth = 2;
                                ctx.lineCap = 'round';
                                ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
                                ctx.setLineDash([4, 4]);
                                ctx.stroke();
                                ctx.setLineDash([]);
                            }
                        }
                    }
                });

                // 2. Render active expanding radar pings beneath warning/alert nodes
                activeNodes.forEach(node => {
                    const isAnomalous = alerts.some(a => a.asset_id === node.id) || node.status === 'Maintenance';
                    if (isAnomalous && node.lat && node.lng) {
                        const pos = projection.fromLatLngToContainerPixel(new window.google.maps.LatLng(node.lat, node.lng));
                        if (pos && isFinite(pos.x) && isFinite(pos.y)) {
                            const pulseCycle = (Date.now() % 2000) / 2000; // 0 to 1 loop
                            const radius = 10 + pulseCycle * 35;
                            const opacity = 1 - pulseCycle;
                            
                            // Concentric pulse rings
                            ctx.beginPath();
                            ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
                            ctx.lineWidth = 1.5;
                            ctx.strokeStyle = `rgba(239, 68, 68, ${opacity * 0.6})`;
                            ctx.stroke();

                            ctx.beginPath();
                            ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
                            ctx.fillStyle = `rgba(239, 68, 68, ${opacity * 0.06})`;
                            ctx.fill();
                        }
                    }
                });
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
                // Clean up markers
                markersRef.current.forEach(m => m.setMap(null));
                markersRef.current = [];
            };
        }
    }, [nodes, alerts, showFlow, mapRef, setSelectedNode]);

    return <div ref={ref} style={{ width: '100%', height: '100%', borderRadius: '2.5rem' }} />;
};

const GeographicTopologyView: React.FC<GeographicTopologyViewProps> = (props) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const [selectedNode, setSelectedNode] = useState<PipelineNode | null>(null);
    const [showFlow, setShowFlow] = useState(true);
    const mapRef = useRef<google.maps.Map | null>(null);

    // Floating Control HUD Functions
    const zoomIn = () => {
        if (mapRef.current) {
            mapRef.current.setZoom((mapRef.current.getZoom() || 6) + 1);
        }
    };

    const zoomOut = () => {
        if (mapRef.current) {
            mapRef.current.setZoom((mapRef.current.getZoom() || 6) - 1);
        }
    };

    const reCenter = () => {
        if (mapRef.current) {
            mapRef.current.panTo({ lat: 31.0, lng: -99.5 });
            mapRef.current.setZoom(6);
        }
    };

    if (!apiKey) {
        return (
            <div className="h-full bg-zinc-950 border border-zinc-900 rounded-[2.5rem] flex flex-col items-center justify-center p-10 text-center">
                <AlertTriangle className="text-orange-500 mb-4" size={48} />
                <h3 className="text-white font-black tracking-tight text-lg mb-2">Google Maps API Key Missing</h3>
                <p className="text-zinc-500 text-sm max-w-md">
                    Please configure the VITE_GOOGLE_MAPS_API_KEY variable in your local .env file to load the interactive geographic network.
                </p>
            </div>
        );
    }

    // Calculate status statistics for selected nodes
    const nodeAlert = props.alerts.find(a => a.asset_id === selectedNode?.id);

    return (
        <div className="relative w-full h-full min-h-[500px] border border-zinc-900 rounded-[2.5rem] overflow-hidden bg-zinc-950">
            
            {/* Base Google Map Component with Custom Overlay */}
            <Wrapper apiKey={apiKey}>
                <MapComponent 
                    {...props} 
                    selectedNode={selectedNode} 
                    setSelectedNode={setSelectedNode} 
                    showFlow={showFlow}
                    mapRef={mapRef}
                />
            </Wrapper>

            {/* Custom Floating Absolute Dark Controls HUD */}
            <div className="absolute top-6 right-6 flex flex-col gap-3 z-[2000]">
                <button 
                    onClick={zoomIn} 
                    title="Zoom In"
                    className="p-3 bg-[#0d0d0d]/90 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl text-zinc-400 hover:text-white transition-all active:scale-95 shadow-2xl backdrop-blur-md"
                >
                    <ZoomIn size={18} />
                </button>
                <button 
                    onClick={zoomOut} 
                    title="Zoom Out"
                    className="p-3 bg-[#0d0d0d]/90 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl text-zinc-400 hover:text-white transition-all active:scale-95 shadow-2xl backdrop-blur-md"
                >
                    <ZoomOut size={18} />
                </button>
                <button 
                    onClick={reCenter} 
                    title="Recenter Map"
                    className="p-3 bg-[#0d0d0d]/90 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl text-zinc-400 hover:text-white transition-all active:scale-95 shadow-2xl backdrop-blur-md"
                >
                    <Locate size={18} />
                </button>
                <button 
                    onClick={() => setShowFlow(prev => !prev)} 
                    title="Toggle Flow View"
                    className={`p-3 bg-[#0d0d0d]/90 border border-zinc-800 hover:border-zinc-700 rounded-2xl transition-all active:scale-95 shadow-2xl backdrop-blur-md ${showFlow ? 'text-cyan-400' : 'text-zinc-600'}`}
                >
                    <Layers size={18} />
                </button>
            </div>

            {/* Dynamic React-Managed Info HUD Card (Replacing Native Bubbles) */}
            {selectedNode && (
                <div className="absolute bottom-6 left-6 z-[2000] w-[340px] bg-[#0d0d0d]/80 backdrop-blur-xl border border-zinc-900 rounded-[2rem] p-6 shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">SCADA Telemetry Station</span>
                            <h4 className="text-white text-lg font-black tracking-tight mt-0.5">{selectedNode.name}</h4>
                        </div>
                        <button 
                            onClick={() => setSelectedNode(null)}
                            className="p-1.5 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 rounded-xl text-zinc-500 hover:text-white transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Node Metrics Panel */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center bg-zinc-950/50 border border-zinc-900/50 rounded-2xl p-3 px-4">
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-tighter">Role / Class</span>
                            <span className="text-xs font-extrabold text-zinc-300 uppercase tracking-widest">{selectedNode.role}</span>
                        </div>

                        <div className="flex justify-between items-center bg-zinc-950/50 border border-zinc-900/50 rounded-2xl p-3 px-4">
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-tighter">Current Throughput</span>
                            <span className="text-sm font-black text-white tracking-tighter">{selectedNode.current} <span className="text-[10px] font-bold text-zinc-600">MMcf/d</span></span>
                        </div>

                        {/* Render real-time SCADA sensor data if available, else default */}
                        <div className="grid grid-cols-3 gap-2">
                            <div className="bg-zinc-950/50 border border-zinc-900/50 rounded-xl p-2.5 text-center">
                                <div className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Pressure</div>
                                <div className="text-xs font-bold text-zinc-300 tracking-tight mt-0.5">
                                    {nodeAlert ? `${nodeAlert.psi} PSI` : '850 PSI'}
                                </div>
                            </div>
                            <div className="bg-zinc-950/50 border border-zinc-900/50 rounded-xl p-2.5 text-center">
                                <div className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Temp</div>
                                <div className="text-xs font-bold text-zinc-300 tracking-tight mt-0.5">
                                    {nodeAlert ? `${nodeAlert.temp}°F` : '112°F'}
                                </div>
                            </div>
                            <div className="bg-zinc-950/50 border border-zinc-900/50 rounded-xl p-2.5 text-center">
                                <div className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Vibration</div>
                                <div className="text-xs font-bold text-zinc-300 tracking-tight mt-0.5">
                                    {nodeAlert ? `${nodeAlert.vibration}mm` : '0.02mm'}
                                </div>
                            </div>
                        </div>

                        {/* Status Banner */}
                        <div className="border-t border-zinc-900/80 pt-4 mt-2">
                            {selectedNode.status === 'Maintenance' ? (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-3.5 flex items-center gap-3">
                                    <AlertTriangle className="text-red-500 shrink-0" size={20} />
                                    <div>
                                        <h5 className="text-[9px] font-black text-red-500 uppercase tracking-widest">Critical Anomaly</h5>
                                        <p className="text-xs font-medium text-zinc-400 leading-tight mt-0.5">Vibration breach detected. Action required.</p>
                                    </div>
                                </div>
                            ) : selectedNode.status === 'Compensating' ? (
                                <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-3.5 flex items-center gap-3">
                                    <Flame className="text-orange-500 shrink-0" size={20} />
                                    <div>
                                        <h5 className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Standby Boost</h5>
                                        <p className="text-xs font-medium text-zinc-400 leading-tight mt-0.5">Compensating flow offset by 17 MMcf/d.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3.5 flex items-center gap-3">
                                    <ShieldCheck className="text-emerald-500 shrink-0" size={20} />
                                    <div>
                                        <h5 className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Optimal Connection</h5>
                                        <p className="text-xs font-medium text-zinc-400 leading-tight mt-0.5">System stable and executing within boundaries.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Small Bottom Right Watermark */}
            <div className="absolute bottom-6 right-6 z-[1900] flex items-center gap-1 bg-[#0d0d0d]/75 border border-zinc-900 rounded-xl px-3 py-1.5 text-[8px] font-black uppercase tracking-widest text-zinc-600 backdrop-blur-sm select-none">
                <Activity size={10} className="text-zinc-600 shrink-0 animate-pulse" />
                Texas Telemetry Grid
            </div>

        </div>
    );
};

export default GeographicTopologyView;
