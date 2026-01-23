
import { useState, useEffect, useRef } from "react";
import {
    FileText,
    Download,
    RotateCw,
    Calendar as CalendarIcon,
    Info,
    ChevronLeft,
    ChevronRight,
    Search,
    Filter,
    Plus
} from "lucide-react";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { toast } from "sonner";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Select from "../../components/form/Select";
import Input from "../../components/form/input/InputField";
import { Modal } from "../../components/ui/modal";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
import { useWalletsStore } from "../../store/walletsStore";
import Badge from "../../components/ui/badge/Badge";

export default function WalletStatement() {
    const {
        wallets,
        currentWallet,
        ledgerEntries,
        ledgerPagination,
        isLoading,
        fetchWallets,
        createWallet,
        setCurrentWallet,
        fetchWalletLedger,
    } = useWalletsStore();

    // Dialog state
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState('UGX');

    // Date Range State
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: subDays(new Date(), 30),
        to: new Date(),
    });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const datePickerRef = useRef<HTMLDivElement>(null);

    // Pagination & Search
    const [rowsPerPage, setRowsPerPage] = useState(50);
    const [searchQuery, setSearchQuery] = useState("");

    // Initialize data
    useEffect(() => {
        fetchWallets();
    }, [fetchWallets]);

    // Fetch ledger when wallet or filters change
    useEffect(() => {
        if (currentWallet) {
            fetchWalletLedger(
                currentWallet.id,
                1,
                rowsPerPage,
                dateRange?.from ? startOfDay(dateRange.from) : undefined,
                dateRange?.to ? endOfDay(dateRange.to) : undefined
            );
        }
    }, [currentWallet, dateRange, rowsPerPage, fetchWalletLedger]);

    // Handle Outside Click for Date Picker
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
                setShowDatePicker(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleCreateWallet = async () => {
        setIsCreating(true);
        try {
            await createWallet(selectedCurrency);
            toast.success(`${selectedCurrency} wallet created successfully!`);
            setIsDialogOpen(false);
            setSelectedCurrency('UGX');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to create wallet');
        } finally {
            setIsCreating(false);
        }
    };

    const handleRefresh = () => {
        if (currentWallet) {
            fetchWalletLedger(
                currentWallet.id,
                ledgerPagination.page,
                rowsPerPage,
                dateRange?.from ? startOfDay(dateRange.from) : undefined,
                dateRange?.to ? endOfDay(dateRange.to) : undefined
            );
            toast.success("Statement refreshed");
        }
    };

    const handleExportCSV = () => {
        if (ledgerEntries.length === 0) {
            toast.error("No data to export");
            return;
        }

        const headers = ["Date", "Transaction ID", "Description", "Type", "Amount", "Balance After"];
        const csvRows = ledgerEntries.map(entry => [
            format(new Date(entry.createdAt), "yyyy-MM-dd HH:mm:ss"),
            entry.transactionId || entry.id,
            entry.description,
            entry.type,
            entry.amount,
            entry.balanceAfter
        ]);

        const csvContent = [
            headers.join(","),
            ...csvRows.map(row => row.map(cell => `"${cell}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `wallet_statement_${currentWallet?.id || 'export'}_${format(new Date(), "yyyyMMdd")}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("CSV Statement exported");
    };

    const handlePaginationChange = (page: number) => {
        if (currentWallet) {
            fetchWalletLedger(
                currentWallet.id,
                page,
                rowsPerPage,
                dateRange?.from ? startOfDay(dateRange.from) : undefined,
                dateRange?.to ? endOfDay(dateRange.to) : undefined
            );
        }
    };

    const walletOptions = wallets.map(w => ({
        value: w.id,
        label: `${w.currency} Wallet (${w.id.substring(0, 8)})`
    }));

    return (
        <div className="space-y-6 max-w-8xl  mx-auto pb-10">
            <PageMeta title="Wallet Statement | Odipay" description="View and export your wallet transaction history" />
            <PageBreadcrumb pageTitle="Wallet Statement" />

            {/* Account Info Header */}
            {currentWallet && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-5 sm:p-6 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-800 bg-linear-to-r from-brand-50/50 to-transparent dark:from-brand-900/5">
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">
                                {currentWallet.currency} Wallet
                            </h2>
                            <Badge variant="light" color="success" size="sm" className="h-5">Active</Badge>
                        </div>
                        <p className="text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                            Wallet ID: <span className="text-brand-600 font-mono tracking-tighter">{currentWallet.id}</span>
                        </p>
                    </div>
                    <div className="p-5 sm:p-6 flex flex-col justify-center">
                        <div className="flex items-baseline gap-2">
                            <span className="text-xs sm:text-sm font-bold text-gray-400">{currentWallet.currency}</span>
                            <span className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                                {parseFloat(currentWallet.balance.availableBalance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">Available Balance</p>
                    </div>
                </div>
            )}

            {/* Actions & Filters Card */}
            <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm">
                {/* Top Actions Bar */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search transactions..."
                                className="pl-10 h-10 w-full sm:min-w-[300px]"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleRefresh}
                                className={`flex-1 sm:flex-none ${isLoading ? "animate-spin-slow" : ""}`}
                                disabled={isLoading}
                                startIcon={<RotateCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />}
                            >
                                {isLoading ? "..." : "Refresh"}
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => setIsDialogOpen(true)}
                                className="flex-1 sm:flex-none"
                                startIcon={<Plus className="w-4 h-4" />}
                            >
                                New Wallet
                            </Button>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 sm:flex-none"
                            startIcon={<FileText className="w-4 h-4" />}
                            onClick={handleExportCSV}
                        >
                            Export CSV
                        </Button>
                        <Button variant="primary" size="sm" className="flex-1 sm:flex-none" startIcon={<Download className="w-4 h-4" />}>
                            PDF
                        </Button>
                    </div>
                </div>

                {/* Filter Row */}
                <div className="p-4 bg-gray-50/50 dark:bg-white/[0.01] border-b border-gray-100 dark:border-gray-800">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        {/* Wallet Select */}
                        <div className="w-full md:w-64">
                            <Select
                                value={currentWallet?.id}
                                options={walletOptions}
                                onChange={(val) => {
                                    const wallet = wallets.find(w => w.id === val);
                                    if (wallet) setCurrentWallet(wallet);
                                }}
                                className="!h-10 text-xs font-semibold"
                            />
                        </div>

                        {/* Date Picker Component */}
                        <div className="relative w-full md:w-auto" ref={datePickerRef}>
                            <button
                                onClick={() => setShowDatePicker(!showDatePicker)}
                                className="flex items-center justify-between md:justify-start gap-2 px-4 h-10 w-full bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:border-brand-500 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                                    <span className="text-xs sm:text-sm whitespace-nowrap">
                                        {dateRange?.from ? (
                                            dateRange.to ? (
                                                <>{format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd, y")}</>
                                            ) : (
                                                format(dateRange.from, "MMM dd, y")
                                            )
                                        ) : (
                                            "Select date range"
                                        )}
                                    </span>
                                </div>
                                <ChevronRight className={`w-4 h-4 transition-transform ${showDatePicker ? 'rotate-90' : ''}`} />
                            </button>

                            {showDatePicker && (
                                <div className="absolute top-12 left-0 z-50 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200 origin-top-left overflow-x-auto max-w-[95vw]">
                                    <DayPicker
                                        mode="range"
                                        selected={dateRange}
                                        onSelect={setDateRange}
                                        numberOfMonths={window.innerWidth > 768 ? 2 : 1}
                                        className="!m-0"
                                        classNames={{
                                            today: `!text-brand-600 !font-bold`,
                                            selected: `!bg-brand-600 !text-white`,
                                            range_start: `!bg-brand-600 !text-white !rounded-l-full`,
                                            range_end: `!bg-brand-600 !text-white !rounded-r-full`,
                                            range_middle: `!bg-brand-50 !text-brand-900 dark:!bg-brand-900/20 dark:!text-brand-100`,
                                        }}
                                    />
                                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-2">
                                        <Button variant="outline" size="sm" onClick={() => setShowDatePicker(false)}>Cancel</Button>
                                        <Button variant="primary" size="sm" onClick={() => setShowDatePicker(false)}>Apply</Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="hidden md:flex flex-1"></div>

                        <div className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-50/50 dark:bg-brand-900/10 rounded-full border border-brand-100 dark:border-brand-900/20">
                            <Filter className="w-3.5 h-3.5 text-brand-600" />
                            <span className="text-[10px] font-bold text-brand-900 dark:text-brand-400 uppercase tracking-widest">
                                {ledgerPagination.total || 0} Entries
                            </span>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-gray-50/30 dark:bg-white/[0.02]">
                            <TableRow className="border-y border-gray-100 dark:border-gray-800">
                                <TableCell isHeader className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-4">Date & Time</TableCell>
                                <TableCell isHeader className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-4">Reference</TableCell>
                                <TableCell isHeader className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-4">Narration</TableCell>
                                <TableCell isHeader className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-4">Status</TableCell>
                                <TableCell isHeader className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-4 text-right">Debit</TableCell>
                                <TableCell isHeader className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-4 text-right">Credit</TableCell>
                                <TableCell isHeader className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-4 text-right">Balance</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <RotateCw className="w-8 h-8 text-brand-500 animate-spin" />
                                            <p className="text-sm text-gray-500 font-medium">Fetching transactions...</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : ledgerEntries.length > 0 ? (
                                ledgerEntries.filter(e =>
                                    e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    (e.transactionId && e.transactionId.includes(searchQuery))
                                ).map((entry) => {
                                    const amountVal = parseFloat(entry.amount);
                                    const isDebit = entry.type === 'DEBIT' || amountVal < 0;
                                    const displayAmount = Math.abs(amountVal).toLocaleString(undefined, { minimumFractionDigits: 2 });

                                    return (
                                        <TableRow key={entry.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors border-b border-gray-100/50 dark:border-gray-800/50">
                                            <TableCell className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                        {format(new Date(entry.createdAt), "MMM dd, yyyy")}
                                                    </span>
                                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                                                        {format(new Date(entry.createdAt), "HH:mm:ss aaa")}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6">
                                                <span className="text-[11px] font-mono font-bold text-brand-600 bg-brand-50 dark:bg-brand-900/20 px-2 py-1 rounded">
                                                    {entry.transactionId || entry.id.substring(0, 10).toUpperCase()}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-6">
                                                <p className="text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate font-medium">
                                                    {entry.description}
                                                </p>
                                            </TableCell>
                                            <TableCell className="px-6">
                                                <Badge
                                                    variant="light"
                                                    color={isDebit ? "error" : "success"}
                                                    size="sm"
                                                    className="font-black uppercase tracking-widest text-[8px] h-5"
                                                >
                                                    {entry.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-6 text-right">
                                                {isDebit ? (
                                                    <span className="text-sm font-bold text-error-600 font-mono">-{displayAmount}</span>
                                                ) : (
                                                    <span className="text-gray-200 dark:text-gray-800">0.00</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="px-6 text-right">
                                                {!isDebit ? (
                                                    <span className="text-sm font-bold text-success-600 font-mono">+{displayAmount}</span>
                                                ) : (
                                                    <span className="text-gray-200 dark:text-gray-800">0.00</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="px-6 text-right">
                                                <div className="flex flex-col items-end">
                                                    <span className="text-sm font-black text-gray-900 dark:text-white font-mono">
                                                        {parseFloat(entry.balanceAfter).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                    </span>
                                                    <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter">Running</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="py-32 text-center">
                                        <div className="inline-flex flex-col items-center">
                                            <div className="flex items-center gap-3 px-6 py-3 bg-[#EAF7FF] dark:bg-blue-500/10 rounded-full border border-blue-100 dark:border-blue-500/20">
                                                <Info className="w-5 h-5 text-blue-500" />
                                                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">No transactions found for the selected period</span>
                                            </div>
                                            <p className="mt-4 text-xs text-gray-500">Try adjusting your filters or date range.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30 dark:bg-transparent">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Rows:</span>
                        <select
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 text-[11px] font-bold text-gray-700 dark:text-gray-300 outline-none hover:border-brand-500 transition-colors cursor-pointer shadow-theme-xs"
                            value={rowsPerPage}
                            onChange={(e) => setRowsPerPage(Number(e.target.value))}
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                        <span className="hidden sm:block text-[11px] font-bold text-gray-400 dark:text-gray-600 ml-4">
                            Showing {ledgerPagination.total > 0 ? (ledgerPagination.page - 1) * rowsPerPage + 1 : 0} to {Math.min(ledgerPagination.page * rowsPerPage, ledgerPagination.total)} of {ledgerPagination.total} results
                        </span>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2">
                        <button
                            className="flex items-center gap-1 px-3 py-1.5 hover:bg-white dark:hover:bg-white/5 rounded-xl text-[11px] font-black text-gray-600 dark:text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-800 shadow-theme-xs"
                            disabled={ledgerPagination.page === 1 || isLoading}
                            onClick={() => handlePaginationChange(ledgerPagination.page - 1)}
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">PREV</span>
                        </button>

                        <div className="flex gap-1 items-center px-1">
                            {[...Array(ledgerPagination.totalPages)].map((_, i) => {
                                const pageNum = i + 1;
                                // Only show 5 pages max with current in middle if possible
                                if (
                                    ledgerPagination.totalPages > 5 &&
                                    (pageNum < ledgerPagination.page - 2 || pageNum > ledgerPagination.page + 2) &&
                                    pageNum !== 1 &&
                                    pageNum !== ledgerPagination.totalPages
                                ) {
                                    if (pageNum === ledgerPagination.page - 3 || pageNum === ledgerPagination.page + 3) {
                                        return <span key={pageNum} className="text-gray-400 px-1">...</span>;
                                    }
                                    return null;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePaginationChange(pageNum)}
                                        className={`w-8 h-8 flex items-center justify-center rounded-xl text-[11px] font-black transition-all shadow-theme-xs ${ledgerPagination.page === pageNum
                                            ? 'bg-brand-600 text-white border border-brand-700'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-white/5 border border-transparent hover:border-gray-100 dark:hover:border-gray-800'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            className="flex items-center gap-1 px-3 py-1.5 hover:bg-white dark:hover:bg-white/5 rounded-xl text-[11px] font-black text-gray-600 dark:text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-800 shadow-theme-xs"
                            disabled={!ledgerPagination.hasMore || isLoading}
                            onClick={() => handlePaginationChange(ledgerPagination.page + 1)}
                        >
                            <span className="hidden sm:inline">NEXT</span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Create Wallet Modal */}
            <Modal isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} className="max-w-md">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-brand-50 dark:bg-brand-900/20 rounded-2xl text-brand-600">
                            <Plus className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Create New Wallet</h3>
                            <p className="text-sm text-gray-500">Add a new currency wallet to your account.</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Select Currency
                            </label>
                            <Select
                                value={selectedCurrency}
                                options={[
                                    { value: 'UGX', label: 'UGX - Ugandan Shilling' },
                                    { value: 'KES', label: 'KES - Kenyan Shilling' },
                                    { value: 'USD', label: 'USD - US Dollar' },
                                    { value: 'EUR', label: 'EUR - Euro' },
                                    { value: 'GBP', label: 'GBP - British Pound' },
                                ]}
                                onChange={setSelectedCurrency}
                            />
                        </div>

                        <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-xl">
                            <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed font-medium">
                                <span className="font-bold">Note:</span> Creating a new wallet allows you to receive and hold funds in this currency. Some currencies may have additional verification requirements.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => setIsDialogOpen(false)}
                                disabled={isCreating}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                className="flex-1"
                                onClick={handleCreateWallet}
                                disabled={isCreating}
                            >
                                {isCreating ? "Creating..." : "Create Wallet"}
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
