import { useState } from "react";
import {
    FileText,
    Download,
    RotateCw,
    Calendar as CalendarIcon,
    Info,
    ChevronLeft,
    ChevronRight
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

export default function WalletStatement() {
    const [, setWallet] = useState("ODI ADMIN TEST");
    const [fromDate, setFromDate] = useState("2025-12-09");
    const [toDate, setToDate] = useState("2026-01-08");
    const [isLoading, setIsLoading] = useState(false);

    const walletOptions = [
        { value: "ODI ADMIN TEST", label: "ODI ADMIN TEST" },
        { value: "ODI PAY MAIN", label: "ODI PAY MAIN" },
    ];

    const handleRefresh = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1000);
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            <PageMeta title="Wallet Statement | Odipay" description="View and export your wallet transaction history" />
            <PageBreadcrumb pageTitle="Wallet Statement" />

            {/* Account Info Header */}
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

            {/* Actions & Filters Card */}
            <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm">
                {/* Top Actions Bar */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRefresh}
                            className={isLoading ? "animate-spin-slow" : ""}
                            startIcon={<RotateCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />}
                        >
                            Refresh
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" startIcon={<FileText className="w-4 h-4" />}>
                            Export CSV
                        </Button>
                        <Button variant="primary" size="sm" startIcon={<Download className="w-4 h-4" />}>
                            PDF Statement
                        </Button>
                    </div>
                </div>

                {/* Filter Row */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Wallet Select */}
                        <div className="relative">
                            <label className="absolute -top-2.5 left-3 px-1 bg-white dark:bg-[#1C1C1E] text-[11px] font-bold text-gray-400 dark:text-gray-500 z-10 uppercase tracking-wider">
                                Wallet
                            </label>
                            <Select
                                options={walletOptions}
                                onChange={(val) => setWallet(val)}
                                className="w-full border-gray-200 dark:border-gray-700 rounded-xl pt-2"
                            />
                        </div>

                        {/* From Date */}
                        <div className="relative">
                            <label className="absolute -top-2.5 left-3 px-1 bg-white dark:bg-[#1C1C1E] text-[11px] font-bold text-gray-400 dark:text-gray-500 z-10 uppercase tracking-wider">
                                From
                            </label>
                            <div className="relative">
                                <Input
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    className="w-full pl-10"
                                />
                                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                        </div>

                        {/* To Date */}
                        <div className="relative">
                            <label className="absolute -top-2.5 left-3 px-1 bg-white dark:bg-[#1C1C1E] text-[11px] font-bold text-gray-400 dark:text-gray-500 z-10 uppercase tracking-wider">
                                To
                            </label>
                            <div className="relative">
                                <Input
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    className="w-full pl-10"
                                />
                                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-gray-50 dark:bg-white/[0.02]">
                            <TableRow className="border-y border-gray-100 dark:border-gray-800">
                                <TableCell isHeader className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider py-4">Date Created</TableCell>
                                <TableCell isHeader className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider py-4">Transaction ID</TableCell>
                                <TableCell isHeader className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider py-4">Narration</TableCell>
                                <TableCell isHeader className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider py-4">Transaction Type</TableCell>
                                <TableCell isHeader className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider py-4">Debit</TableCell>
                                <TableCell isHeader className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider py-4">Credit</TableCell>
                                <TableCell isHeader className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider py-4">Balance</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Empty State matching image */}
                            <TableRow>
                                <TableCell colSpan={7} className="py-32 text-center">
                                    <div className="inline-flex flex-col items-center">
                                        <div className="flex items-center gap-3 px-6 py-3 bg-[#EAF7FF] dark:bg-blue-500/10 rounded-full border border-blue-100 dark:border-blue-500/20">
                                            <Info className="w-5 h-5 text-blue-500" />
                                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">No data to display</span>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination inspired by image */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-8 bg-gray-50/30 dark:bg-transparent">
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase">Rows per page:</span>
                        <select className="bg-transparent text-[11px] font-bold text-gray-700 dark:text-gray-300 outline-none">
                            <option>10</option>
                            <option>20</option>
                            <option>50</option>
                        </select>
                    </div>
                    <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 tracking-tighter">0–0 of 0</span>
                    <div className="flex items-center gap-1">
                        <button className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded text-gray-400 cursor-not-allowed" disabled>
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded text-gray-400 cursor-not-allowed" disabled>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
