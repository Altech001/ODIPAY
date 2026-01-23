import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useApplicationsStore } from "../../store/applicationsStore";
import { Redirect } from "wouter";

import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import {
    Settings,
    Trash2,
    AlertTriangle,
    UserPlus,
    Shield,
    Key,
    Save,
    RotateCw,
    Copy
} from "lucide-react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: "Owner" | "Admin" | "Developer" | "Viewer";
    avatar?: string;
}

export default function AppSettings() {
    const { currentApplication, updateApplication, deleteApplication, rotateApiKey, isLoading } = useApplicationsStore();

    // State for general info
    const [appName, setAppName] = useState("");
    const [supportEmail, setSupportEmail] = useState("");
    const [webhookUrl, setWebhookUrl] = useState("");

    // Secret Key state
    const [liveSecretKey, setLiveSecretKey] = useState("sk_live_********************");
    const [showSecret, setShowSecret] = useState(false);
    const [isRotating, setIsRotating] = useState(false);

    // Team Members (Empty for now as backend doesn't support it yet)
    const [teamMembers] = useState<TeamMember[]>([]);
    const [inviteEmail, setInviteEmail] = useState("");

    useEffect(() => {
        if (currentApplication) {
            setAppName(currentApplication.name);
            // In our system, support email is currently stored in description
            const emailMatch = currentApplication.description?.match(/Support: (.*)/);
            setSupportEmail(emailMatch ? emailMatch[1] : (currentApplication.description || ""));
            setWebhookUrl(currentApplication.webhookUrl || "");
        }
    }, [currentApplication]);

    if (!currentApplication) {
        return <Redirect to="/applications" />;
    }

    const handleCopy = (text: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    const handleUpdateGeneral = async () => {
        try {
            await updateApplication(currentApplication.id, {
                name: appName,
                description: `Support: ${supportEmail}`,
            });
            toast.success("Application settings updated");
        } catch {
            toast.error("Failed to update settings");
        }
    };

    const handleUpdateWebhook = async () => {
        try {
            await updateApplication(currentApplication.id, {
                webhookUrl: webhookUrl,
            });
            toast.success("Webhook URL updated");
        } catch {
            toast.error("Failed to update webhook");
        }
    };

    const handleRotateKey = async () => {
        if (!window.confirm("Are you sure you want to rotate your API key? All current integrations will break.")) return;
        setIsRotating(true);
        try {
            const newKey = await rotateApiKey(currentApplication.id);
            setLiveSecretKey(newKey);
            setShowSecret(true);
            toast.success("API key regenerated");
        } catch {
            toast.error("Failed to regenerate API key");
        } finally {
            setIsRotating(false);
        }
    };

    const handleDeleteApp = async () => {
        if (!window.confirm(`Are you absolutely sure you want to delete ${currentApplication.name}? This action cannot be undone.`)) return;
        try {
            await deleteApplication(currentApplication.id);
            toast.success("Application deleted");
        } catch {
            toast.error("Failed to delete application");
        }
    };

    return (
        <div className="space-y-6">
            <PageMeta
                title="App Settings | Odipay"
                description="Configure your application settings, manage team access, and view API credentials."
            />

            {/* Header */}
            <div>
                <PageBreadcrumb pageTitle={"App Settings"} />
                <p className="text-gray-500 dark:text-gray-400">
                    Manage configuration and access for <span className="font-semibold text-gray-900 dark:text-white">{appName}</span>
                </p>
            </div>

            {/* General Information */}
            <div className="p-6 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-brand-50 dark:bg-brand-900/20 rounded-lg text-brand-600 dark:text-brand-400">
                        <Settings className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">General Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Application Name</label>
                        <Input
                            value={appName}
                            onChange={(e) => setAppName(e.target.value)}
                            className="max-w-md"
                        />
                        <p className="mt-1.5 text-xs text-gray-500">This name will be displayed on your checkout pages.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Support Email</label>
                        <Input
                            value={supportEmail}
                            onChange={(e) => setSupportEmail(e.target.value)}
                            className="max-w-md"
                        />
                        <p className="mt-1.5 text-xs text-gray-500">Public email for customer support inquiries.</p>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                    <Button
                        startIcon={<Save className="w-4 h-4" />}
                        onClick={handleUpdateGeneral}
                        disabled={isLoading}
                    >
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>

            {/* API Configuration */}
            <div className="p-6 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl ">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                        <Key className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">API Configuration</h2>
                </div>

                <div className="space-y-6 max-w-3xl">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Live Public Key (App ID)</label>
                        <div className="flex gap-2">
                            <Input
                                value={currentApplication.id}
                                disabled
                                className="font-mono text-sm bg-gray-50 dark:bg-gray-800/50"
                            />
                            <Button variant="outline" size="sm" onClick={() => handleCopy(currentApplication.id)}>
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Live Secret Key</label>
                        <div className="flex gap-2">
                            <Input
                                value={liveSecretKey}
                                type={(showSecret || liveSecretKey.startsWith('sk_')) ? "text" : "password"}
                                disabled
                                className="font-mono text-sm bg-gray-50 dark:bg-gray-800/50"
                            />
                            <Button variant="outline" size="sm" onClick={() => setShowSecret(!showSecret)}>
                                {showSecret ? "Hide" : "Show"}
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleCopy(liveSecretKey)}>
                                <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-amber-600 border-amber-200 hover:bg-amber-50"
                                onClick={handleRotateKey}
                                disabled={isRotating}
                            >
                                <RotateCw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} />
                            </Button>
                        </div>
                        <p className="mt-1.5 text-xs text-amber-600 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Keep this key secret. Never share it in client-side code.
                        </p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Webhook URL</label>
                        <div className="flex gap-2">
                            <Input
                                value={webhookUrl}
                                onChange={(e) => setWebhookUrl(e.target.value)}
                                placeholder="https://your-domain.com/webhook"
                            />
                            <Button
                                onClick={handleUpdateWebhook}
                                disabled={isLoading}
                            >
                                {isLoading ? "Updating..." : "Update"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Team Members */}
            <div className="p-6 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl ">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Team Access</h2>
                            <p className="text-sm text-gray-500">Manage who can view and edit this app.</p>
                        </div>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                        <Input
                            placeholder="Enter email address"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            className="min-w-[200px]"
                        />
                        <Button
                            startIcon={<UserPlus className="w-4 h-4" />}
                            disabled={!inviteEmail}
                            onClick={() => {
                                toast.success(`Invitation sent to ${inviteEmail}`);
                                setInviteEmail("");
                            }}
                        >
                            Invite
                        </Button>
                    </div>
                </div>

                <div className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50 text-xs uppercase text-gray-500 border-b border-gray-100 dark:border-gray-800">
                                <th className="px-5 py-3 font-semibold">User</th>
                                <th className="px-5 py-3 font-semibold">Role</th>
                                <th className="px-5 py-3 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {teamMembers.length > 0 ? (
                                teamMembers.map((member) => (
                                    <tr key={member.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                                                    {member.avatar ? (
                                                        <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                                                            {member.name.charAt(0)}
                                                        </span>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</div>
                                                    <div className="text-xs text-gray-500">{member.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${member.role === 'Owner'
                                                ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-900/30'
                                                : 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
                                                }`}>
                                                {member.role}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            {member.role !== 'Owner' && (
                                                <button className="text-gray-400 hover:text-error-500 transition-colors p-1">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="px-5 py-8 text-center text-sm text-gray-500">
                                        No team members found. Invite someone to collaborate.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="p-6 bg-error-50/50 dark:bg-error-900/10 border border-error-100 dark:border-error-900/30 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-error-100 dark:bg-error-900/30 rounded-lg text-error-600 dark:text-error-500">
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Danger Zone</h2>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white dark:bg-gray-900/50 border border-error-100 dark:border-error-900/30 rounded-xl">
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Delete this Application</h3>
                        <p className="text-sm text-gray-500 mt-1 max-w-md">
                            Once you delete an application, there is no going back. Please be certain.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        className="!border-error-200 !text-error-600 hover:!bg-error-50 dark:!border-error-900 dark:!text-error-400 dark:hover:!bg-error-900/20 whitespace-nowrap"
                        onClick={handleDeleteApp}
                        disabled={isLoading}
                    >
                        {isLoading ? "Deleting..." : "Delete App"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
