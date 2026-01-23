import { useState, useEffect, useCallback } from "react";
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    MarkerType,
    Handle,
    Position,
} from "reactflow";
import "reactflow/dist/style.css";
import {
    XCircle,
    Zap,
    Send,
    CheckCircle2,
    Activity,
    Smartphone,
    LucideIcon
} from "lucide-react";
import Button from "../../components/ui/button/Button";

// --- Custom Node Component ---
const CustomNode = ({ data }: { data: WorkflowNodeData }) => {
    const icons: Record<string, LucideIcon> = {
        payment: Smartphone,
        gateway: Zap,
        disbursement: Send,
        settlement: CheckCircle2,
    };

    const Icon = icons[data.type] || Zap;

    return (
        <div className="group relative">
            <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-brand-500 !border-white" />

            <div className={`
                relative min-w-[220px] rounded-2xl p-4 transition-all duration-500
                bg-white dark:bg-slate-900 border-2
                ${data.isActive ? 'border-brand-500 shadow-[0_0_20px_rgba(55,81,255,0.3)] scale-105' : 'border-gray-100 dark:border-slate-800 shadow-sm'}
                hover:border-brand-400 hover:shadow-lg
            `}>
                <div className="flex items-center gap-3">
                    <div className={`
                        w-12 h-12 rounded-xl flex items-center justify-center transition-colors overflow-hidden
                        ${data.isActive ? 'bg-brand-500 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400'}
                    `}>
                        {data.logo ? (
                            <img src={data.logo} alt={data.label} className="w-full h-full object-contain p-2" />
                        ) : (
                            <Icon strokeWidth={1.5} className="w-6 h-6" />
                        )}
                    </div>

                    <div>
                        <div className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest leading-none mb-1">
                            {data.type}
                        </div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">
                            {data.label}
                        </div>
                    </div>
                </div>

                {/* Animated progress bar if active */}
                {data.isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden rounded-b-2xl">
                        <div className="h-full bg-brand-500 animate-progress origin-left" />
                    </div>
                )}
            </div>

            <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-brand-500 !border-white" />
        </div>
    );
};

const nodeTypes = {
    custom: CustomNode,
};

interface WorkflowNodeData {
    label: string;
    type: string;
    isActive: boolean;
    logo?: string;
}

// --- Initial Data ---
const initialNodes: { id: string, type: string, position: { x: number, y: number }, data: WorkflowNodeData }[] = [
    { id: "1", type: "custom", position: { x: 50, y: 150 }, data: { label: "Customer Mobile", type: "payment", isActive: false } },
    { id: "2", type: "custom", position: { x: 350, y: 150 }, data: { label: "Odipay Gateway", type: "gateway", isActive: false, logo: "/images/logo/logo-icon.svg" } },
    { id: "3", type: "custom", position: { x: 650, y: 50 }, data: { label: "MTN MM", type: "disbursement", isActive: false, logo: "/mtnlogo.png" } },
    { id: "4", type: "custom", position: { x: 650, y: 250 }, data: { label: "Airtel MM", type: "disbursement", isActive: false, logo: "/airtellogo.png" } },
    { id: "5", type: "custom", position: { x: 950, y: 150 }, data: { label: "Final Settlement", type: "settlement", isActive: false } },
];

const initialEdges = [
    { id: "e1-2", source: "1", target: "2", animated: false, style: { strokeWidth: 3, stroke: "#3751FF" }, markerEnd: { type: MarkerType.ArrowClosed, color: "#3751FF" } },
    { id: "e2-3", source: "2", target: "3", animated: false, style: { strokeWidth: 3, stroke: "#3751FF" }, markerEnd: { type: MarkerType.ArrowClosed, color: "#3751FF" } },
    { id: "e2-4", source: "2", target: "4", animated: false, style: { strokeWidth: 3, stroke: "#3751FF" }, markerEnd: { type: MarkerType.ArrowClosed, color: "#3751FF" } },
    { id: "e3-5", source: "3", target: "5", animated: false, style: { strokeWidth: 3, stroke: "#3751FF" }, markerEnd: { type: MarkerType.ArrowClosed, color: "#3751FF" } },
    { id: "e4-5", source: "4", target: "5", animated: false, style: { strokeWidth: 3, stroke: "#3751FF" }, markerEnd: { type: MarkerType.ArrowClosed, color: "#3751FF" } },
];

interface TransactionWorkflowProps {
    onClose: () => void;
    walletName: string;
}

