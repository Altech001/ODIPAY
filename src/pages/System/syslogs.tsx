import {
    AlertCircle,
    Camera,
    CheckCircle2,
    Download,
    Info,
    RefreshCw,
    Search,
    Server,
    Terminal
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Input from '../../components/form/input/InputField';


type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS' | 'DEBUG';
type LogCategory = 'SYSTEM' | 'API' | 'AUTH' | 'DB';

interface LogEntry {
    id: string;
    timestamp: string;
    level: LogLevel;
    category: LogCategory;
    message: string;
    details?: string;
}

export default function SysLogs() {
    const [activeTab, setActiveTab] = useState<'TERMINAL' | 'API'>('TERMINAL');
    const [isAutoScroll, setIsAutoScroll] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Initial Mock Data Generation
    useEffect(() => {
        const generateMockLogs = () => {
            const mockLogs: LogEntry[] = [];
            const levels: LogLevel[] = ['INFO', 'INFO', 'INFO', 'SUCCESS', 'WARN', 'DEBUG', 'ERROR'];
            const categories: LogCategory[] = ['SYSTEM', 'API', 'AUTH', 'DB'];

            const messages = {
                SYSTEM: ["System boot sequence initiated", "Memory usage checks pass", "Cron job 'daily_cleanup' executed", "Service health check: OK"],
                API: ["GET /api/v1/users/me 200 OK", "POST /api/v1/payments/process 201 Created", "GET /api/v1/metrics 200 OK", "Rate limit warning for IP 192.168.1.1"],
                AUTH: ["User login attempt: admin@odipay.com", "Session token refreshed", "Invalid password attempt for user: test_user", "OAuth callback received"],
                DB: ["Connection pool established", "Query execution time: 12ms", "Transaction rollback: ID #9928", "Database backup completed"]
            };

            for (let i = 0; i < 50; i++) {
                const cat = categories[Math.floor(Math.random() * categories.length)];
                const lvl = levels[Math.floor(Math.random() * levels.length)];
                mockLogs.push({
                    id: Math.random().toString(36).substr(2, 9),
                    timestamp: new Date(Date.now() - (50 - i) * 1000 * 60).toISOString(),
                    level: lvl,
                    category: cat,
                    message: messages[cat][Math.floor(Math.random() * messages[cat].length)],
                    details: Math.random() > 0.7 ? "Request ID: req_" + Math.random().toString(36).substr(2, 6) : undefined
                });
            }
            return mockLogs;
        };

        setLogs(generateMockLogs());
    }, []);

    // Auto-scroll to bottom
    useEffect(() => {
        if (isAutoScroll && bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs, isAutoScroll, activeTab]);

    const handleRefresh = () => {
        // Simulating refresh by adding a new log
        const newLog: LogEntry = {
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString(),
            level: 'INFO',
            category: 'SYSTEM',
            message: "Logs manually refreshed by user",
        };
        setLogs(prev => [...prev, newLog]);
    };

    const handleExport = () => {
        const content = logs.map(l => `[${l.timestamp}] [${l.level}] [${l.category}] ${l.message}`).join('\n');
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `syslogs-${new Date().toISOString()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleScreenshot = () => {
        // Placeholder for screenshot functionality
        alert("Screenshot functionality would capture the terminal view.");
    };

    const getLevelColor = (level: LogLevel) => {
        switch (level) {
            case 'INFO': return 'text-blue-400';
            case 'SUCCESS': return 'text-green-400';
            case 'WARN': return 'text-yellow-400';
            case 'ERROR': return 'text-red-500';
            case 'DEBUG': return 'text-gray-400';
            default: return 'text-gray-300';
        }
    };

    const filteredLogs = logs.filter(log => {
        if (activeTab === 'API' && log.category !== 'API') return false;
        if (searchTerm && !log.message.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
    });

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-20">
            <PageMeta title="System Logs | Odipay" description="Monitor system activity and API logs" />
            <PageBreadcrumb pageTitle="System Logs" />

            {/* Controls Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 p-4 rounded-2xl">
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800/50 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('TERMINAL')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'TERMINAL'
                            ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        <Terminal className="w-4 h-4" />
                        Terminal View
                    </button>
                    <button
                        onClick={() => setActiveTab('API')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'API'
                            ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        <Server className="w-4 h-4" />
                        API Logs
                    </button>
                </div>

                <div className="flex flex-1 md:max-w-md gap-3">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                        <Input
                            type="text"
                            placeholder="Search logs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-10 pl-10 pr-4 dark:bg-white/[0.05] rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 text-gray-900 dark:text-gray-200 placeholder:text-gray-400"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" startIcon={<RefreshCw className="w-4 h-4" />} onClick={handleRefresh}>
                        Refresh
                    </Button>
                    <Button variant="outline" size="sm" startIcon={<Download className="w-4 h-4" />} onClick={handleExport}>
                        Export
                    </Button>
                    <Button variant="primary" size="sm" startIcon={<Camera className="w-4 h-4" />} onClick={handleScreenshot}>
                        Screenshot
                    </Button>
                </div>
            </div>
            {/* Quick Stats Footer */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-xl p-4 flex items-center gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                        <Info className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Total Logs</p>
                        <p className="text-lg font-black text-gray-900 dark:text-white">{logs.length}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-xl p-4 flex items-center gap-3">
                    <div className="p-2 bg-red-50 dark:bg-red-500/10 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Errors</p>
                        <p className="text-lg font-black text-gray-900 dark:text-white">{logs.filter(l => l.level === 'ERROR').length}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-xl p-4 flex items-center gap-3">
                    <div className="p-2 bg-green-50 dark:bg-green-500/10 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Success</p>
                        <p className="text-lg font-black text-gray-900 dark:text-white">{logs.filter(l => l.level === 'SUCCESS').length}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-xl p-4 flex items-center gap-3">
                    <div className="p-2 bg-yellow-50 dark:bg-yellow-500/10 rounded-lg">
                        <Server className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">API Calls</p>
                        <p className="text-lg font-black text-gray-900 dark:text-white">{logs.filter(l => l.category === 'API').length}</p>
                    </div>
                </div>
            </div>
            {/* Terminal Window */}
            <div className={`
                relative rounded no-scrollbar overflow-hidden border border-gray-800 bg-[#0c0c0c] shadow-2xl transition-all duration-300
                ${activeTab === 'TERMINAL' ? 'min-h-[600px]' : 'min-h-[600px]'}
            `}>
                {/* Terminal Header */}
                <div className="flex no-scrollbar items-center justify-between px-4 py-3 bg-[#1a1a1a] border-b border-gray-800">
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                        </div>
                        <span className="ml-3 text-xs font-mono text-gray-500">root@odipay-system:~/logs</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5 text-[10px] font-mono text-gray-500">
                            <div className={`w-1.5 h-1.5 rounded-full ${logs.length > 0 ? "bg-green-500 animate-pulse" : "bg-gray-500"}`}></div>
                            LIVE
                        </span>
                        <div className="h-4 w-[1px] bg-gray-800"></div>
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={isAutoScroll}
                                onChange={(e) => setIsAutoScroll(e.target.checked)}
                                className="w-3 h-3 rounded border-gray-700 bg-transparent text-brand-500 focus:ring-0 focus:ring-offset-0"
                            />
                            <span className="text-[10px] uppercase font-bold text-gray-500 group-hover:text-gray-400 transition-colors">Auto-scroll</span>
                        </label>
                    </div>
                </div>


                {/* Terminal Content */}
                <div className="p-4 font-mono text-sm max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                    {filteredLogs.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-600 py-20">
                            <Terminal className="w-12 h-12 mb-4 opacity-50" />
                            <p>No logs found matching your criteria</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {filteredLogs.map((log) => (
                                <div key={log.id} className="flex items-start gap-3 hover:bg-white/[0.02] p-0.5 -mx-1 px-1 rounded transition-colors group">
                                    <span className="text-gray-600 shrink-0 text-[11px] select-none py-0.5 w-[140px]">{log.timestamp}</span>
                                    <span className={`text-[11px] font-bold shrink-0 w-[60px] ${getLevelColor(log.level)}`}>
                                        {log.level}
                                    </span>
                                    <span className="text-gray-500 font-bold shrink-0 w-[70px] text-[11px]">
                                        [{log.category}]
                                    </span>
                                    <span className="text-gray-300 break-all">
                                        {activeTab === 'TERMINAL' && <span className="text-brand-500 mr-2">$</span>}
                                        {log.message}
                                        {log.details && (
                                            <span className="block mt-1 text-xs text-gray-600 pl-4 border-l-2 border-gray-800 ml-1">
                                                {log.details}
                                            </span>
                                        )}
                                    </span>
                                </div>
                            ))}
                            <div ref={bottomRef} />

                            {/* Blinking Cursor at the end */}
                            <div className="flex items-center gap-2 mt-2 pl-1 animate-pulse">
                                <span className="text-brand-500">$</span>
                                <div className="w-2.5 h-4 bg-gray-500"></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>


        </div>
    );
}
