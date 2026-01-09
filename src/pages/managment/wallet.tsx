import { ApexOptions } from "apexcharts";
import {
    Clock,
    DollarSign,
    Plus,
    Send,
    TrendingDown,
    TrendingUp,
} from "lucide-react";
import { useState } from "react";
import Chart from "react-apexcharts";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Badge from "../../components/ui/badge/Badge";
import Button from "../../components/ui/button/Button";

export default function Wallets() {
    const [selectedCurrency, setSelectedCurrency] = useState<"USD" | "UGX">("USD");

    const chartOptions: ApexOptions = {
        legend: { show: false },
        colors: ["#465FFF", "#9CB9FF"],
        chart: {
            fontFamily: "Outfit, sans-serif",
            height: 300,
            type: "area",
            toolbar: { show: false },
        },
        stroke: { curve: "smooth", width: [2, 2] },
        fill: {
            type: "gradient",
            gradient: {
                opacityFrom: 0.5,
                opacityTo: 0,
            },
        },
        grid: {
            xaxis: { lines: { show: false } },
            yaxis: { lines: { show: true } },
        },
        dataLabels: { enabled: false },
        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            labels: {
                style: { colors: ["#6B7280"] },
            },
        },
    };

    const chartSeries = [
        {
            name: "Collections",
            data: [310, 400, 280, 510, 420, 109, 100, 120],
        },
        {
            name: "Disbursements",
            data: [110, 320, 450, 320, 340, 520, 410, 480],
        },
    ];

    const Sparkline = ({ data, color }: { data: number[], color: string }) => (
        <div className="h-12 w-24">
            <Chart
                options={{
                    chart: { type: 'area', sparkline: { enabled: true }, animations: { enabled: true } },
                    stroke: { curve: 'smooth', width: 2 },
                    fill: {
                        type: 'gradient',
                        gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0.05 }
                    },
                    colors: [color],
                    tooltip: { enabled: false }
                }}
                series={[{ data }]}
                type="area"
                height="100%"
                width="100%"
            />
        </div>
    );

    const overviewMetrics = [
        {
            title: "Available Balance",
            value: selectedCurrency === "USD" ? "$128,430.00" : "UGX 475,200,000",
            change: "+2.5%",
            isPositive: true,
            icon: <DollarSign className="w-5 h-5 text-brand-500" />,
            sparkData: [30, 40, 35, 50, 49, 60, 70, 91]
        },
        {
            title: "Total Collections",
            value: selectedCurrency === "USD" ? "$45,200.00" : "UGX 167,240,000",
            change: "+9.5%",
            isPositive: true,
            icon: <TrendingUp className="w-5 h-5 text-success-500" />,
            sparkData: [20, 35, 40, 30, 45, 65, 55, 80]
        },
        {
            title: "Total Disbursements",
            value: selectedCurrency === "USD" ? "$28,450.00" : "UGX 105,265,000",
            change: "-1.6%",
            isPositive: false,
            icon: <TrendingDown className="w-5 h-5 text-error-500" />,
            sparkData: [80, 70, 65, 85, 50, 40, 45, 30]
        },
        {
            title: "Pending Payouts",
            value: selectedCurrency === "USD" ? "$12,300.00" : "UGX 45,510,000",
            change: "+3.5%",
            isPositive: true,
            icon: <Clock className="w-5 h-5 text-warning-500" />,
            sparkData: [25, 44, 30, 55, 60, 45, 70, 65]
        },
    ];


    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <PageMeta title="Wallets | Odipay" description="Manage your multi-currency wallets and transactions" />
            <PageBreadcrumb pageTitle="Wallets" />

            {/* Currency Switcher & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex p-1.5 border border-gray-200 bg-white/50 backdrop-blur-sm rounded-2xl dark:border-gray-800 dark:bg-white/[0.03]">
                    <button
                        onClick={() => setSelectedCurrency("USD")}
                        className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${selectedCurrency === "USD"
                            ? "bg-white text-brand-600 shadow-sm dark:bg-gray-800 dark:text-white"
                            : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                            }`}
                    >
                        USD Wallet
                    </button>
                    <button
                        onClick={() => setSelectedCurrency("UGX")}
                        className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${selectedCurrency === "UGX"
                            ? "bg-white text-brand-600 shadow-sm dark:bg-gray-800 dark:text-white"
                            : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                            }`}
                    >
                        UGX Wallet
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    {[
                        { name: "MTN Money", logo: "/mtnlogo.png", in: "$45.2k", out: "$28.4k" },
                        { name: "Airtel Money", logo: "/airtellogo.png", in: "$32.1k", out: "$19.8k" }
                    ].map((provider) => (
                        <div key={provider.name} className="group relative">
                            <div className="flex items-center justify-center w-12 h-10 px-2 bg-white border border-gray-200 rounded dark:bg-white/[0.03] dark:border-gray-800 hover:border-brand-500 transition-all cursor-help">
                                <img src={provider.logo} alt={provider.name} className="max-h-6 w-auto grayscale group-hover:grayscale-0 transition-all" />
                            </div>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 hidden group-hover:block w-44 p-3 bg-gray-900/95 backdrop-blur-sm text-white text-[11px] rounded-xl shadow-xl z-99999 animate-in fade-in zoom-in duration-200">
                                <p className="font-semibold mb-2 text-gray-300 uppercase tracking-wider">{provider.name}</p>
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Total Inflow</span>
                                        <span className="text-success-400 font-bold">{provider.in}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Total Outflow</span>
                                        <span className="text-error-400 font-bold">{provider.out}</span>
                                    </div>
                                </div>
                                <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900/95 rotate-45"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Overview Section - Inspired by Image 1 */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {overviewMetrics.map((metric, index) => (
                    <div key={index} className="p-5 border border-gray-200 bg-white rounded-2xl dark:border-gray-800 dark:bg-white/[0.03] ">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-2.5 bg-gray-50 dark:bg-white/[0.05] rounded-xl">
                                {metric.icon}
                            </div>
                            <Sparkline
                                data={metric.sparkData}
                                color={metric.isPositive ? "#10B981" : "#EF4444"}
                            />
                        </div>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{metric.title}</p>
                                <h3 className="text-xl font-bold text-gray-900 mt-1 dark:text-white leading-tight">
                                    {metric.value}
                                </h3>
                            </div>
                            <Badge
                                variant="light"
                                color={metric.isPositive ? "success" : "error"}
                                size="sm"
                                className="mb-1"
                            >
                                {metric.change}
                            </Badge>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid - Inspired by Image 2 */}
            <div className="grid grid-cols-12 gap-6">
                {/* Statistics Chart */}
                <div className="col-span-12 lg:col-span-8 p-6 border border-gray-200 bg-white rounded-2xl dark:border-gray-800 dark:bg-white/[0.03] ">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Transaction Performance</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Daily funds flow overview</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 mr-4">
                                <span className="w-3 h-3 rounded-full bg-brand-500"></span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">Collections</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-full bg-brand-200 dark:bg-brand-500/30"></span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">Disbursements</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-[300px]">
                        <Chart options={chartOptions} series={chartSeries} type="area" height="100%" />
                    </div>
                </div>

                {/* Quick Actions & Cards */}
                <div className="col-span-12 lg:col-span-4 space-y-6 text-xs ">
                    {/* Conversion Funnel - Inspired by requested image */}
                    <div className="p-6 border border-gray-200 bg-white rounded-2xl dark:border-gray-800 dark:bg-white/[0.03]  overflow-hidden">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Conversion Funnel</h3>
                        </div>
                        <div className="h-[210px]">
                            <Chart
                                options={{
                                    chart: {
                                        type: 'bar',
                                        stacked: true,
                                        toolbar: { show: false },
                                        fontFamily: "Outfit, sans-serif",
                                    },
                                    plotOptions: {
                                        bar: {
                                            horizontal: false,
                                            columnWidth: '35%',
                                            borderRadius: 8,
                                            borderRadiusApplication: 'end',
                                            borderRadiusWhenStacked: 'all',
                                        },
                                    },
                                    colors: ["#3751FF", "#6366F1", "#939AFE", "#C7D7FE"],
                                    dataLabels: { enabled: false },
                                    legend: { show: false },
                                    grid: {
                                        xaxis: { lines: { show: false } },
                                        yaxis: { lines: { show: false } },
                                        padding: { top: -20, bottom: -10, left: -10, right: -10 }
                                    },
                                    xaxis: {
                                        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
                                        axisBorder: { show: false },
                                        axisTicks: { show: false },
                                        labels: { style: { colors: ["#6B7280"], fontSize: '11px' } }
                                    },
                                    yaxis: {
                                        show: false,
                                    },
                                    tooltip: {
                                        theme: 'dark'
                                    }
                                }}
                                series={[
                                    { name: 'Ad Impressions', data: [44, 55, 41, 67, 22, 43, 56, 41] },
                                    { name: 'Website Session', data: [13, 23, 20, 8, 13, 27, 13, 23] },
                                    { name: 'App Download', data: [11, 17, 15, 15, 21, 14, 18, 20] },
                                    { name: 'New Users', data: [21, 7, 25, 13, 22, 8, 17, 19] },
                                ]}
                                type="bar"
                                height="100%"
                            />
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4">
                            {[
                                { label: "Ad Impressions", color: "bg-[#3751FF]" },
                                { label: "Website Session", color: "bg-[#6366F1]" },
                                { label: "App Download", color: "bg-[#939AFE]" },
                                { label: "New Users", color: "bg-[#C7D7FE]" },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-1.5">
                                    <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
                                    <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Metrics */}
                    <div className="p-5 border border-gray-200 bg-white rounded-2xl dark:border-gray-800 dark:bg-white/[0.03] space-y-4">
                        <h4 className="font-bold text-gray-900 dark:text-white">Quick Insights</h4>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-success-50 dark:bg-success-500/10 rounded-lg">
                                        <TrendingUp className="w-4 h-4 text-success-500" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Revenue Change</span>
                                </div>
                                <span className="text-sm font-bold text-success-500">+12%</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-error-50 dark:bg-error-500/10 rounded-lg">
                                        <TrendingDown className="w-4 h-4 text-error-500" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Churn Rate</span>
                                </div>
                                <span className="text-sm font-bold text-error-500">2.4%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
