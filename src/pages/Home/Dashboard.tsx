import {
    Activity,
    DollarSign,
    MoreVertical,
    RefreshCw,
    Users
} from "lucide-react";
import { useState } from "react";
import ReactApexChart from "react-apexcharts";
import PageMeta from "../../components/common/PageMeta";

import RecentActivityTable from "../../components/dashboard/RecentActivityTable";
import Select from "../../components/form/Select";

// -- Mock Data & Chart Configs --

const volumeChartOptions: any = {
    chart: {
        height: 350,
        type: 'area',
        toolbar: { show: false },
        fontFamily: 'Inter, sans-serif',
    },
    colors: ['#3b82f6'],
    dataLabels: { enabled: false },
    stroke: { curve: 'monotoneCubic', width: 2 },
    fill: {
        type: 'gradient',
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.35,
            opacityTo: 0.0,
            stops: [0, 95]
        }
    },
    grid: {
        borderColor: 'rgba(163, 163, 163, 0.05)',
        strokeDashArray: 4,
    },
    xaxis: {
        categories: ['Sep \'25', 'Oct \'25', 'Nov \'25', 'Dec \'25', '2026', 'Feb \'26', 'Mar \'26', 'Apr \'26'],
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
            style: { colors: '#64748b', fontSize: '11px', fontWeight: 500 }
        }
    },
    yaxis: {
        labels: {
            style: { colors: '#64748b', fontSize: '11px' },
            formatter: (val: number) => `${val}k`
        }
    },
    tooltip: { theme: 'dark' }
};

const volumeSeries = [{
    name: 'Infrastructure Traffic',
    data: [150, 230, 180, 290, 210, 420, 310, 580]
}];



const performanceStackedOptions: any = {
    chart: {
        type: 'bar',
        stacked: true,
        toolbar: { show: false },
        fontFamily: 'Inter, sans-serif',
    },
    plotOptions: {
        bar: {
            borderRadius: 6,
            columnWidth: '45%',
        },
    },
    colors: ['#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'],
    dataLabels: { enabled: false },
    grid: {
        borderColor: 'rgba(163, 163, 163, 0.1)',
        strokeDashArray: 4,
    },
    xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
            style: { colors: '#94a3b8', fontSize: '10px', fontWeight: 600 }
        }
    },
    yaxis: {
        labels: {
            style: { colors: '#94a3b8', fontSize: '10px' }
        }
    },
    legend: {
        position: 'top',
        horizontalAlign: 'left',
        fontSize: '12px',
        fontWeight: 500,
        labels: { colors: '#94a3b8' },
        markers: { radius: 12 }
    },
    tooltip: { theme: 'dark' }
};

const performanceSeries = [
    { name: 'Successful', data: [44, 55, 41, 67, 22, 43, 56, 41] },
    { name: 'Pending', data: [13, 23, 20, 8, 13, 27, 33, 22] },
    { name: 'Refunded', data: [11, 17, 15, 15, 21, 14, 15, 13] },
    { name: 'Failed', data: [21, 7, 25, 13, 22, 8, 18, 15] }
];

const channelDonutOptions: any = {
    chart: {
        type: 'donut',
        fontFamily: 'Inter, sans-serif',
    },
    colors: ['#3b82f6', '#60a5fa', '#bfdbfe'],
    labels: ['MTN MoMo', 'Airtel Money', 'Card Payments'],
    dataLabels: { enabled: false },
    plotOptions: {
        pie: {
            donut: {
                size: '80%',
                labels: {
                    show: true,
                    name: {
                        show: true,
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#94a3b8',
                        offsetY: -10
                    },
                    value: {
                        show: true,
                        fontSize: '20px',
                        fontWeight: 800,
                        color: '#1e293b',
                        offsetY: 10,
                        formatter: (val: any) => `${val}%`
                    },
                    total: {
                        show: true,
                        label: 'Total Volume',
                        color: '#94a3b8',
                        formatter: () => '100%'
                    }
                }
            }
        }
    },
    legend: {
        position: 'bottom',
        fontSize: '12px',
        labels: { colors: '#94a3b8' },
        markers: { radius: 12 }
    },
    stroke: { show: false },
    tooltip: { theme: 'dark' }
};

const channelSeries = [55, 30, 15];

// -- Components --

