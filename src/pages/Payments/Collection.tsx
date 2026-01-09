import { useState } from "react";
import {
    RefreshCw,
    Plus,
    Info,
    ChevronDown,
    X,
    ArrowRight,
    ChevronUp,
} from "lucide-react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Select from "../../components/form/Select";
import Input from "../../components/form/input/InputField";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../components/ui/table";

type Provider = "MTN" | "Airtel" | null;

export default function Collection() {
    const [selectedProvider, setSelectedProvider] = useState<Provider>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showExtraFields, setShowExtraFields] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const providers = [
        {
            id: "MTN",
            name: "MTN MoMo",
            image: "/mtnlogo.png",
            color: "bg-yellow-400",
            description: "Collect payments via MTN Mobile Money"
        },
        {
            id: "Airtel",
            name: "Airtel Money",
            image: "/airtellogo.png",
            color: "bg-gray-100",
            description: "Collect payments via Airtel Money"
        }
    ];

    if (!selectedProvider) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
                <PageMeta title="Choose Provider | Collections" description="Select a service provider to continue" />
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-4">
                        Select Service Provider
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                        Choose a provider to start managing your mobile money collections
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                    {providers.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => setSelectedProvider(p.id as Provider)}
                            className="group relative bg-gray-50 border border-gray-300 dark:bg-white/[0.03] border-gray-100 dark:border-gray-800 rounded-3xl p-10 transition-all duration-300 hover:border-brand-500 dark:hover:border-brand-500/50 hover:shadow-2xl hover:shadow-brand-500/5 text-left overflow-hidden"
                        >
                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className={`w-24 h-24 rounded-xl flex items-center justify-center p-4 mb-6 ${p.color}  transition-transform duration-500 group-hover:scale-110`}>
                                    <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight mb-2">
                                    {p.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-8">
                                    {p.description}
                                </p>
                                <div className="flex items-center gap-2 text-brand-500 font-black uppercase tracking-widest text-xs group-hover:gap-3 transition-all">
                                    Continue <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-brand-500/5 rounded-full blur-2xl group-hover:bg-brand-500/10 transition-all" />
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-20">
            <PageMeta title={`Collections - ${selectedProvider} | Odipay`} description="Manage your mobile money collections" />

            {/* Page Header */}
            <div className="flex items-center justify-between">
                <PageBreadcrumb pageTitle="Collections" />
                <button
                    onClick={() => setSelectedProvider(null)}
                    className="text-[10px] font-black text-gray-400 hover:text-brand-500 uppercase tracking-widest flex items-center gap-2 transition-colors"
                >
                    <X className="w-3 h-3" /> Change Provider
                </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                <Button variant="outline" size="sm" startIcon={<RefreshCw className="w-4 h-4" />}>
                    Refresh
                </Button>
                <div className="flex items-center gap-3">
                    <Button
                        variant="primary"
                        size="sm"
                        startIcon={<Plus className="w-4 h-4" />}
                        onClick={() => setIsModalOpen(true)}
                    >
                        Make a Collection
                    </Button>
                </div>
            </div>

            {/* Account Summary Card */}
            <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b md:border-b-0 md:border-r  border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">ABAASA ALBERT TEST</h2>
                            <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase text-white ${selectedProvider === "MTN" ? "bg-yellow-300" : "bg-red-300"}`}>
                                {selectedProvider}
                            </div>
                        </div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">AC/NO: <span className="text-brand-900">OD10773K</span></p>
                    </div>
                    <div className="p-6 flex flex-col justify-center">
                        <div className="flex items-baseline gap-2">
                            <span className="text-xs font-bold text-gray-500 underline decoration-brand-500/30 underline-offset-4 tracking-widest">UGX</span>
                            <span className="text-2xl font-black text-gray-900 dark:text-white tabular-nums">1,240,500.00</span>
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">Net Collected Balance</p>
                    </div>
                </div>
            </div>

            {/* Filters Section */}
            <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 overflow-visible">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <div className="relative">
                            <Input
                                placeholder="Search by payer number or name"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <label className="absolute -top-2.5 left-3 px-1 bg-white dark:bg-gray-800 text-[11px] font-bold text-gray-400 dark:text-gray-500 z-10 uppercase tracking-widest">
                                    From
                                </label>
                                <Input type="date" defaultValue="2025-12-09" className="h-11 rounded-xl w-full" />
                            </div>
                            <div className="relative">
                                <label className="absolute -top-2.5 left-3 px-1 bg-white dark:bg-gray-800 text-[11px] font-bold text-gray-400 dark:text-gray-500 z-10 uppercase tracking-widest">
                                    To
                                </label>
                                <Input type="date" defaultValue="2026-01-08" className="h-11 rounded-xl w-full" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative col-span-2">
                            <label className="absolute -top-2.5 left-3 px-1 bg-white dark:bg-gray-800 text-[11px] font-bold text-gray-400 dark:text-gray-500 z-10 uppercase tracking-widest">
                                Wallet
                            </label>
                            <Select
                                options={[
                                    { value: "ABAASA ALBERT TEST", label: "ABAASA ALBERT TEST (ITX)" },
                                    { value: "ODI PAY MAIN", label: "ODI PAY MAIN" }
                                ]}
                                onChange={() => { }}
                                defaultValue="ABAASA ALBERT TEST"
                                className="h-11 border-gray-100 dark:border-gray-800 rounded-xl pt-2"
                            />
                        </div>
                        <div className="relative">
                            <label className="absolute -top-2.5 left-3 px-1 bg-white dark:bg-gray-800 text-[11px] font-bold text-gray-400 dark:text-gray-500 z-10 uppercase tracking-widest">
                                Request status
                            </label>
                            <Select
                                options={[
                                    { value: "All", label: "All Statuses" },
                                    { value: "Success", label: "Success" },
                                    { value: "Pending", label: "Pending" },
                                    { value: "Failed", label: "Failed" }
                                ]}
                                onChange={() => { }}
                                className="h-11 border-gray-100 dark:border-gray-800 rounded-xl pt-2"
                            />
                        </div>
                        <div className="relative">
                            <label className="absolute -top-2.5 left-3 px-1 bg-white dark:bg-gray-800 text-[11px] font-bold text-gray-400 dark:text-gray-500 z-10 uppercase tracking-widest">
                                Vendors
                            </label>
                            <Select
                                options={[
                                    { value: "All", label: "All Vendors" },
                                    { value: "MTN", label: "MTN" },
                                    { value: "Airtel", label: "Airtel" }
                                ]}
                                onChange={() => { }}
                                className="h-11 border-gray-100 dark:border-gray-800 rounded-xl pt-2"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden min-h-[400px] flex flex-col shadow-sm">
                <Table>
                    <TableHeader className="bg-gray-50/50 dark:bg-white/[0.01]">
                        <TableRow className="border-b border-gray-100 dark:border-gray-800">
                            <TableCell isHeader className="text-[10px] font-bold text-gray-500 uppercase py-4 pl-6 flex items-center gap-1">
                                DATE CREATED <ChevronDown className="w-3 h-3" />
                            </TableCell>
                            <TableCell isHeader className="text-[10px] font-bold text-gray-500 uppercase py-4">PAYER</TableCell>
                            <TableCell isHeader className="text-[10px] font-bold text-gray-500 uppercase py-4">AMOUNT COLLECTED</TableCell>
                            <TableCell isHeader className="text-[10px] font-bold text-gray-500 uppercase py-4">CHARGES</TableCell>
                            <TableCell isHeader className="text-[10px] font-bold text-gray-500 uppercase py-4">AMOUNT RECEIVED</TableCell>
                            <TableCell isHeader className="text-[10px] font-bold text-gray-500 uppercase py-4">REASON</TableCell>
                            <TableCell isHeader className="text-[10px] font-bold text-gray-500 uppercase py-4">VENDOR</TableCell>
                            <TableCell isHeader className="text-[10px] font-bold text-gray-500 uppercase py-4 pr-6">STATUS</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={8} className="py-20 text-center">
                                <div className="flex flex-col items-center justify-center">
                                    <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                                        <Info className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">No collection records found</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>

            {/* Make a Collection Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-99999 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Make An Amount Collection</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Wallet Field */}
                                <div className="relative">
                                    <label className="absolute -top-2.5 left-3 px-1 bg-white dark:bg-gray-800 text-[11px] font-bold text-gray-400 dark:text-gray-500 z-10 uppercase tracking-widest">
                                        Wallet*
                                    </label>
                                    <Select
                                        options={[{ value: "ABAASA ALBERT TEST", label: "ABAASA ALBERT TEST (ITX)" }]}
                                        defaultValue="ABAASA ALBERT TEST"
                                        onChange={() => { }}
                                        className="h-14 border-gray-200 dark:border-gray-700 rounded-2xl pt-2"
                                    />
                                </div>

                                {/* Payer Number Field */}
                                <div className="relative">
                                    <Input
                                        placeholder="Payer number *"
                                        className="h-14 rounded-2xl"
                                    />
                                </div>

                                {/* Amount Field */}
                                <div className="relative">
                                    <Input
                                        placeholder="Amount *"
                                        className="h-14 rounded-2xl font-bold"
                                    />
                                </div>

                                {/* Note to Payer Field */}
                                <div className="relative">
                                    <label className="absolute -top-2.5 left-3 px-1 bg-white dark:bg-gray-800 text-[11px] font-bold text-gray-400 dark:text-gray-500 z-10 uppercase tracking-widest">
                                        Note to payer *
                                    </label>
                                    <Input
                                        defaultValue="Payment"
                                        className="h-14 rounded-2xl pt-2"
                                    />
                                </div>

                                {/* Extra Fields Accordion */}
                                <div className="space-y-4">
                                    <button
                                        onClick={() => setShowExtraFields(!showExtraFields)}
                                        className="flex items-center justify-between w-full text-xs font-bold text-brand-600 uppercase tracking-widest px-1"
                                    >
                                        Extra fields
                                        {showExtraFields ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    </button>

                                    {showExtraFields && (
                                        <div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
                                            <Input placeholder="Note to self" className="h-14 rounded-2xl" />
                                            <Input placeholder="External reference" className="h-14 rounded-2xl" />
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-end gap-6 pt-4">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="text-sm font-bold text-brand-600 dark:text-brand-400 hover:underline transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <Button
                                        variant="primary"
                                        size="md"
                                        className="px-10 rounded-2xl shadow-lg shadow-brand-500/20"
                                    >
                                        Submit
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
