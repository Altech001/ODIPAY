import { useState } from "react";
import {
    Calendar,
    TrendingUp,
    TrendingDown,
    Activity,
    Clock,
    CheckCircle2,
    XCircle,
    Maximize2
} from "lucide-react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Select from "../../components/form/Select";
import Input from "../../components/form/input/InputField";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
import TransactionWorkflow from "./TransactionWorkflow";

export default function Reports() {
    const [selectedWallet, setSelectedWallet] = useState("ODI ADMIN TEST");
    const [activeChartType, setActiveChartType] = useState("Collections");
    const [isFlowOpen, setIsFlowOpen] = useState(false);

    const walletOptions = [
        { value: "ODI ADMIN TEST", label: "ODI ADMIN TEST" },
        { value: "ODI PAY MAIN", label: "ODI PAY MAIN" },
        { value: "TEST WALLET 2", label: "TEST WALLET 2" },
    ];

    const statCards = [
        { title: "Total", label: "Wallet Balance", value: "UGx 5,000.00", icon: <Activity className="w-5 h-5 text-brand-500" /> },
        { title: "MTN", label: "Collections", value: "UGx 12,450.00", icon: <TrendingUp className="w-5 h-5 text-success-500" /> },
        { title: "Airtel", label: "Collections", value: "UGx 8,200.00", icon: <TrendingUp className="w-5 h-5 text-indigo-500" /> },
        { title: "MTN", label: "Disbursements", value: "UGx 3,100.00", icon: <TrendingDown className="w-5 h-5 text-error-500" /> },
        { title: "Airtel", label: "Disbursements", value: "UGx 1,500.00", icon: <TrendingDown className="w-5 h-5 text-warning-500" /> },
    ];

    const volumeChartOptions: ApexOptions = {
        chart: {
            fontFamily: "Outfit, sans-serif",
            height: 350,
            type: "area",
            toolbar: { show: false },
            animations: { enabled: true },
        },
        colors: ["#3751FF"],
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.45,
                opacityTo: 0.05,
            },
        },
        dataLabels: { enabled: false },
        stroke: { curve: "smooth", width: 3 },
        grid: {
            borderColor: "rgba(0,0,0,0.05)",
            xaxis: { lines: { show: false } },
            yaxis: { lines: { show: true } },
        },
        xaxis: {
            categories: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan"],
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            labels: {
                formatter: (val) => `${val}k`
            }
        },
        tooltip: { theme: "dark" },
    };

    const volumeChartSeries = [
        {
            name: "Volume",
            data: [35, 42, 38, 55, 48, 70, 65],
        },
    ];

    // Success Line Chart Options (for Collections)
    const successLineChartOptions: ApexOptions = {
        chart: {
            type: "line",
            fontFamily: "Outfit, sans-serif",
            toolbar: { show: false },
            sparkline: { enabled: false }
        },
        colors: ["#10B981"],
        stroke: { curve: "smooth", width: 4 },
        markers: { size: 4, strokeColors: "#fff", strokeWidth: 2, hover: { size: 6 } },
        grid: { show: false },
        xaxis: {
            categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            labels: { style: { colors: "#9ca3af", fontSize: "10px", fontWeight: "bold" } },
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: { show: false },
        tooltip: { theme: "dark", y: { formatter: (val) => `${val}% Rate` } },
    };

    const successLineSeries = [
        { name: "Success Rate", data: [92, 88, 95, 85, 98, 91, 94] }
    ];

    // Success Donut Chart Options (for Disbursements)
    const successDonutOptions: ApexOptions = {
        chart: {
            type: "donut",
            fontFamily: "Outfit, sans-serif",
        },
        colors: ["#10B981", "#EF4444", "#F59E0B"],
        labels: ["Successful", "Failed", "Pending"],
        legend: { position: "bottom", fontSize: "10px", fontWeight: "bold" },
        plotOptions: {
            pie: {
                donut: {
                    size: "75%",
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: "Transactions",
                            formatter: () => "124",
                        },
                    },
                },
            },
        },
        dataLabels: { enabled: false },
    };

    const successDonutSeries = [45, 8, 12];

    const recentTransactions = [
        { id: "TXN12345", date: "2026-01-08 14:30", type: "Collection", amount: "UGx 50,000", status: "Successful", channel: "MTN" },
        { id: "TXN12346", date: "2026-01-08 12:15", type: "Disbursement", amount: "UGx 25,000", status: "Failed", channel: "Airtel" },
        { id: "TXN12347", date: "2026-01-07 18:45", type: "Collection", amount: "UGx 120,000", status: "Pending", channel: "MTN" },
        { id: "TXN12348", date: "2026-01-07 10:00", type: "Disbursement", amount: "UGx 10,000", status: "Successful", channel: "Bank" },
    ];

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-20">
            <PageMeta title="Reports & Analytics | Odipay" description="Detailed insights and transaction analytics" />
            <PageBreadcrumb pageTitle="Reports" />

            {/* Filter Section */}
            <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm p-6 overflow-visible">
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-6 uppercase tracking-wider">Filter</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="relative">
                        <label className="absolute -top-2.5 left-3 px-1 bg-white dark:bg-[#1C1C1E] text-[11px] font-bold text-gray-400 dark:text-gray-500 z-10 uppercase tracking-widest">
                            Wallet
                        </label>
                        <Select
                            options={walletOptions}
                            defaultValue={selectedWallet}
                            onChange={(val) => setSelectedWallet(val)}
                            className="h-12 border-gray-200 dark:border-gray-700 rounded-xl pt-2"
                        />
                    </div>
                    <div className="relative">
                        <label className="absolute -top-2.5 left-3 px-1 bg-white dark:bg-[#1C1C1E] text-[11px] font-bold text-gray-400 dark:text-gray-500 z-10 uppercase tracking-widest">
                            From
                        </label>
                        <Input type="date" value="2025-12-07" className="h-12 rounded-xl" />
                    </div>
                    <div className="relative">
                        <label className="absolute -top-2.5 left-3 px-1 bg-white dark:bg-[#1C1C1E] text-[11px] font-bold text-gray-400 dark:text-gray-500 z-10 uppercase tracking-widest">
                            To
                        </label>
                        <Input type="date" value="2026-01-08" className="h-12 rounded-xl" />
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {statCards.map((card, idx) => (
                    <div key={idx} className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 p-5 rounded-2xl shadow-sm hover:border-brand-500/30 transition-colors group">
                        <div className="flex items-center justify-between mb-3 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                            <span>{card.title}</span>
                            <div className="group-hover:scale-110 transition-transform">{card.icon}</div>
                        </div>
                        <div className="text-lg font-black text-gray-900 dark:text-white leading-none mb-2 tracking-tight">
                            {card.value}
                        </div>
                        <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter">
                            {card.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            Transaction Volume (UGX)
                            <span className="bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-md flex items-center gap-1 text-[10px] font-bold text-gray-500">
                                <Calendar className="w-3 h-3" /> 2026
                            </span>
                        </h3>
                        <Button variant="outline" size="sm" onClick={() => setIsFlowOpen(true)} startIcon={<Maximize2 className="w-4 h-4" />}>
                            Show Workflow
                        </Button>
                    </div>
                    <Chart options={volumeChartOptions} series={volumeChartSeries} type="area" height={300} />
                </div>

                {/* Success Rate Card with TabBar */}
                <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Success Volume</h3>

                    {/* Custom TabBar */}
                    <div className="flex p-1 bg-gray-100/50 dark:bg-white/5 rounded-xl mb-8">
                        <button
                            onClick={() => setActiveChartType("Collections")}
                            className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all duration-300 ${activeChartType === "Collections"
                                ? "bg-white dark:bg-white/10 text-brand-600 dark:text-white shadow-sm"
                                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                }`}
                        >
                            Collections
                        </button>
                        <button
                            onClick={() => setActiveChartType("Disbursements")}
                            className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all duration-300 ${activeChartType === "Disbursements"
                                ? "bg-white dark:bg-white/10 text-brand-600 dark:text-white shadow-sm"
                                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                }`}
                        >
                            Disbursements
                        </button>
                    </div>

                    <div className="flex-1 flex items-center justify-center">
                        {activeChartType === "Collections" ? (
                            <div className="w-full">
                                <Chart options={successLineChartOptions} series={successLineSeries} type="line" height={220} />
                                <div className="mt-4 flex justify-around text-[10px] font-bold text-gray-400 uppercase tracking-widest border-t border-gray-100 dark:border-gray-800 pt-4">
                                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-success-500" />Avg: 92%</div>
                                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-brand-500" />Peak: 98%</div>
                                </div>
                            </div>
                        ) : (
                            <Chart options={successDonutOptions} series={successDonutSeries} type="donut" height={260} />
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Transactions Table */}
            <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Recent Transactions</h3>
                    <button className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-gray-50/50 dark:bg-white/[0.01]">
                            <TableRow className="border-b border-gray-100 dark:border-gray-800">
                                <TableCell isHeader className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider py-4 pl-6">ID</TableCell>
                                <TableCell isHeader className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider py-4">Date</TableCell>
                                <TableCell isHeader className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider py-4">Type</TableCell>
                                <TableCell isHeader className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider py-4">Amount</TableCell>
                                <TableCell isHeader className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider py-4">Status</TableCell>
                                <TableCell isHeader className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider py-4 pr-6">Channel</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentTransactions.map((tx) => (
                                <TableRow key={tx.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors">
                                    <TableCell className="py-4 pl-6 text-xs font-medium text-gray-500 dark:text-gray-400">{tx.id}</TableCell>
                                    <TableCell className="py-4 text-xs font-semibold text-gray-900 dark:text-white">{tx.date}</TableCell>
                                    <TableCell className="py-4 text-xs font-medium text-gray-600 dark:text-gray-400">{tx.type}</TableCell>
                                    <TableCell className="py-4 text-xs font-black text-gray-900 dark:text-white">{tx.amount}</TableCell>
                                    <TableCell className="py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${tx.status === "Successful" ? "bg-success-50 text-success-600 dark:bg-success-400/10 dark:text-success-400" :
                                            tx.status === "Failed" ? "bg-error-50 text-error-600 dark:bg-error-400/10 dark:text-error-400" :
                                                "bg-warning-50 text-warning-600 dark:bg-warning-400/10 dark:text-warning-400"
                                            }`}>
                                            {tx.status === "Successful" && <CheckCircle2 className="w-3 h-3" />}
                                            {tx.status === "Failed" && <XCircle className="w-3 h-3" />}
                                            {tx.status === "Pending" && <Clock className="w-3 h-3" />}
                                            {tx.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="py-4 pr-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                                            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">{tx.channel}</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* React Flow Component */}
            {isFlowOpen && (
                <TransactionWorkflow
                    walletName={selectedWallet}
                    onClose={() => setIsFlowOpen(false)}
                />
            )}
        </div>
    );
}