export default function Dashboard() {
    const [filter, setFilter] = useState("Monthly");

    const metrics = [
        { title: "Total Volume (TPV)", value: "UGX 1.4B", change: "+20%", positive: true, icon: <DollarSign className="w-5 h-5" />, series: [30, 40, 35, 50, 49, 60, 70, 91] },
        { title: "Net Settlement", value: "UGX 940.2M", change: "+4%", positive: true, icon: <RefreshCw className="w-5 h-5" />, series: [20, 50, 45, 60, 55, 70, 65, 80] },
        { title: "Success Rate", value: "97.4%", change: "-1.5%", positive: false, icon: <Activity className="w-5 h-5" />, series: [98, 97, 96, 98, 97, 96, 97, 97.4] },
        { title: "Active Terminals", value: "1,240", change: "+7%", positive: true, icon: <Users className="w-5 h-5" />, series: [1100, 1150, 1180, 1200, 1210, 1220, 1230, 1240] },
    ];

    const sparklineOptions: any = {
        chart: {
            type: 'area',
            sparkline: { enabled: true },
            animations: { enabled: true },
        },
        stroke: { curve: 'smooth', width: 2 },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0,
                stops: [0, 100]
            }
        },
        tooltip: { enabled: false },
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-20">
            <PageMeta title="Payment Infrastructure | Odipay" description="Monitor your global payment infrastructure in real-time" />


            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((m, i) => (
                    <div key={i} className="group bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800/10 rounded-xl p-5 transition-all hover:border-brand-500/20 relative overflow-hidden">
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 flex-shrink-0 bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-2xl flex items-center justify-center text-gray-500 dark:text-gray-400 group-hover:scale-110 duration-500 transition-transform">
                                {m.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white tabular-nums leading-none mb-1.5">{m.value}</h3>
                                <div className="flex items-center gap-2">
                                    <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tight truncate">{m.title}</p>
                                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold ${m.positive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {m.change}
                                    </span>
                                </div>
                            </div>
                            <div className="w-14 h-8 opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                                <ReactApexChart
                                    options={{ ...sparklineOptions, colors: [m.positive ? '#10b981' : '#ef4444'] }}
                                    series={[{ name: m.title, data: m.series }]}
                                    type="area"
                                    height="100%"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Analytics Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Transaction Volume Trend (Image 0 Refined) */}
                <div className="lg:col-span-2 bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-3xl p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">Transaction Volume Trend</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Node traffic and liquidity flow trends</p>
                        </div>
                        <div className="flex items-center ">
                            <Select options={[
                                { value: "Daily", label: "Daily" },
                                { value: "Weekly", label: "Weekly" },
                                { value: "Monthly", label: "Monthly" },
                                { value: "Quarterly", label: "Quarterly" },
                                { value: "Annually", label: "Annually" },
                            ]} value={filter} onChange={(val) => setFilter(val)} />
                        </div>
                    </div>
                    <div className="h-[350px]">
                        <ReactApexChart options={volumeChartOptions} series={volumeSeries} type="bar" height="100%" />
                    </div>
                </div>

                {/* Channel Volume */}
                <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-3xl p-8 flex flex-col shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Channel Volume</h3>
                        <button className="p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg text-gray-400">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                        <ReactApexChart options={channelDonutOptions} series={channelSeries} type="donut" height={300} />
                    </div>
                    <div className="mt-8 space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-white/5 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center p-1.5">
                                    <img src="/mtnlogo.png" alt="MTN" className="w-full h-full object-contain" />
                                </div>
                                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">MTN MoMo</span>
                            </div>
                            <span className="text-xs font-black text-gray-900 dark:text-white">55%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-white/5 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center p-1.5">
                                    <img src="/airtellogo.png" alt="Airtel" className="w-full h-full object-contain" />
                                </div>
                                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Airtel Money</span>
                            </div>
                            <span className="text-xs font-black text-gray-900 dark:text-white">30%</span>
                        </div>
                    </div>
                </div>

                {/* Merchant Performance */}
                <div className="lg:col-span-3 bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-3xl p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Status Metrics</h3>
                    </div>
                    <div className="h-[350px]">
                        <ReactApexChart options={performanceStackedOptions} series={performanceSeries} type="bar" height="100%" />
                    </div>
                </div>


            </div>

            {/* Recent Activity Table Component (Image 1 style) */}
            <RecentActivityTable />
        </div>
    );
}
