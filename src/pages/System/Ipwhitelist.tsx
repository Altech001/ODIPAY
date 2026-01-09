import { Plus, Search, ShieldCheck, Trash2, Edit, Info, Globe, Shield } from "lucide-react";
import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import Alert from "../../components/ui/alert/Alert";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
} from "../../components/ui/table";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

interface WhitelistedIP {
    id: string;
    ipAddress: string;
    label: string;
    addedBy: string;
    createdAt: string;
    status: "Active" | "Inactive";
}

const initialIPs: WhitelistedIP[] = [
    {
        id: "1",
        ipAddress: "192.168.1.1",
        label: "Main Office (Kampala)",
        addedBy: "Admin User",
        createdAt: "Dec 01, 2023",
        status: "Active",
    },
    {
        id: "2",
        ipAddress: "41.210.144.15",
        label: "Production Cloud API",
        addedBy: "Systems Admin",
        createdAt: "Dec 05, 2023",
        status: "Active",
    },
    {
        id: "3",
        ipAddress: "102.134.55.22",
        label: "Backup Gateway",
        addedBy: "Security Lead",
        createdAt: "Dec 10, 2023",
        status: "Active",
    },
];

export default function Ipwhitelist() {
    const [ips, setIps] = useState<WhitelistedIP[]>(initialIPs);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [newIP, setNewIP] = useState({
        ipAddress: "",
        label: "",
    });
    const [ipError, setIpError] = useState("");

    const validateIP = (value: string) => {
        if (!value) return "IP address is required";

        // IPv4 and IPv4 CIDR
        const ipv4Pattern = /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}(?:\/(?:3[0-2]|[12]?\d))?$/;
        // IPv6 and IPv6 CIDR (simplified but effective for common cases)
        const ipv6Pattern = /^(?:(?:[a-fA-F\d]{1,4}:){7}(?:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,2}|:)|(?:[a-fA-F\d]{1,4}:){4}(?:(?::[a-fA-F\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,3}|:)|(?:[a-fA-F\d]{1,4}:){3}(?:(?::[a-fA-F\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,4}|:)|(?:[a-fA-F\d]{1,4}:){2}(?:(?::[a-fA-F\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,5}|:)|(?:[a-fA-F\d]{1,4}:){1}(?:(?::[a-fA-F\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,6}|:)|(?::(?:(?::[a-fA-F\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,7}|:)))(?:\/(?:12[0-8]|1[01]\d|[1-9]?\d))?$/;

        if (!ipv4Pattern.test(value) && !ipv6Pattern.test(value)) {
            return "Please enter a valid IPv4/IPv6 address or CIDR range";
        }

        return "";
    };

    const handleAddIP = () => {
        const error = validateIP(newIP.ipAddress);
        if (error) {
            setIpError(error);
            return;
        }

        if (newIP.ipAddress && newIP.label) {
            const ip: WhitelistedIP = {
                id: Math.random().toString(36).substr(2, 9),
                ...newIP,
                addedBy: "Current User",
                createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                status: "Active",
            };
            setIps([ip, ...ips]);
            setNewIP({ ipAddress: "", label: "" });
            setIpError("");
            setIsModalOpen(false);
        }
    };

    const filteredIPs = ips.filter(
        (ip) =>
            ip.ipAddress.includes(searchQuery) ||
            ip.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            <PageMeta
                title="IP Whitelist | Odipay"
                description="Manage authorized IP addresses for your payment infrastructure"
            />

            {/* Header Section */}
            <PageBreadcrumb pageTitle="IP Whitelist Management" />
            <ComponentCard desc="Control access to your infrastructure by white-listing specific IP addresses." title="IP Whitelist Management">
                <Alert
                    variant="info"
                    title="Security Recommendation"
                    message="Whitelisting IPs adds an extra layer of security to your API and dashboard access. Only requests originating from these addresses will be permitted. Ensure your static IPs are correctly configured."
                    showLink={true}
                    linkText="Learn more about IP security"
                />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">

                    <Button
                        onClick={() => setIsModalOpen(true)}
                        startIcon={<Plus className="w-4 h-4" />}
                    >
                        Add Allowed IP
                    </Button>
                </div>

                {/* Info Alert */}

                {/* Main Content Card */}
                <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">

                    {/* Table Filter/Search Bar */}
                    <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="relative w-full sm:w-80">
                            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                                <Search className="w-4 h-4" />
                            </span>
                            <input
                                type="text"
                                placeholder="Search by IP or Label..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:text-white transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-50 dark:bg-white/5 px-3 py-1.5 rounded-full border border-gray-100 dark:border-gray-800">
                            <Globe className="w-3.5 h-3.5" />
                            <span>{ips.length} Authorized IPs</span>
                        </div>
                    </div>

                    {/* IP List Table */}
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-gray-50/50 dark:bg-white/[0.02]">
                                <TableRow>
                                    <TableCell isHeader className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        IP Address
                                    </TableCell>
                                    <TableCell isHeader className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Label/Description
                                    </TableCell>
                                    <TableCell isHeader className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Status
                                    </TableCell>
                                    <TableCell isHeader className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Added By
                                    </TableCell>
                                    <TableCell isHeader className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Date Added
                                    </TableCell>
                                    <TableCell isHeader className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {filteredIPs.map((ip) => (
                                    <TableRow key={ip.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors">
                                        <TableCell className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-500">
                                                    <Shield className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm font-medium text-gray-900 dark:text-white font-mono uppercase tracking-tight">
                                                    {ip.ipAddress}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                            {ip.label}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-green-500/10 text-green-600 dark:text-green-500">
                                                {ip.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-500">
                                            {ip.addedBy}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-500">
                                            {ip.createdAt}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-1">
                                                <button className="p-2 text-gray-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-lg transition-colors">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 text-gray-400 hover:text-error-500 hover:bg-error-50 dark:hover:bg-error-500/10 rounded-lg transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredIPs.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                            <div className="flex flex-col items-center">
                                                <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center text-gray-400 mb-3">
                                                    <ShieldCheck className="w-6 h-6" />
                                                </div>
                                                <p className="text-sm font-medium">No whitelisted IPs found</p>
                                                <button
                                                    onClick={() => setSearchQuery("")}
                                                    className="text-brand-500 text-xs mt-1 hover:underline cursor-pointer"
                                                >
                                                    Clear search filters
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </ComponentCard>

            {/* Add IP Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                className="max-w-md w-full"
            >
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-500">
                            <Plus className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add Allowed IP</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Authorize a new endpoint for secure access</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <Label htmlFor="ip-address">IP Address</Label>
                            <Input
                                id="ip-address"
                                placeholder="e.g. 192.168.1.100 or 10.0.0.0/24"
                                value={newIP.ipAddress}
                                onChange={(e) => {
                                    setNewIP({ ...newIP, ipAddress: e.target.value });
                                    if (ipError) setIpError("");
                                }}
                                error={!!ipError}
                                hint={ipError}
                            />
                            <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
                                <Info className="w-3.5 h-3.5" />
                                <span>IPv4 and IPv6 addresses are supported</span>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="ip-label">Label / Name</Label>
                            <Input
                                id="ip-label"
                                placeholder="e.g. Headquarters Router"
                                value={newIP.label}
                                onChange={(e) => setNewIP({ ...newIP, label: e.target.value })}
                            />
                        </div>

                        <div className="pt-4 flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="flex-1"
                                onClick={handleAddIP}
                                disabled={!newIP.ipAddress || !newIP.label}
                            >
                                Whitelist IP
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
