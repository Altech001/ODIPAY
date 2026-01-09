import {
    ArrowDownToLine,
    EyeClosedIcon,
    FileStack,
    Info,
    RefreshCw,
    Send,
    TicketSlashIcon,
    X
} from "lucide-react";
import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Select from "../../components/form/Select";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../components/ui/table";

export default function Disbursements() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInboundModalOpen, setIsInboundModalOpen] = useState(false);
    const [isBulkActive, setIsBulkActive] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal Form State
    const [phoneNumber, setPhoneNumber] = useState("");
    const [fullName, setFullName] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [selectedNetwork, setSelectedNetwork] = useState<"MTN" | "AIRTEL">("MTN");

    const handleVerifyName = () => {
        if (!phoneNumber) return;
        setIsVerifying(true);
        // Simulate API call
        setTimeout(() => {
            setFullName("Abaasa Albert");
            setIsVerifying(false);
        }, 1500);
    };

    // Inbound Modal State
    const [inboundAccount, setInboundAccount] = useState("");
    const [inboundAccountName, setInboundAccountName] = useState("");
    const [isInboundVerifying, setIsInboundVerifying] = useState(false);

    const handleVerifyInboundAccount = () => {
        if (!inboundAccount) return;
        setIsInboundVerifying(true);
        // Simulate API call
        setTimeout(() => {
            setInboundAccountName("Odipay Merchant Account");
            setIsInboundVerifying(false);
        }, 1500);
    };

    const amount = 5000000;

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-20">
            <PageMeta title="Disbursements | Odipay" description="Send money to beneficiaries and manage payouts" />

            {/* Page Header */}
            <PageBreadcrumb pageTitle="Disbursements" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Button
                        variant={isBulkActive ? "primary" : "outline"}
                        size="sm"
                        startIcon={<FileStack className="w-4 h-4" />}
                        onClick={() => setIsBulkActive(!isBulkActive)}
                    >
                        {isBulkActive ? "Switch to Individual" : "Bulk Disbursements"}
                    </Button>
                    <Button variant="outline" size="sm" startIcon={<RefreshCw className="w-4 h-4" />}>
                        Refresh
                    </Button>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="primary"
                        size="sm"
                        startIcon={<TicketSlashIcon className="w-4 h-4 " />}
                        onClick={() => setIsModalOpen(true)}
                    >
                        Send Money
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        startIcon={<ArrowDownToLine className="w-4 h-4" />}
                        onClick={() => setIsInboundModalOpen(true)}
                    >
                        Inbound CashOut
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
                            <div className="flex items-center gap-2 justify-between">
                                <span className="text-2xl font-black text-gray-900 dark:text-white">{amount}.00</span>
                                <EyeClosedIcon />
                            </div>
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5">Available Balance</p>
                    </div>
                </div>
            </div>

            {/* Bulk Section Overlay (If Active) */}
            {isBulkActive && (
                <div className="bg-brand-50/50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20 rounded-2xl p-8 text-center animate-in slide-in-from-top-4 duration-300">
                    <div className="w-16 h-16 bg-brand-100 dark:bg-brand-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileStack className="w-8 h-8 text-brand-600 dark:text-brand-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white uppercase">Bulk Disbursement Mode</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
                        Upload a CSV or Excel file to process multiple payouts at once.
                        Download the template to get started.
                    </p>
                    <div className="mt-8 flex items-center justify-center gap-4">
                        <Button variant="outline" size="sm">Download Template</Button>
                        <Button variant="primary" size="sm">Upload File</Button>
                    </div>
                </div>
            )}

            {/* Filters Section */}
            <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 overflow-visible">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <div className="relative">
                            <Input
                                placeholder="Search by reference or number"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <label className="absolute -top-2.5 left-3 px-1 bg-white dark:bg-[#1C1C1E] text-[11px] font-bold text-gray-400 dark:text-gray-500 z-10 uppercase tracking-widest">
                                    From
                                </label>
                                <Input type="date" className="h-11 rounded-xl w-full" defaultValue="2026-01-01" />
                            </div>
                            <div className="relative">
                                <label className="absolute -top-2.5 left-3 px-1 bg-white dark:bg-[#1C1C1E] text-[11px] font-bold text-gray-400 dark:text-gray-500 z-10 uppercase tracking-widest">
                                    To
                                </label>
                                <Input type="date" className="h-11 rounded-xl w-full" defaultValue="2026-01-08" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="relative">
                            <label className="absolute -top-2.5 left-3 px-1 bg-white dark:bg-[#1C1C1E] text-[11px] font-bold text-gray-400 dark:text-gray-500 z-10 uppercase tracking-widest">
                                Status
                            </label>
                            <Select
                                options={[
                                    { value: "All", label: "All Statuses" },
                                    { value: "Success", label: "Successful" },
                                    { value: "Pending", label: "Pending" },
                                    { value: "Failed", label: "Failed" },
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
                            <TableCell isHeader className="text-[10px] font-bold text-gray-500 uppercase py-4 pl-6">Date</TableCell>
                            <TableCell isHeader className="text-[10px] font-bold text-gray-500 uppercase py-4">Beneficiary</TableCell>
                            <TableCell isHeader className="text-[10px] font-bold text-gray-500 uppercase py-4">Reference</TableCell>
                            <TableCell isHeader className="text-[10px] font-bold text-gray-500 uppercase py-4">Amount</TableCell>
                            <TableCell isHeader className="text-[10px] font-bold text-gray-500 uppercase py-4">Charge</TableCell>
                            <TableCell isHeader className="text-[10px] font-bold text-gray-500 uppercase py-4">Channel</TableCell>
                            <TableCell isHeader className="text-[10px] font-bold text-gray-500 uppercase py-4 pr-6">Status</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={7} className="py-20 text-center">
                                <div className="flex flex-col items-center justify-center">
                                    <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                                        <Info className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <p className="text-sm font-bold text-gray-500 uppercase">No disbursements found</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>

            {/* Inbound CashOuts Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="relative w-full max-w-lg bg-white dark:bg-[#1C1C1E] rounded shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center">
                                        <Send className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase">New Disbursement</h3>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-6">
                                    {/* Network Selection Cards */}
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Select Network</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div
                                                onClick={() => setSelectedNetwork("MTN")}
                                                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${selectedNetwork === "MTN" ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/10" : "border-gray-100 dark:border-gray-800 hover:border-gray-200"}`}
                                            >
                                                <p className={`font-bold text-sm ${selectedNetwork === "MTN" ? "text-yellow-600" : "text-gray-500"}`}>MTN MoMo</p>
                                                <img src="/mtnlogo.png" className="w-8 h-8 object-contain rounded" alt="MTN" />
                                            </div>
                                            <div
                                                onClick={() => setSelectedNetwork("AIRTEL")}
                                                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${selectedNetwork === "AIRTEL" ? "border-red-500 bg-red-50 dark:bg-red-900/10" : "border-gray-100 dark:border-gray-800 hover:border-gray-200"}`}
                                            >
                                                <p className={`font-bold text-sm ${selectedNetwork === "AIRTEL" ? "text-red-500" : "text-gray-500"}`}>Airtel Money</p>
                                                <img src="/airtellogo.png" className="w-8 h-8 object-contain rounded" alt="Airtel" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-end gap-3">
                                            <div className="flex-1">
                                                <Input
                                                    placeholder="Phone Number"
                                                    className="h-14 rounded-2xl"
                                                    value={phoneNumber}
                                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                                />
                                            </div>
                                            <Button
                                                variant="primary"

                                                className="h-14 px-4 rounded-2xl"
                                                onClick={handleVerifyName}
                                                disabled={isVerifying || !phoneNumber}
                                            >
                                                {isVerifying ? <RefreshCw className="w-5 h-5 animate-spin" /> : "Verify Name"}
                                            </Button>
                                        </div>
                                        <Input
                                            placeholder="Full Name"
                                            className="h-14 rounded-2xl"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            disabled
                                        />
                                        <Input placeholder="Amount (UGX)" className="h-14 rounded-2xl font-bold" />
                                        <Input placeholder="Reason for Payment" className="h-14 rounded-2xl" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-6 pt-4">
                                    <button onClick={() => setIsModalOpen(false)} className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors">
                                        Cancel
                                    </button>
                                    <Button variant="primary" size="md" className="px-10 rounded-2xl shadow-lg shadow-brand-500/20">
                                        Process Payout
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Inbound CashOut Modal */}
            {isInboundModalOpen && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsInboundModalOpen(false)} />
                    <div className="relative w-full max-w-lg bg-white dark:bg-[#1C1C1E] rounded shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center">
                                        <ArrowDownToLine className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase">Inbound CashOut</h3>
                                </div>
                                <button onClick={() => setIsInboundModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-end gap-3">
                                        <div className="flex-1">
                                            <Input
                                                placeholder="Account Number / ID"
                                                className="h-14 rounded-2xl"
                                                value={inboundAccount}
                                                onChange={(e) => setInboundAccount(e.target.value)}
                                            />
                                        </div>
                                        <Button
                                            variant="primary"

                                            className="h-14 px-4 rounded-2xl"
                                            onClick={handleVerifyInboundAccount}
                                            disabled={isInboundVerifying || !inboundAccount}
                                        >
                                            {isInboundVerifying ? <RefreshCw className="w-5 h-5 animate-spin" /> : "Verify Account"}
                                        </Button>
                                    </div>
                                    <Input
                                        placeholder="Account Name"
                                        className="h-14 rounded-2xl"
                                        value={inboundAccountName}
                                        onChange={(e) => setInboundAccountName(e.target.value)}
                                        disabled
                                    />
                                    <Input placeholder="Amount (UGX)" className="h-14 rounded-2xl font-bold" />
                                    <Input placeholder="Reason (Optional)" className="h-14 rounded-2xl" />
                                </div>

                                <div className="flex items-center justify-end gap-6 pt-4">
                                    <button onClick={() => setIsInboundModalOpen(false)} className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors">
                                        Cancel
                                    </button>
                                    <Button variant="primary" size="md" className="px-10 rounded-2xl shadow-lg shadow-brand-500/20">
                                        Transfer
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
