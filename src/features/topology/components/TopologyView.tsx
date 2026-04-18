// @ts-nocheck
import React, { useRef, useEffect } from 'react';
import { ScadaData, PipelineNode } from '@src/types'; // Changed import path
import {
    AlertTriangle,
    Settings,
    ShieldCheck,
    ArrowRight,
    Play,
    Zap
} from 'lucide-react';

interface TopologyViewProps {
    alerts: ScadaData[];
    nodes: PipelineNode[];
    workflowStep: number;
}

const TopologyView: React.FC<TopologyViewProps> = ({ alerts, nodes, workflowStep }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const drawNode = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, name: string, id: string, status?: string) => {
            // Rounded rect
            ctx.beginPath();
            ctx.roundRect(x, y, w, h, 32);
            ctx.fillStyle = '#0d0d0d';
            ctx.fill();
            
            ctx.strokeStyle = status === 'Maintenance' ? '#ef4444' : status?.includes('Boosted') ? '#3b82f6' : '#10b981';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Inner box for icon
            ctx.beginPath();
            ctx.roundRect(x + 35, y + 20, 50, 50, 14);
            ctx.fillStyle = status === 'Maintenance' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)';
            ctx.fill();

            // Text
            ctx.textAlign = 'center';
            ctx.fillStyle = '#444';
            ctx.font = '800 9px sans-serif';
            ctx.fillText(name.toUpperCase(), x + w / 2, y + 85);

            ctx.fillStyle = 'white';
            ctx.font = '900 10px sans-serif';
            ctx.fillText(id.toUpperCase(), x + w / 2, y + 100);

            // Status badge
            ctx.fillStyle = status === 'Maintenance' ? '#ef4444' : 'rgba(16, 185, 129, 0.2)';
            ctx.beginPath();
            ctx.roundRect(x + 15, y + 130, 90, 18, 6);
            ctx.fill();
            
            ctx.fillStyle = status === 'Maintenance' ? 'white' : '#10b981';
            ctx.font = '900 7px sans-serif';
            ctx.fillText(status === 'Maintenance' ? 'MAINTENANCE REQUIRED' : 'OPERATIONAL', x + w / 2, y + 142);
        };

        let animationFrameId: number;

        const render = () => {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw connections
            // Line 1: 200,225 to 400,100
            ctx.beginPath();
            ctx.moveTo(200, 225);
            ctx.lineTo(400, 100);
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 6]);
            ctx.globalAlpha = 0.3;
            ctx.stroke();
            ctx.globalAlpha = 1.0;
            ctx.setLineDash([]);

            // Line 2: 200,225 to 400,350
            ctx.beginPath();
            ctx.moveTo(200, 225);
            ctx.lineTo(400, 350);
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 6]);
            ctx.globalAlpha = 0.3;
            ctx.stroke();
            ctx.globalAlpha = 1.0;
            ctx.setLineDash([]);

            // Animated lines (flowing)
            ctx.beginPath();
            ctx.moveTo(400, 100);
            ctx.lineTo(650, 225);
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 4;
            ctx.setLineDash([10, 2]);
            ctx.lineDashOffset = -Date.now() / 50 % 12;
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.beginPath();
            ctx.moveTo(400, 350);
            ctx.lineTo(650, 225);
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 4;
            ctx.setLineDash([10, 2]);
            ctx.lineDashOffset = -Date.now() / 50 % 12;
            ctx.stroke();
            ctx.setLineDash([]);

            // Draw Nodes
            if (nodes && nodes.length >= 3) {
                drawNode(ctx, 140, 165, 120, 120, nodes[0].name, nodes[0].id, nodes[0].status);
                drawNode(ctx, 340, 40, 120, 120, nodes[1].name, nodes[1].id, nodes[1].status);
                drawNode(ctx, 340, 290, 120, 120, nodes[2].name, nodes[2].id, nodes[2].status);
            }

            // Distribution Node
            ctx.beginPath();
            ctx.arc(600 + 60, 165 + 60, 50, 0, Math.PI * 2);
            ctx.fillStyle = '#0d0d0d';
            ctx.fill();
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1;
            ctx.stroke();
            
            ctx.fillStyle = 'white';
            ctx.font = '900 11px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('MAIN HUB ALPHA', 600 + 60, 165 + 60 + 15);
            ctx.fillStyle = '#444';
            ctx.font = '800 9px sans-serif';
            ctx.fillText('DISTRIBUTION', 600 + 60, 165 + 60 + 0);

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [nodes, alerts]);

    return (
        <div className="flex flex-col h-full gap-8 animate-in zoom-in-95 duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight mb-1">Permian-East-Line: Topology View</h2>
                    <p className="text-zinc-500 text-sm font-medium">Real-time Network Flow Distribution</p>
                </div>
                                <div className="flex items-center gap-4">
                                                    {alerts.length > 0 ? (
                                                        <div className="bg-red-500/10 text-red-500 text-[10px] font-black px-4 py-1.5 rounded-full border border-red-500/20 flex items-center gap-2 uppercase tracking-widest">
                                                            <AlertTriangle size={14} /> Critical Anomaly Detected
                                                        </div>
                                                    ) : (
                                                        <div className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black px-4 py-1.5 rounded-full border border-emerald-500/20 flex items-center gap-2 uppercase tracking-widest">
                                                            <ShieldCheck size={14} /> System Optimal
                                                        </div>
                                                    )}
                                                    <button className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400 hover:text-white transition-colors">
                                                        <Settings size={20} />
                                                    </button>
                                                </div>
                                
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1 overflow-hidden">
                {/* Network Stats Column */}
                <div className="lg:col-span-1 space-y-6 flex flex-col overflow-y-auto">
                    <div className="bg-[#1c1a16] border border-zinc-800/50 rounded-3xl p-8">
                        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-1">Target Flow</p>
                        <p className="text-3xl font-black text-white tracking-tighter">500.0 <span className="text-sm font-bold text-zinc-600 ml-1">MMcf/d</span></p>
                    </div>

                    <div className="bg-[#1c1a16] border border-zinc-800/50 rounded-3xl p-8 border-l-4 border-l-red-500">
                        <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mb-1">Current Flow</p>
                        <p className="text-3xl font-black text-red-500 tracking-tighter">492.0 <span className="text-sm font-bold text-red-900 ml-1">MMcf/d</span></p>
                        <div className="mt-4 flex items-center gap-1.5">
                            <span className="text-[10px] font-black text-red-500/80 uppercase tracking-tighter animate-pulse">Slight Deficit (-1.6%)</span>
                        </div>
                    </div>

                    <div className="bg-[#1c1a16] border border-zinc-800/50 rounded-3xl p-8 border-l-4 border-l-orange-500">
                        <p className="text-orange-500 text-[10px] font-black uppercase tracking-widest mb-1">Compensation Gain</p>
                        <p className="text-3xl font-black text-orange-500 tracking-tighter">+17.0 <span className="text-sm font-bold text-orange-900 ml-1">MMcf/d</span></p>
                    </div>

                    <div className="mt-auto bg-[#1c1a16] border border-zinc-800/50 rounded-3xl p-8 shadow-2xl">
                        <h4 className="text-lg font-black text-white tracking-tight mb-2">Schedule Downtime</h4>
                        <p className="text-xs text-zinc-500 leading-relaxed mb-8 font-medium italic">Requires rerouting an additional 42 MMcf/d to South-Western bypass.</p>
                        <button className="w-full bg-orange-600 text-black py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-orange-500 transition-colors">Initiate Schedule</button>
                    </div>
                </div>

                {/* Topology Graph Column */}
                <div className="lg:col-span-3 bg-[#1c1a16] border border-zinc-800/50 rounded-[3rem] relative flex items-center justify-center p-12 overflow-hidden shadow-inner">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
                    
                    <div className="relative w-full max-w-3xl aspect-[16/9]">
                        <canvas
                            ref={canvasRef}
                            width={800}
                            height={450}
                            className="w-full h-full"
                        />
                                    </div>

                                    {/* Legend Overlay */}
                                    <div className="absolute bottom-10 right-10 bg-[#0d0d0d]/80 backdrop-blur-md border border-zinc-800 rounded-3xl p-6 shadow-2xl w-56">
                                        <h5 className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-4">Network Legend</h5>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Fault / Maintenance</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Compensating Flow</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-0.5 bg-zinc-800"></div>
                                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Standby Nodes</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
    );
};

export default TopologyView;
