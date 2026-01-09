import {
    Activity,
    AlertOctagon,
    AlertTriangle,
    CheckCircle2,
    Database,
    RefreshCw,
    Server,
    Shield,
    Wifi,
    XCircle,
    Zap
} from 'lucide-react';
import React, { useState } from 'react';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";

interface ServiceStatus {
    id: string;
    name: string;
    type: 'CORE' | 'PAYMENT' | 'INFRASTRUCTURE' | 'EXTERNAL';
    status: 'OPERATIONAL' | 'DEGRADED' | 'DOWN' | 'MAINTENANCE';
    latency: number;
    uptime: number;
}

interface SystemFault {
    id: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    component: string;
    message: string;
    timestamp: string;
    status: 'OPEN' | 'RESOLVED' | 'INVESTIGATING';
}

export default function SystemCheck() {
    const [isScanning, setIsScanning] = useState(false);
    const [lastScan, setLastScan] = useState<Date>(new Date());
    const [services, setServices] = useState<ServiceStatus[]>([
        { id: '1', name: 'Core Banking Engine', type: 'CORE', status: 'OPERATIONAL', latency: 45, uptime: 99.99 },
        { id: '2', name: 'Payment Switch (MTN)', type: 'PAYMENT', status: 'OPERATIONAL', latency: 120, uptime: 98.5 },
        { id: '3', name: 'Payment Switch (Airtel)', type: 'PAYMENT', status: 'DEGRADED', latency: 850, uptime: 95.2 },
        { id: '4', name: 'Auth Service (OAuth)', type: 'INFRASTRUCTURE', status: 'OPERATIONAL', latency: 25, uptime: 100 },
        { id: '5', name: 'Primary Database', type: 'INFRASTRUCTURE', status: 'OPERATIONAL', latency: 12, uptime: 99.99 },
        { id: '6', name: 'Notification Service', type: 'INFRASTRUCTURE', status: 'OPERATIONAL', latency: 89, uptime: 99.9 },
        { id: '7', name: 'External KYC Provider', type: 'EXTERNAL', status: 'DOWN', latency: 0, uptime: 88.4 },
        { id: '8', name: 'Redis Cache Cluster', type: 'INFRASTRUCTURE', status: 'OPERATIONAL', latency: 5, uptime: 99.99 },
    ]);

    const [faults,] = useState<SystemFault[]>([
        { id: 'f1', severity: 'CRITICAL', component: 'External KYC Provider', message: 'Connection timeout exceeded (30s)', timestamp: '2 mins ago', status: 'OPEN' },
        { id: 'f2', severity: 'HIGH', component: 'Payment Switch (Airtel)', message: 'High latency detected on callback webhook', timestamp: '15 mins ago', status: 'INVESTIGATING' },
        { id: 'f3', severity: 'MEDIUM', component: 'Notification Service', message: 'SMS Gateway delivery delay', timestamp: '1 hour ago', status: 'RESOLVED' },
        { id: 'f4', severity: 'LOW', component: 'External KYC Provider', message: 'Connection timeout exceeded (30s)', timestamp: '2 mins ago', status: 'OPEN' },
    ]);

    const handleRunDiagnostic = () => {
        setIsScanning(true);
        // Simulate scanning process
        setTimeout(() => {
            setIsScanning(false);
            setLastScan(new Date());
            // Randomly update a status to show "live" feel
            setServices(prev => prev.map(s =>
                s.name.includes("Airtel") ? { ...s, latency: Math.floor(Math.random() * 200 + 50), status: 'OPERATIONAL' } : s
            ));
        }, 2000);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPERATIONAL': return 'text-green-500 bg-green-50/50 dark:bg-green-500/10 border-green-100 dark:border-green-500/20';
            case 'DEGRADED': return 'text-yellow-500 bg-yellow-50/50 dark:bg-yellow-500/10 border-yellow-100 dark:border-yellow-500/20';
            case 'DOWN': return 'text-red-500 bg-red-50/50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20';
            case 'MAINTENANCE': return 'text-blue-500 bg-blue-50/50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20';
            default: return 'text-gray-500';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'OPERATIONAL': return <CheckCircle2 className="w-5 h-5" />;
            case 'DEGRADED': return <AlertTriangle className="w-5 h-5" />;
            case 'DOWN': return <XCircle className="w-5 h-5" />;
            case 'MAINTENANCE': return <RefreshCw className="w-5 h-5" />;
            default: return <Activity className="w-5 h-5" />;
        }
    };

    const getSeverityBadge = (severity: string) => {
        const styles = {
            CRITICAL: 'bg-red-500/10 text-red-600 border-red-200',
            HIGH: 'bg-orange-500/10 text-orange-600 border-orange-200',
            MEDIUM: 'bg-yellow-500/10 text-yellow-600 border-yellow-200',
            LOW: 'bg-blue-500/10 text-blue-600 border-blue-200',
        };
        return `px-2.5 py-1 rounded-full text-xs font-bold border ${styles[severity as keyof typeof styles]}`;
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-20">
            <PageMeta title="System Health | Odipay" description="Real-time system status and diagnostics" />
            <PageBreadcrumb pageTitle="System Diagnostics" />

            {/* Header / Scan Control */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 p-6 rounded-3xl">
                <div className="flex items-center gap-5">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 ${services.some(s => s.status === 'DOWN') ? 'bg-red-50 border-red-100 text-red-500' : 'bg-green-50 border-green-100 text-green-500'} dark:bg-white/[0.03] dark:border-white/10`}>
                        <Activity className={`w-8 h-8 ${isScanning ? 'animate-pulse' : ''}`} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">System Health Status</h2>
                        <p className="text-sm text-gray-500 font-medium">Last comprehensive scan: {lastScan.toLocaleTimeString()}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:block text-right">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Overall Status</p>
                        <p className={`text-lg font-black ${services.some(s => s.status === 'DOWN') ? 'text-red-500' : 'text-green-500'}`}>
                            {services.some(s => s.status === 'DOWN') ? 'CRITICAL ISSUES' : 'SYSTEM HEALTHY'}
                        </p>
                    </div>
                    <Button
                        variant="primary"

                        className={`rounded-2xl px-8  ${isScanning ? 'opacity-80' : ''}`}
                        onClick={handleRunDiagnostic}
                        disabled={isScanning}
                        startIcon={isScanning ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                    >
                        {isScanning ? 'Running Diagnostics...' : 'Run System Check'}
                    </Button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'System Uptime', value: '99.98%', icon: <Activity />, color: 'text-green-500' },
                    { label: 'Avg API Latency', value: '42ms', icon: <Wifi />, color: 'text-blue-500' },
                    { label: 'Active Alerts', value: faults.filter(f => f.status !== 'RESOLVED').length.toString(), icon: <AlertOctagon />, color: 'text-red-500' },
                    { label: 'Database Load', value: '24%', icon: <Database />, color: 'text-purple-500' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 p-5 rounded-2xl flex items-center gap-4 hover:border-gray-200 dark:hover:border-gray-700 transition-colors cursor-default">
                        <div className={`p-3 rounded-xl bg-gray-50 dark:bg-white/5 ${stat.color}`}>
                            {React.cloneElement(stat.icon as React.ReactElement<{ className?: string }>, { className: 'w-6 h-6' })}
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-0.5">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Service Health Grid */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Server className="w-5 h-5 text-gray-400" />
                        Component Status
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {services.map((service) => (
                            <div key={service.id} className={`group relative p-5 rounded-2xl border transition-all duration-200 ${getStatusColor(service.status).split(' ').slice(1).join(' ')} border-opacity-50 hover:border-opacity-100 bg-opacity-50 dark:bg-opacity-10`}>
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg bg-white/50 dark:bg-black/20 ${getStatusColor(service.status).split(' ')[0]}`}>
                                            {getStatusIcon(service.status)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white text-sm">{service.name}</h4>
                                            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mt-0.5">{service.type}</p>
                                        </div>
                                    </div>
                                    <div className={`text-xs font-black px-2 py-1 rounded-md bg-white/50 dark:bg-black/20 ${getStatusColor(service.status).split(' ')[0]}`}>
                                        {service.status}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200/20 dark:border-white/5">
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-bold">Latency</p>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <div className={`w-1.5 h-1.5 rounded-full ${service.latency > 500 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{service.latency}ms</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-bold">Uptime (24h)</p>
                                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300 mt-0.5 block">{service.uptime}%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Faults Feed */}
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-gray-400" />
                        System Faults & Incidents
                    </h3>
                    <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
                        {faults.length === 0 ? (
                            <div className="p-10 text-center">
                                <Shield className="w-12 h-12 text-green-500 mx-auto mb-3 opacity-50" />
                                <p className="text-gray-500 font-medium">No active faults detected.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                {faults.map((fault) => (
                                    <div key={fault.id} className="p-5 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer group">
                                        <div className="flex items-start justify-between mb-2">
                                            <span className={getSeverityBadge(fault.severity)}>{fault.severity}</span>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">{fault.timestamp}</span>
                                        </div>
                                        <h5 className="text-sm font-bold text-gray-900 dark:text-white mb-1 group-hover:text-brand-500 transition-colors">{fault.component}</h5>
                                        <p className="text-xs text-gray-500 leading-relaxed mb-3">{fault.message}</p>
                                        <div className="flex items-center justify-between">
                                            <span className={`text-[10px] font-bold uppercase ${fault.status === 'OPEN' ? 'text-red-500' :
                                                fault.status === 'INVESTIGATING' ? 'text-orange-500' : 'text-green-500'
                                                }`}>
                                                Status: {fault.status}
                                            </span>
                                            <Button size="sm" className="h-6 text-[10px] uppercase font-bold px-2 text-gray-400 hover:text-brand-500">
                                                View Logs
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="p-4 bg-gray-50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-gray-800 text-center">
                            <button className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase hover:underline">
                                View Incident History
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
