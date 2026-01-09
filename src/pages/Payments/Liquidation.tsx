import { useState } from "react";
import {
    RefreshCw,
    Download,
    Plus,
    Search,
    Filter,
    Info,
    ChevronDown,
    X
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

export default function Liquidation() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedWallet, setSelectedWallet] = useState("ABAASA ALBERT TEST");
    const [searchTerm, setSearchTerm] = useState("");

    const walletOptions = [
        { value: "ABAASA ALBERT TEST", label: "ABAASA ALBERT TEST" },
        { value: "ODI PAY MAIN", label: "ODI PAY MAIN" },
    ];

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-20">
            <PageMeta title="Liquidations | Odipay" description="Manage and track your wallet liquidations" />

            {/* Page Header */}
            <PageBreadcrumb pageTitle="Liquidations" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                <Button variant="outline" size="sm" startIcon={<RefreshCw className="w-4 h-4" />}>
                    Refresh
                </Button>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" startIcon={<Download className="w-4 h-4" />}>
                        Export
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        startIcon={<Plus className="w-4 h-4" />}
                        onClick={() => setIsModalOpen(true)}
                    >
                        Liquidate
                    </Button>
                </div>
            </div>

            {/* Account Summary Card */}
            <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
                <div className="p-6 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">ODI ADMIN TEST</h2>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1 uppercase">AC/NO: <span className="text-brand-900">OD10773K</span></p>
                </div>
                <div className="p-6 flex flex-col justify-center">
                    <div className="flex items-baseline gap-2">
                        <span className="text-xs font-bold text-gray-500">UGx</span>
                        <span className="text-2xl font-black text-gray-900 dark:text-white">5,000.00</span>
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5">Available Balance</p>
                </div>
            </div>
            </div>

            {/* Filters Section */}
            <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 overflow-visible">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Search and Toggle Row */}
                    <div className="space-y-6">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <Search className="w-4 h-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by account number"
                                className="w-full h-12 pl-10 pr-12 bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button className="absolute inset-y-0 right-3 flex items-center px-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                                <Filter className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <label className="absolute -top-2.5 left-3 px-1 bg-white dark:bg-[#1C1C1E] text-[11px] font-bold text-gray-400 dark:text-gray-500 z-10 uppercase tracking-widest">
                                    From
                                </label>
                                <div className="relative">
                                    <Input
                                        type="date"
                                        defaultValue="2025-12-09"
                                        className="h-12 rounded-xl w-full"
                                    />
                                </div>
                            </div>
                            <div className="relative">
                                <label className="absolute -top-2.5 left-3 px-1 bg-white dark:bg-[#1C1C1E] text-[11px] font-bold text-gray-400 dark:text-gray-500 z-10 uppercase tracking-widest">
                                    To
                                </label>
                                <Input
                                    type="date"
                                    defaultValue="2026-01-08"
                                    className="h-12 rounded-xl w-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Wallet Select */}
                    <div className="relative">
                        <label className="absolute -top-2.5 left-3 px-1 bg-white dark:bg-[#1C1C1E] text-[11px] font-bold text-gray-400 dark:text-gray-500 z-10 uppercase tracking-widest">
                            Wallet
                        </label>
                        <Select
                            options={walletOptions}
                            defaultValue={selectedWallet}
                            onChange={(val) => setSelectedWallet(val)}
                            className="h-12 border-gray-100 dark:border-gray-800 rounded-xl pt-2"
                        />
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden min-h-[400px] flex flex-col">
                <div className="overflow-x-auto flex-1">
                    <Table>
                        <TableHeader className="bg-gray-50/50 dark:bg-white/[0.01]">
                            <TableRow className="border-b border-gray-100 dark:border-gray-800">
                                <TableCell isHeader className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider py-4 pl-6">
                                    <div className="flex items-center gap-1">
                                        DATE CREATED <ChevronDown className="w-3 h-3" />
                                    </div>
                                </TableCell>
                                <TableCell isHeader className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider py-4">AMOUNT</TableCell>
                                <TableCell isHeader className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider py-4">ACCOUNT</TableCell>
                                <TableCell isHeader className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider py-4">BANK</TableCell>
                                <TableCell isHeader className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider py-4">WALLET</TableCell>
                                <TableCell isHeader className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider py-4">TYPE</TableCell>
                                <TableCell isHeader className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider py-4">CREATED BY</TableCell>
                                <TableCell isHeader className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider py-4 pr-6">STATUS</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Empty State */}
                            <TableRow>
                                <TableCell colSpan={8} className="py-20 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/10 rounded-full flex items-center justify-center mb-4">
                                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                                                <Info className="w-6 h-6 text-brand-500" />
                                            </div>
                                        </div>
                                        <div className="bg-blue-50/50 dark:bg-blue-900/10 px-4 py-2 rounded-xl inline-flex items-center gap-2">
                                            <Info className="w-4 h-4 text-brand-500" />
                                            <span className="text-sm font-bold text-brand-600 dark:text-brand-400">No data to display</span>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Liquidate Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="relative w-full max-w-lg bg-white dark:bg-[#1C1C1E] rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Liquidate Wallet</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Info Box */}
                            <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 p-4 rounded-2xl flex items-start gap-3 mb-8">
                                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Info className="w-4 h-4 text-brand-500" />
                                </div>
                                <p className="text-sm font-medium text-blue-700 dark:text-blue-300 leading-relaxed">
                                    An auto request will be made to transfer the amount to this partner's configured bank account.
                                </p>
                            </div>

                            <form className="space-y-6">
                                <div>
                                    <Select
                                        options={walletOptions}
                                        placeholder="Select Wallet"
                                        onChange={(val) => console.log(val)}
                                        className="h-14 border-gray-200 dark:border-gray-700 rounded-2xl pt-2"
                                    />
                                </div>

                                <div className="relative">
                                    <Input
                                        placeholder="Amount *"
                                        className="h-14 rounded-2xl text-lg font-bold"
                                    />
                                </div>

                                <div className="relative">
                                    <Input
                                        placeholder="External Reference Number *"
                                        className="h-14 rounded-2xl mb-2"
                                    />
                                    <p className="text-[10px] font-bold text-gray-400 uppercase px-1">Optional</p>
                                </div>

                                <div className="flex items-center justify-end gap-6 mt-10">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="text-sm font-bold text-brand-600 dark:text-brand-400 hover:underline"
                                    >
                                        Cancel
                                    </button>
                                    <Button variant="primary" size="md" className="px-10 rounded-2xl shadow-lg shadow-brand-500/20">
                                        Submit
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