export default function TransactionWorkflow({ onClose, walletName }: TransactionWorkflowProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [stats, setStats] = useState({ total: 1245, success: "99.8%", live: 0 });
    const [logs, setLogs] = useState<{ id: number, msg: string, time: string }[]>([]);

    // --- Simulation Logic ---
    const addLog = useCallback((msg: string) => {
        setLogs(prev => [{ id: Date.now(), msg, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 5));
    }, []);

    const triggerTransaction = useCallback(async () => {
        const isMTN = Math.random() > 0.5;
        const targetFlow = isMTN ? ["1", "2", "3", "5"] : ["1", "2", "4", "5"];
        const amount = `UGX ${Math.floor(Math.random() * 50 + 5)}K`;

        addLog(`Incoming: ${amount} via ${isMTN ? 'MTN' : 'Airtel'}`);
        setStats(s => ({ ...s, live: s.live + 1 }));

        for (let i = 0; i < targetFlow.length; i++) {
            const nodeId = targetFlow[i];

            // Activate Node
            setNodes(nds => nds.map(node => ({
                ...node,
                data: { ...node.data, isActive: node.id === nodeId }
            })));

            // Activate Edge leading to this node
            if (i > 0) {
                const prevNodeId = targetFlow[i - 1];
                setEdges(eds => eds.map(edge => ({
                    ...edge,
                    animated: edge.source === prevNodeId && edge.target === nodeId
                })));
            }

            await new Promise(r => setTimeout(r, 800));
        }

        // Reset
        setNodes(nds => nds.map(node => ({ ...node, data: { ...node.data, isActive: false } })));
        setEdges(eds => eds.map(edge => ({ ...edge, animated: false })));
        setStats(s => ({ ...s, live: Math.max(0, s.live - 1), total: s.total + 1 }));
        addLog(`Completed: ${amount} settled.`);
    }, [addLog, setNodes, setEdges]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.7) triggerTransaction();
        }, 3000);
        return () => clearInterval(interval);
    }, [triggerTransaction]);

    return (
        <div className="fixed inset-0 z-99999 flex items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-md overflow-hidden">
            <div className="absolute inset-0 sm:hidden bg-slate-900" />

            {/* Modal Container */}
            <div className="relative w-full h-full sm:max-w-7xl sm:h-[90vh] bg-white dark:bg-[#0F172A] sm:rounded shadow-2xl overflow-hidden flex flex-col border border-gray-100 dark:border-slate-800 animate-in zoom-in duration-300">

                {/* Header */}
                <div className="px-6 py-5 sm:px-8 sm:py-6 border-b border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white tracking-tight uppercase">
                                Real-Time Flow
                            </h3>
                            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
                                {walletName} • Live Monitor
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto sm:gap-8">
                        <div className="flex items-center gap-8">
                            <div className="text-center sm:text-right">
                                <div className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none mb-1">Processed</div>
                                <div className="text-xl font-black text-gray-900 dark:text-white tabular-nums">{stats.total}</div>
                            </div>
                            <div className="text-center sm:text-right">
                                <div className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none mb-1">Live</div>
                                <div className="flex items-center gap-2 justify-end">
                                    <div className={`w-2 h-2 rounded-full ${stats.live > 0 ? 'bg-success-500 animate-pulse' : 'bg-gray-300'}`} />
                                    <div className="text-xl font-black text-gray-900 dark:text-white tabular-nums">{stats.live}</div>
                                </div>
                            </div>
                        </div>
                        <Button onClick={onClose} className="sm:hidden w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800">
                            <XCircle className="w-6 h-6 text-gray-500" />
                        </Button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
                    {/* Live Log Sidebar */}
                    <div className="hidden lg:flex w-72 border-r border-gray-100 dark:border-slate-800 bg-gray-50/30 dark:bg-slate-900/30 flex-col">
                        <div className="p-4 border-b border-gray-100 dark:border-slate-800">
                            <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Activity Log</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {logs.map(log => (
                                <div key={log.id} className="animate-in slide-in-from-left-2 duration-300">
                                    <div className="text-[10px] font-bold text-brand-500 mb-1">{log.time}</div>
                                    <div className="text-xs font-bold text-gray-600 dark:text-gray-300 border-l-2 border-brand-500/20 pl-3 py-1">
                                        {log.msg}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* React Flow Container */}
                    <div className="flex-1 bg-gray-50/50 dark:bg-slate-950/50 relative overflow-hidden">
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            nodeTypes={nodeTypes}
                            fitView
                            minZoom={0.2}
                        >
                            <Background color="#3751FF" gap={20} size={1} />
                            <Controls className="!bg-white dark:!bg-slate-800 !border-0 !shadow-xl !rounded-xl overflow-hidden" />
                            <MiniMap
                                className="!bg-white dark:!bg-slate-800 !border-0 !shadow-xl !rounded-2xl"
                                maskColor="rgba(0,0,0,0.1)"
                                nodeColor={(n) => (n.data as WorkflowNodeData).isActive ? '#3751FF' : '#e2e8f0'}
                            />
                        </ReactFlow>

                        {/* Mobile Log Overlay */}
                        <div className="lg:hidden absolute bottom-4 left-4 right-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-3 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                                    <Activity className="w-4 h-4 text-brand-500" />
                                </div>
                                <div className="truncate text-xs font-bold text-gray-900 dark:text-white">
                                    {logs[0]?.msg || 'System standing by...'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-4 border-t border-gray-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-6 overflow-x-auto w-full sm:w-auto no-scrollbar">
                        <div className="flex items-center gap-2 whitespace-nowrap">
                            <div className="w-2 h-2 rounded-full bg-brand-500" />
                            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Active path</span>
                        </div>
                        <div className="flex items-center gap-2 whitespace-nowrap">
                            <div className="w-2 h-2 rounded-full bg-success-500" />
                            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Successful</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Button
                            onClick={onClose}
                            className="w-full sm:w-auto px-8 py-3 bg-brand-500 hover:bg-brand-600 text-white uppercase tracking-widest transition-all shadow-lg shadow-brand-500/20 active:scale-95"
                        >
                            Return to Dashboard
                        </Button>
                    </div>
                </div>
            </div>

            {/* Global Keyframes for progress animation */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes progress {
                    0% { transform: scaleX(0); opacity: 0.5; }
                    50% { transform: scaleX(0.7); opacity: 1; }
                    100% { transform: scaleX(1); opacity: 0; }
                }
                .animate-progress {
                    animation: progress 0.8s ease-in-out infinite;
                }
            `}} />
        </div>
    );
}