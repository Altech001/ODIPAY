import { useState, useMemo } from "react";
import { Calendar, CheckCircle2, Download, Filter, Plus, Search } from "lucide-react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Badge from "../../components/ui/badge/Badge";
import Button from "../../components/ui/button/Button";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
import Select from "../../components/form/Select";

export default function Staff() {
    const staffData = [
        {
            id: 1,
            name: "ABAASA ALBERT",
            email: "albertabaasa07@gmail.com",
            status: "Active",
            initials: "AA",
        },
        {
            id: 2,
            name: "JANE DOE",
            email: "jane.doe@example.com",
            status: "Active",
            initials: "JD",
        },
        {
            id: 3,
            name: "JOHN SMITH",
            email: "john.smith@odipay.com",
            status: "Inactive",
            initials: "JS",
        },
        {
            id: 4,
            name: "SARAH CONNOR",
            email: "s.connor@sky.net",
            status: "Active",
            initials: "SC",
        },
    ];
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const filteredStaff = useMemo(() => {
        return staffData.filter((staff) => {
            const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                staff.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === "all" || staff.status.toLowerCase() === statusFilter.toLowerCase();
            return matchesSearch && matchesStatus;
        });
    }, [searchTerm, statusFilter, staffData]);

    return (
        <div>
            <PageMeta title="Staff Members" description="Staff Members" />

            <PageBreadcrumb pageTitle="Staff Members" />

            <div className="flex flex-wrap items-center float justify-between gap-3 mb-6">
                <div></div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        className="hidden sm:flex"
                        startIcon={<Download className="w-4 h-4" />}
                    >
                        Export
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        startIcon={<Plus className="w-4 h-4" />}
                    >
                        Invite Staff
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="p-5 border border-gray-200 bg-white rounded-2xl dark:border-gray-800 dark:bg-white/[0.03] mb-6 shadow-sm">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 items-end">
                    {/* Search */}
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <Search className="w-4 h-4" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search by name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-11 w-full rounded-lg border border-gray-200 bg-transparent pl-11 pr-11 text-sm text-gray-800 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:text-white/90"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <Filter className="w-4 h-4" />
                        </span>
                    </div>

                    {/* From Date */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="From"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:text-white/90"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <Calendar className="w-4 h-4" />
                        </span>
                    </div>

                    {/* To Date */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="To"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:text-white/90"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <Calendar className="w-4 h-4" />
                        </span>
                    </div>

                    {/* Status Dropdown */}
                    <div className="relative">
                        <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] text-gray-500 dark:bg-gray-900 z-10">
                            Status
                        </label>
                        <div className="relative">
                            <Select options={[
                                {
                                    "value": "all",
                                    "label": "All"
                                },
                                {
                                    "value": "active",
                                    "label": "Active"
                                },
                                {
                                    "value": "inactive",
                                    "label": "Inactive"
                                }
                            ]} onChange={(value) => setStatusFilter(value)} />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Content */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-gray-50 dark:bg-gray-800/15 border-b border-gray-200 dark:border-gray-800">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 text-start text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
                                >
                                    Name
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 text-start text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
                                >
                                    Status
                                </TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {filteredStaff.map((staff) => (
                                <TableRow key={staff.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                                    <TableCell className="px-5 py-4 text-theme-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                                {staff.initials}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-xs text-blue-600 dark:text-blue-400 uppercase truncate">
                                                    {staff.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                    {staff.email}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-theme-sm">
                                        <Badge
                                            size="sm"
                                            color={staff.status === "Active" ? "success" : "error"}
                                            startIcon={staff.status === "Active" ? <CheckCircle2 className="w-3 h-3" /> : null}
                                        >
                                            {staff.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
