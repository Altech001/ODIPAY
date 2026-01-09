import { useState } from "react";
import {
    Search,
    Plus,
    ChevronLeft,
    ChevronRight,
    Info,
    X,
    Smartphone,
    CreditCard,
    ArrowUpDown
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

type Category = "Wallet" | "Phone Number" | "Bank Account";

export default function Beneficiaries() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [, setCategoryFilter] = useState("All");

    // Dialog State
    const [beneficiaryName, setBeneficiaryName] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<Category>("Wallet");
    const [walletCode, setWalletCode] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [, setBankName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");

    const categories: Category[] = ["Wallet", "Phone Number", "Bank Account"];
    const bankOptions = [
        { value: "OPPORTUNITY BANK", label: "OPPORTUNITY BANK" },
        { value: "EQUITY BANK", label: "EQUITY BANK" },
        { value: "CENTENARY BANK", label: "CENTENARY BANK" },
        { value: "ABSA BANK", label: "ABSA BANK" },
    ];

    const categoryOptions = [
        { value: "All", label: "All" },
        ...categories.map(c => ({ value: c, label: c }))
    ];

    const modalCategoryOptions = categories.map(c => ({ value: c, label: c }));

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
        // Reset fields on close
        if (isModalOpen) {
            setBeneficiaryName("");
            setWalletCode("");
            setPhoneNumber("");
            setBankName("");
            setAccountNumber("");
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            <PageMeta title="Beneficiaries | Odipay" description="Manage your payout beneficiaries" />
            <PageBreadcrumb pageTitle="Beneficiaries" />

            {/* Header with Search and Filter */}
            <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm">
                <div className="p-4 md:p-6 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1 flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="relative flex-1 max-w-md">
                                <Input
                                    placeholder="Search by name"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 h-12 rounded-xl"
                                />
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                            </div>

                            {/* Category Filter */}
                            <div className="relative w-full md:w-64">
                                <label className="absolute -top-2 left-3 px-1 bg-white dark:bg-[#1C1C1E] text-[10px] font-bold text-gray-400 dark:text-gray-500 z-10 uppercase tracking-widest">
                                    Category
                                </label>
                                <Select
                                    options={categoryOptions}
                                    onChange={(val) => setCategoryFilter(val)}
                                    defaultValue="All"
                                    className="h-12 border-gray-200 dark:border-gray-700 rounded-xl"
                                />
                            </div>
                        </div>

                        <Button
                            variant="primary"
                            size="md"
                            onClick={toggleModal}
                            startIcon={<Plus className="w-5 h-5" />}
                            className="px-6 h-12 rounded-xl shadow-lg shadow-brand-500/20"
                        >
                            Add New
                        </Button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-gray-50/50 dark:bg-white/[0.01]">
                            <TableRow className="border-y border-gray-100 dark:border-gray-800">
                                <TableCell isHeader className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider py-4 pl-6">
                                    <div className="flex items-center gap-1.5 cursor-pointer hover:text-gray-600 transition-colors">
                                        Date Created <ArrowUpDown className="w-3 h-3" />
                                    </div>
                                </TableCell>
                                <TableCell isHeader className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider py-4">Name</TableCell>
                                <TableCell isHeader className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider py-4">Account Type</TableCell>
                                <TableCell isHeader className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider py-4">Account Number</TableCell>
                                <TableCell isHeader className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider py-4 pr-6">Created By</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Empty State - As per image */}
                            <TableRow>
                                <TableCell colSpan={5} className="py-24 text-center">
                                    <div className="inline-flex flex-col items-center">
                                        <div className="flex items-center gap-3 px-6 py-3 bg-blue-50/50 dark:bg-blue-500/5 rounded-full border border-blue-100 dark:border-blue-500/10 mb-4">
                                            <Info className="w-5 h-5 text-blue-500" />
                                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">No records to display</span>
                                        </div>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 max-w-sm">
                                            You haven't added any beneficiaries yet. Start by clicking the 'Add New' button.
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* Improved Pagination */}
                <div className="p-4 md:p-6 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gray-50/20 dark:bg-transparent">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Show:</span>
                            <select className="bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 px-2 py-1 rounded-lg text-[11px] font-bold text-gray-700 dark:text-white outline-none focus:ring-1 focus:ring-brand-500 transition-all">
                                <option>10</option>
                                <option>25</option>
                                <option>50</option>
                            </select>
                        </div>
                        <div className="h-4 w-px bg-gray-200 dark:bg-gray-800" />
                        <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase">Total: 0 records</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tighter">Page 0 of 0</span>
                        <div className="flex items-center gap-2">
                            <button
                                className="w-10 h-10 flex items-center justify-center border border-gray-200 dark:border-gray-700 rounded-xl text-gray-400 cursor-not-allowed hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                                disabled
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                className="w-10 h-10 flex items-center justify-center border border-gray-200 dark:border-gray-700 rounded-xl text-gray-400 cursor-not-allowed hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                                disabled
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Beneficiary Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-99999 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={toggleModal} />
                    <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-4 duration-300">
                        {/* Modal Header */}
                        <div className="px-8 pt-8 pb-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-black text-[#1E293B] dark:text-white">Add a beneficiary</h3>
                                <button onClick={toggleModal} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
                                    <X className="w-6 h-6 text-gray-400" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="px-8 pb-8 space-y-6">
                            {/* Beneficiary Name */}
                            <div className="relative pt-2">
                                <Input
                                    placeholder="Beneficiary name"
                                    value={beneficiaryName}
                                    onChange={(e) => setBeneficiaryName(e.target.value)}
                                    className="h-14 rounded-2xl border-gray-200 dark:border-gray-700 pt-1"
                                />
                            </div>

                            {/* Category Selector */}
                            <div className="relative">
                                <label className="absolute -top-2.5 left-4 px-1 bg-white dark:bg-[#1C1C1E] text-[11px] font-bold text-gray-400 dark:text-gray-500 z-10 uppercase tracking-widest">
                                    Category
                                </label>
                                <Select
                                    options={modalCategoryOptions}
                                    onChange={(val) => setSelectedCategory(val as Category)}
                                    defaultValue={selectedCategory}
                                    className="h-14 border-gray-200 dark:border-gray-700 rounded-2xl pt-2"
                                />
                            </div>

                            {/* Dynamic Fields based on Category */}
                            {selectedCategory === "Wallet" && (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                    <Input
                                        placeholder="Wallet Code"
                                        value={walletCode}
                                        onChange={(e) => setWalletCode(e.target.value)}
                                        className="h-14 rounded-2xl border-gray-200 dark:border-gray-700"
                                    />
                                    <p className="mt-2 text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-wider pl-1">
                                        Enter the unique identifier for the wallet
                                    </p>
                                </div>
                            )}

                            {selectedCategory === "Phone Number" && (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="relative">
                                        <Input
                                            placeholder="Phone Number"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            className="h-14 rounded-2xl border-gray-200 dark:border-gray-700 pl-12"
                                        />
                                        <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    </div>
                                    <p className="mt-2 text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-wider pl-1">
                                        Registered Mobile Money number (e.g., +256...)
                                    </p>
                                </div>
                            )}

                            {selectedCategory === "Bank Account" && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="relative">
                                        <label className="absolute -top-2.5 left-4 px-1 bg-white dark:bg-[#1C1C1E] text-[11px] font-bold text-gray-400 dark:text-gray-500 z-10 uppercase tracking-widest">
                                            Beneficiary Bank
                                        </label>
                                        <Select
                                            options={bankOptions}
                                            placeholder="Select a bank"
                                            onChange={(val) => setBankName(val)}
                                            className="h-14 border-gray-200 dark:border-gray-700 rounded-2xl pt-2"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Input
                                            placeholder="Account Number"
                                            value={accountNumber}
                                            onChange={(e) => setAccountNumber(e.target.value)}
                                            className="h-14 rounded-2xl border-gray-200 dark:border-gray-700 pl-12"
                                        />
                                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="px-8 py-6 bg-gray-50/50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3">
                            <button
                                onClick={toggleModal}
                                className="px-6 py-2.5 text-sm font-bold text-brand-500 hover:text-brand-600 dark:text-brand-400 transition-colors"
                            >
                                Cancel
                            </button>
                            <Button
                                variant="primary"
                                size="md"
                                className="px-10 h-12 rounded-2xl font-black text-sm uppercase tracking-wider"
                                onClick={() => {
                                    toggleModal();
                                    // In a real app, we'd add to the list here
                                }}
                            >
                                Submit
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
