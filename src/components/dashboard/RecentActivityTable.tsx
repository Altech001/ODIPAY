import {
    ArrowUpDown,
    Calendar,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { useState } from "react";
import Badge from "../../components/ui/badge/Badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
import Checkbox from "../form/input/Checkbox";

interface Activity {
    id: string;
    category: string;
    merchant: string;
    date: string;
    channel: string;
    amount: string;
    status: "Success" | "Pending" | "Failed";
}

const activities: Activity[] = [
    { id: "#324112", category: "Disbursement", merchant: "HomeLine", date: "10 Apr 2026 2:15 pm", channel: "MTN-MoMo", amount: "UGX 45,000", status: "Success" },
    { id: "#325678", category: "Collection", merchant: "StylePro", date: "21 May 2026 9:00 am", channel: "Airtel-Money", amount: "UGX 12,500", status: "Success" },
    { id: "#326789", category: "Transfer", merchant: "EduSource", date: "02 Jun 2026 11:45 am", channel: "Internal", amount: "UGX 128,400", status: "Pending" },
    { id: "#327003", category: "Payout", merchant: "AutoParts Co.", date: "18 Mar 2026 4:00 pm", channel: "Bank", amount: "UGX 2,150,000", status: "Success" },
    { id: "#328556", category: "Settlement", merchant: "TechNova", date: "25 Jul 2026 10:30 am", channel: "Global-Settlement", amount: "UGX 849,990", status: "Success" },
];

export default function RecentActivityTable() {
    const [selectedTab, setSelectedTab] = useState("All");
    const [timeFilter, setTimeFilter] = useState("7 Days");

    const filteredActivities = activities.filter(activity =>
        selectedTab === "All" || activity.status === selectedTab
    );

    return (
        <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded overflow-hidden shadow-sm">
            <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">Recent Activity</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Track your latest global transaction activities</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="overflow-x-auto no-scrollbar max-w-[250px] md:max-w-full">
                        <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900 w-max">
                            {["All", "Success", "Pending", "Failed"].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setSelectedTab(t)}
                                    className={`px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${selectedTab === t
                                        ? "shadow-theme-xs bg-white dark:bg-gray-800 text-brand-600 dark:text-brand-400"
                                        : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="relative group">
                        <select
                            value={timeFilter}
                            onChange={(e) => setTimeFilter(e.target.value)}
                            className="appearance-none flex items-center gap-2 pl-4 pr-10 py-2 border border-gray-200 dark:border-gray-700 rounded text-xs font-black uppercase tracking-wider text-gray-600 dark:text-gray-400 bg-transparent hover:bg-gray-50 dark:hover:bg-white/5 transition-all outline-none cursor-pointer"
                        >
                            <option value="7 Days">Last 7 Days</option>
                            <option value="10 Days">Last 10 Days</option>
                            <option value="30 Days">Last 30 Days</option>
                        </select>
                        <Calendar className="w-3.5 h-3.5 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-gray-50/50 dark:bg-white/5 uppercase">
                        <TableRow className="border-b border-gray-100 dark:border-gray-800">
                            <TableCell isHeader className="p-4 w-12">
                                <Checkbox checked={false} onChange={() => { }} />
                            </TableCell>
                            <TableCell isHeader className="text-xs font-black text-gray-400 py-5 align-middle">Transaction ID</TableCell>
                            <TableCell isHeader className="text-xs font-black text-gray-400 py-5 align-middle">
                                <div className="flex items-center gap-1.5 cursor-pointer hover:text-brand-500 transition-colors">Category <ArrowUpDown className="w-3 h-3" /></div>
                            </TableCell>
                            <TableCell isHeader className="text-xs font-black text-gray-400 py-5 align-middle">
                                <div className="flex items-center gap-1.5 cursor-pointer hover:text-brand-500 transition-colors">Merchant <ArrowUpDown className="w-3 h-3" /></div>
                            </TableCell>
                            <TableCell isHeader className="text-xs font-black text-gray-400 py-5">
                                <div className="flex items-center gap-1.5 cursor-pointer hover:text-brand-500 transition-colors">Date Created <ArrowUpDown className="w-3 h-3" /></div>
                            </TableCell>
                            <TableCell isHeader className="text-xs font-black text-gray-400 py-5">Channel</TableCell>
                            <TableCell isHeader className="text-xs font-black text-gray-400 py-5 text-right">Amount</TableCell>
                            <TableCell isHeader className="text-xs font-black text-gray-400 py-5 pr-8 text-right">Status</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredActivities.map((item) => (
                            <TableRow key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors border-b border-gray-100 dark:border-gray-800 last:border-none group">
                                <TableCell className="p-4 w-12 border-r border-transparent group-hover:border-gray-100 dark:group-hover:border-gray-800">
                                    <Checkbox checked={false} onChange={() => { }} />
                                </TableCell>
                                <TableCell className="text-xs font-bold text-gray-900 dark:text-white py-5 text-center">{item.id}</TableCell>
                                <TableCell className="text-xs font-medium text-gray-500 py-5 text-center">{item.category}</TableCell>
                                <TableCell className="text-xs font-bold text-gray-700 dark:text-gray-300 py-5 text-center">{item.merchant}</TableCell>
                                <TableCell className="text-xs font-medium text-gray-400 py-5 text-center">{item.date}</TableCell>
                                <TableCell className="text-xs font-medium text-gray-500 py-5 text-center">{item.channel}</TableCell>
                                <TableCell className="text-xs font-black text-gray-900 dark:text-white text-right align-middle py-5">{item.amount}</TableCell>
                                <TableCell className="text-xs pr-8 text-right py-5">
                                    <Badge
                                        color={item.status === "Success" ? "success" : item.status === "Pending" ? "warning" : "error"}
                                        className="px-3 rounded-md text-xs font-black uppercase tracking-widest border-none"
                                    >
                                        {item.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs font-bold text-gray-500 tracking-widest">
                    Showing <span className="text-gray-900 dark:text-white">1</span> to <span className="text-gray-900 dark:text-white">5</span> of 10 results
                </p>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded text-xs font-black uppercase tracking-wider text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                        <ChevronLeft className="w-4 h-4" /> Prev
                    </button>
                    <div className="flex items-center gap-1.5 mx-2">
                        <button className="w-9 h-9 rounded bg-brand-500 text-white text-xs font-black">1</button>
                        <button className="w-9 h-9 rounded text-gray-500 text-xs font-black hover:bg-gray-100 dark:hover:bg-white/5 transition-all">2</button>
                    </div>
                    <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded text-xs font-black uppercase tracking-wider text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                        Next <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
