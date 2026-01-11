import { Activity, Bell, Camera, Lock, Save, Shield, User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Avatar from "../../components/ui/avatar/Avatar";
import Button from "../../components/ui/button/Button";
import { useAuth } from "../../context/AuthContext";

export default function Settings() {
    const [activeTab, setActiveTab] = useState("profile");
    const { is2FAEnabled, set2FAEnabled } = useAuth();

    const tabs = [
        { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
        { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
        { id: "security", label: "Security", icon: <Shield className="w-4 h-4" /> },
        { id: "security_logs", label: "Security Logs", icon: <Activity className="w-4 h-4" /> },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <PageMeta title="Settings | Odipay" description="Manage your account settings" />
            <PageBreadcrumb pageTitle="Settings" />

            {/* Tab Navigation */}
            <div className="flex p-1.5 space-x-1 border border-gray-200 bg-white/50 backdrop-blur-sm rounded-2xl dark:border-gray-800 dark:bg-white/[0.03]">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center justify-center flex-1 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-xl ${activeTab === tab.id
                            ? "bg-white text-brand-600 shadow-sm dark:bg-gray-800 dark:text-white"
                            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            }`}
                    >
                        <span className="mr-2">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="border border-gray-200 bg-white rounded-2xl dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
                {activeTab === "profile" && (
                    <div className="p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {/* Profile Header */}
                        <div className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-6">
                            <div className="relative group">
                                <Avatar
                                    src="/images/user/owner.jpg"
                                    size="xxlarge"
                                    status="online"
                                />
                                <button className="absolute bottom-0 right-0 p-2 text-white transition-all bg-brand-500 rounded-full hover:bg-brand-600 shadow-lg border-2 border-white dark:border-gray-900 group-hover:scale-110">
                                    <Camera className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="text-center md:text-left">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">ODI PAY Support</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Administrator • Head Office</p>
                            </div>
                        </div>

                        {/* Form Grid */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input id="fullName" value="Anna Adame" placeholder="Enter your full name" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" type="email" value="anna.adame@odipay.com" placeholder="Enter your email" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" value="+256 700 000 000" placeholder="Enter your phone number" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input id="location" value="Kampala, Uganda" placeholder="City, Country" />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                            <Button variant="primary" size="md" className="w-full md:w-auto px-10" startIcon={<Save className="w-4 h-4" />}>
                                Save Changes
                            </Button>
                        </div>
                    </div>
                )}

                {activeTab === "notifications" && (
                    <div className="p-6 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <section className="space-y-4">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Email Notifications</h4>
                            <div className="space-y-4">
                                {[
                                    { title: "Service Updates", desc: "Get notified about new features and improvements" },
                                    { title: "Security Alerts", desc: "Get notified about suspicious login attempts" },
                                    { title: "Weekly Report", desc: "Receive a summary of your portal activity" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 transition-all border border-gray-100 rounded-xl hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/[0.01]">
                                        <div className="mr-4">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                                        </div>
                                        <div className="relative inline-flex items-center cursor-pointer group">
                                            <input type="checkbox" className="sr-only peer" defaultChecked={i === 1} />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-500"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === "security" && (
                    <div className="p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <section className="space-y-6">
                            <div className="flex items-center space-x-3 pb-2 border-b border-gray-100 dark:border-gray-800">
                                <Lock className="w-5 h-5 text-gray-400" />
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Change Password</h4>
                            </div>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="currentPass">Current Password</Label>
                                    <Input id="currentPass" type="password" placeholder="••••••••" />
                                </div>
                                <div className="hidden md:block"></div>
                                <div className="space-y-2">
                                    <Label htmlFor="newPass">New Password</Label>
                                    <Input id="newPass" type="password" placeholder="••••••••" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPass">Confirm New Password</Label>
                                    <Input id="confirmPass" type="password" placeholder="••••••••" />
                                </div>
                            </div>
                            <Button variant="primary" size="md" className="px-10">
                                Update Password
                            </Button>
                        </section>

                        <section className={`p-4 border rounded-xl ${is2FAEnabled ? "border-green-100 bg-green-50 dark:bg-green-500/5 dark:border-green-500/20" : "border-orange-100 bg-orange-50 dark:bg-orange-500/5 dark:border-orange-500/20"}`}>
                            <div className="flex items-start space-x-3">
                                <Shield className={`w-5 h-5 mt-0.5 ${is2FAEnabled ? "text-green-600" : "text-orange-600"}`} />
                                <div>
                                    <p className={`text-sm font-semibold ${is2FAEnabled ? "text-green-900 dark:text-green-400" : "text-orange-900 dark:text-orange-400"}`}>
                                        Two-Factor Authentication: {is2FAEnabled ? "Enabled" : "Disabled"}
                                    </p>
                                    <p className={`mt-1 text-xs ${is2FAEnabled ? "text-green-700 dark:text-green-500/80" : "text-orange-700 dark:text-orange-500/80"}`}>
                                        {is2FAEnabled
                                            ? "Your account is protected with an additional layer of security."
                                            : "Add an extra layer of security to your account by enabling 2FA."}
                                    </p>
                                    {!is2FAEnabled && (
                                        <Link to="/setup-2fa" className="mt-3 inline-block text-sm font-bold text-orange-600 hover:text-orange-700 dark:text-orange-400">
                                            Setup 2FA →
                                        </Link>
                                    )}
                                    {is2FAEnabled && (
                                        <button onClick={() => set2FAEnabled(false)} className="mt-3 text-sm font-bold text-gray-500 hover:text-red-600 dark:text-gray-400">
                                            Disable 2FA
                                        </button>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === "security_logs" && (
                    <div className="p-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="p-6 md:p-8 border-b border-gray-100 dark:border-gray-800">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Security Logs</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Review your recent account activity and login history.
                            </p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-800/50 text-xs uppercase text-gray-500 border-b border-gray-100 dark:border-gray-800">
                                        <th className="px-6 py-4 font-semibold">Date & Time</th>
                                        <th className="px-6 py-4 font-semibold">IP Address</th>
                                        <th className="px-6 py-4 font-semibold">Device / User Agent</th>
                                        <th className="px-6 py-4 font-semibold text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {[
                                        { date: "Oct 24, 2023 09:41 AM", ip: "192.168.1.102", agent: "Chrome / macOS", status: "Success" },
                                        { date: "Oct 23, 2023 11:20 PM", ip: "197.232.48.11", agent: "Safari / iOS", status: "Success" },
                                        { date: "Oct 22, 2023 02:15 PM", ip: "41.210.158.33", agent: "Firefox / Windows", status: "Success" },
                                        { date: "Oct 20, 2023 10:05 AM", ip: "102.210.10.5", agent: "Brave / Linux", status: "Success" },
                                        { date: "Oct 19, 2023 08:33 PM", ip: "154.120.22.90", agent: "Chrome / Android", status: "Success" },
                                        { date: "Oct 18, 2023 04:12 PM", ip: "196.201.21.43", agent: "Chrome / Windows", status: "Success" },
                                        { date: "Oct 15, 2023 01:22 PM", ip: "105.100.12.3", agent: "Samsung Browser / Android", status: "Success" },
                                        { date: "Oct 12, 2023 09:11 AM", ip: "192.168.1.102", agent: "Chrome / macOS", status: "Success" },
                                        { date: "Oct 10, 2023 03:45 PM", ip: "197.232.0.1", agent: "Firefox / macOS", status: "Success" },
                                        { date: "Oct 08, 2023 11:59 AM", ip: "154.67.12.8", agent: "Chrome / iOS", status: "Success" },
                                        { date: "Oct 24, 2023 09:41 AM", ip: "192.168.1.102", agent: "Chrome / macOS", status: "Success" },
                                        { date: "Oct 23, 2023 11:20 PM", ip: "197.232.48.11", agent: "Safari / iOS", status: "Success" },
                                        { date: "Oct 22, 2023 02:15 PM", ip: "41.210.158.33", agent: "Firefox / Windows", status: "Success" },
                                        { date: "Oct 20, 2023 10:05 AM", ip: "102.210.10.5", agent: "Brave / Linux", status: "Success" },
                                        { date: "Oct 19, 2023 08:33 PM", ip: "154.120.22.90", agent: "Chrome / Android", status: "Success" },
                                        { date: "Oct 18, 2023 04:12 PM", ip: "196.201.21.43", agent: "Chrome / Windows", status: "Success" },
                                        { date: "Oct 15, 2023 01:22 PM", ip: "105.100.12.3", agent: "Samsung Browser / Android", status: "Success" },
                                        { date: "Oct 12, 2023 09:11 AM", ip: "192.168.1.102", agent: "Chrome / macOS", status: "Success" },
                                        { date: "Oct 10, 2023 03:45 PM", ip: "197.232.0.1", agent: "Firefox / macOS", status: "Success" },
                                        { date: "Oct 08, 2023 11:59 AM", ip: "154.67.12.8", agent: "Chrome / iOS", status: "Success" },
                                        { date: "Oct 24, 2023 09:41 AM", ip: "192.168.1.102", agent: "Chrome / macOS", status: "Success" },
                                        { date: "Oct 23, 2023 11:20 PM", ip: "197.232.48.11", agent: "Safari / iOS", status: "Success" },
                                        { date: "Oct 22, 2023 02:15 PM", ip: "41.210.158.33", agent: "Firefox / Windows", status: "Success" },
                                        { date: "Oct 20, 2023 10:05 AM", ip: "102.210.10.5", agent: "Brave / Linux", status: "Success" },
                                        { date: "Oct 19, 2023 08:33 PM", ip: "154.120.22.90", agent: "Chrome / Android", status: "Success" },
                                        { date: "Oct 18, 2023 04:12 PM", ip: "196.201.21.43", agent: "Chrome / Windows", status: "Success" },
                                        { date: "Oct 15, 2023 01:22 PM", ip: "105.100.12.3", agent: "Samsung Browser / Android", status: "Success" },
                                        { date: "Oct 12, 2023 09:11 AM", ip: "192.168.1.102", agent: "Chrome / macOS", status: "Success" },
                                        { date: "Oct 10, 2023 03:45 PM", ip: "197.232.0.1", agent: "Firefox / macOS", status: "Success" },
                                        { date: "Oct 08, 2023 11:59 AM", ip: "154.67.12.8", agent: "Chrome / iOS", status: "Success" },
                                    ].map((log, i) => (
                                        <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">{log.date}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-mono text-gray-500">{log.ip}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600 dark:text-gray-400">{log.agent}</div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-600 border border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20">
                                                    {log.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
