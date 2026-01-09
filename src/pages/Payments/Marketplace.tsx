import {
    ArrowRight,
    Building2,
    Clock,
    Globe,
    Info,
    Lock,
    MessageSquare,
    Plus,
    RefreshCw,
    Search,
    ShieldCheck,
    Zap
} from "lucide-react";
import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";

interface Product {
    id: string;
    name: string;
    category: "Disbursements" | "Tools" | "Security" | "Connectivity";
    description: string;
    status: "active" | "available" | "pending";
    icon: any;
    fee: string;
    color: string;
}

export default function Marketplace() {
    const [activeTab, setActiveTab] = useState<"All" | "Disbursements" | "Tools" | "Security">("All");
    const [searchTerm, setSearchTerm] = useState("");

    const products: Product[] = [
        {
            id: "1",
            name: "MTN Disbursement",
            category: "Disbursements",
            description: "Direct-to-wallet disbursements for MTN Money users across Uganda.",
            status: "active",
            icon: <img src="/mtnlogo.png" className="w-8 h-8 object-contain" alt="MTN" />,
            fee: "1.5% per tx",
            color: "bg-yellow-400",
        },
        {
            id: "2",
            name: "Airtel Disbursement",
            category: "Disbursements",
            description: "Fast and secure disbursements to Airtel Money wallets nationwide.",
            status: "active",
            icon: <img src="/airtellogo.png" className="w-8 h-8 object-contain" alt="Airtel" />,
            fee: "1.5% per tx",
            color: "bg-red-50",
        },
        {
            id: "3",
            name: "In-Wallet Transfer",
            category: "Disbursements",
            description: "Transfer funds instantly between Odipay business wallets with zero latency.",
            status: "available",
            icon: <Zap className="w-8 h-8" />,
            fee: "Free",
            color: "bg-brand-500",
        },
        {
            id: "4",
            name: "Phone Verification",
            category: "Security",
            description: "Verify customer mobile numbers and ownership in real-time via API.",
            status: "available",
            icon: <ShieldCheck className="w-8 h-8" />,
            fee: "UGX 200 / query",
            color: "bg-emerald-500",
        },
        {
            id: "5",
            name: "Bank Payouts",
            category: "Disbursements",
            description: "Seamlessly move funds from your Odipay wallet to any local bank account.",
            status: "pending",
            icon: <Building2 className="w-8 h-8" />,
            fee: "From 0.5%",
            color: "bg-slate-700",
        },
        {
            id: "8",
            name: "SMS Notifications",
            category: "Tools",
            description: "Instant transaction alerts and OTP management for your customers.",
            status: "available",
            icon: <MessageSquare className="w-8 h-8" />,
            fee: "UGX 35 / SMS",
            color: "bg-purple-600",
        },
    ];

    const filteredProducts = products.filter(p => {
        const matchesTab = activeTab === "All" || p.category === activeTab;
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-20">
            <PageMeta title="Marketplace | Odipay" description="Subscribe to powerful payment tools and APIs" />

            {/* Page Header */}
            <PageBreadcrumb pageTitle="Marketplace" />

            {/* Overview Card */}
            <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-800">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">ODIPAY Marketplace</h2>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1 uppercase">Browse & Subscribe to premium disbursement tools</p>
                    </div>
                    <div className="p-6 flex flex-col justify-center">
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-semibold text-gray-900 dark:text-white">6 Active</span>
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5">Integrations Available</p>
                    </div>
                </div>
            </div>

            {/* Filters Section */}
            <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 overflow-visible">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex p-1 bg-gray-100/50 dark:bg-white/5 rounded-xl w-fit overflow-x-auto no-scrollbar">
                        {["All", "Disbursements", "Tools", "Security"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`px-6 py-2  rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === tab
                                    ? "bg-white dark:bg-slate-800 bg-gray-100 dark:bg-white/5 text-brand-600 dark:text-brand-400 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="relative flex-1 max-w-md">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <Search className="w-4 h-4 text-gray-400" />
                        </div>
                        <Input
                            type="text"
                            placeholder="Search products..."
                            className="w-full h-11 pl-10 pr-4 bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                    <div
                        key={product.id}
                        className="group relative bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300 flex flex-col h-full"
                    >
                        {/* Header: Icon & Status */}
                        <div className="flex items-start justify-between mb-6">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center p-3 ${product.color} text-white  group-hover:scale-105 duration-300`}>
                                {product.icon}
                            </div>

                            {product.status === "active" ? (
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg border border-emerald-100 dark:border-emerald-500/20">
                                    <div className="w-1 h-1 rounded-full bg-emerald-500" />
                                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Active</span>
                                </div>
                            ) : product.status === "pending" ? (
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 dark:bg-amber-500/10 rounded-lg border border-amber-100 dark:border-amber-500/20">
                                    <Clock className="w-3 h-3 text-amber-500" />
                                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Pending</span>
                                </div>
                            ) : null}
                        </div>

                        {/* Content */}
                        <div className="mb-4">
                            <span className="text-xs font-bold text-brand-500 uppercase tracking-widest mb-1 block">
                                {product.category}
                            </span>
                            <h3 className="text-base font-bold text-gray-900 dark:text-white uppercase tracking-tight">
                                {product.name}
                            </h3>
                        </div>

                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed flex-1 mb-8">
                            {product.description}
                        </p>

                        {/* Footer */}
                        <div className="pt-6 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Est. Fee</p>
                                <p className="text-sm font-black text-gray-900 dark:text-white">{product.fee}</p>
                            </div>

                            {product.status === "active" ? (
                                <Button variant="outline" size="sm" className="rounded-xl font-bold">
                                    Manage
                                </Button>
                            ) : product.status === "available" ? (
                                <Button variant="primary" size="sm" className="rounded-xl font-bold">
                                    Subscribe
                                </Button>
                            ) : (
                                <div className="px-3 py-1.5 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-800">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Waitlist</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Info Section */}
            <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand-50 dark:bg-brand-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Info className="w-6 h-6 text-brand-500 dark:text-brand-400" />
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-tight">Need a custom integration?</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium max-w-xl">
                            Our engineering team can help build custom disbursement flows tailored to
                            your specific business logic and regulatory requirements.
                        </p>
                    </div>
                </div>
                <Button variant="primary" size="md" className="px-8 rounded shrink-0">
                    Contact Sales <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
            </div>
        </div>
    );
}
