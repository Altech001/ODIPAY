import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import { Plus, LayoutGrid, Terminal, ArrowRight, Trash2, Pause, Play, Loader2 } from "lucide-react";
import { Modal } from "../../components/ui/modal";
import Input from "../../components/form/input/InputField";
import { ThemeToggleButton } from "../../components/common/ThemeToggleButton";
import { useAuthStore } from "../../store/authStore";
import { useApplicationsStore } from "../../store/applicationsStore";
import { AppCardSkeleton } from "../../components/ui/skeleton";
import { toast } from 'sonner'

export default function AppsViewPage() {
    const [, setLocation] = useLocation();
    const { user } = useAuthStore();

    // Store integration
    const {
        applications,
        isLoading,
        fetchApplications,
        createApplication,
        suspendApplication,
        activateApplication,
        deleteApplication,
        setCurrentApplication,
    } = useApplicationsStore();

    // Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '', // Map to support email if needed, or description
    });

    useEffect(() => {
        fetchApplications(1, 50);
    }, [fetchApplications]);

    // Handle Create Application
    const handleCreateApp = async () => {
        if (!formData.name || !formData.email) return;
        setIsCreating(true);

        try {
            const result = await createApplication({
                name: formData.name,
                description: `Support: ${formData.email}`,
                rateLimit: 100,
            });

            toast.success('Application created successfully!');
            if (result.apiKey) {
                console.log('API Key:', result.apiKey);
            }

            setIsCreateModalOpen(false);
            setFormData({ name: '', email: '' });
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to create application');
        } finally {
            setIsCreating(false);
        }
    };

    const handleSuspend = async (appId: string) => {
        try {
            await suspendApplication(appId);
            toast.success('Application suspended');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to suspend application');
        }
    };

    const handleActivate = async (appId: string) => {
        try {
            await activateApplication(appId);
            toast.success('Application activated');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to activate application');
        }
    };

    const handleDelete = async (appId: string) => {
        if (window.confirm('Are you sure you want to delete this application?')) {
            try {
                await deleteApplication(appId);
                toast.success('Application deleted');
            } catch (error) {
                toast.error(error instanceof Error ? error.message : 'Failed to delete application');
            }
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <PageMeta
                title="My Apps | Odipay"
                description="Manage your applications and access their dashboards."
            />

            {/* --- HEADER --- */}
            {/* --- HEADER --- */}
            <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
                    {/* Left: Logo & Context */}
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="w-9 h-9 rounded bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                                <Terminal className="w-5 h-5" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight leading-none">Odipay</h1>
                                {/* <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-none mt-1">Developer Portal</p> */}
                            </div>
                        </Link>


                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="hidden sm:flex items-center gap-2">
                            <Link href="/dashboard" className="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mr-2">
                                Back to Dashboard
                            </Link>
                        </div>
                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 hidden sm:block"></div>
                        <ThemeToggleButton />
                        {/* <UserDropdown /> */}
                    </div>
                </div>
            </header>

            {/* --- MAIN CONTENT --- */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">

                {/* Hero / Welcome */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-2xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                            Welcome back, {user?.name || 'Developer'}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-base max-w-2xl">
                            Select an application to manage your payments, view analytics, and configure your integrations.
                        </p>
                    </div>
                    <div>
                        <Button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="shadow-brand-glow hover:shadow-lg transition-all font-bold"
                            startIcon={<Plus className="w-5 h-5 font-bold" />}
                        >
                            Create New App
                        </Button>
                    </div>
                </div>

                {/* Apps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading && applications.length === 0 ? (
                        <>
                            <AppCardSkeleton />
                            <AppCardSkeleton />
                            <AppCardSkeleton />
                        </>
                    ) : (
                        applications.map((app) => (
                            <div
                                key={app.id}
                                className="group relative flex flex-col bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/50 hover:border-brand-500/30 hover:-translate-y-1"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className="h-14 w-14 rounded-xl border border-brand-100 dark:border-brand-500/10 flex items-center justify-center text-brand-500 group-hover:scale-105 transition-transform duration-300">
                                        <LayoutGrid className="w-7 h-7 font-bold" />
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${app.status === "ACTIVE"
                                            ? "bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30"
                                            : "bg-error-50 text-error-600 border-error-200 dark:bg-error-900/20 dark:text-error-400 dark:border-error-900/30"
                                            }`}>
                                            {app.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-6 flex-grow">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-brand-500 transition-colors">
                                        {app.name}
                                    </h3>
                                    <div className="flex flex-col gap-1">
                                        <div className="text-xs text-gray-400 uppercase font-semibold tracking-wider">App ID</div>
                                        <div className="text-sm font-mono text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 px-2 py-1 rounded self-start border border-gray-100 dark:border-gray-800">
                                            {app.id}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mb-4">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="flex-1 !py-2"
                                        onClick={() => app.status === 'ACTIVE' ? handleSuspend(app.id) : handleActivate(app.id)}
                                    >
                                        {app.status === 'ACTIVE' ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                                        {app.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="!py-2 !text-error-600 !border-error-100 hover:!bg-error-50"
                                        onClick={() => handleDelete(app.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>

                                <Button
                                    size="md"
                                    variant="primary"
                                    onClick={() => {
                                        setCurrentApplication(app);
                                        setLocation("/dashboard");
                                    }}
                                    className="w-full justify-between group/btn bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-brand-600 dark:hover:bg-brand-400 dark:hover:text-white border-0"
                                >
                                    <span>Open Dashboard</span>
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                </Button>
                            </div>
                        ))
                    )}

                    {/* Quick Create Card (Optional - like Africa's Talking) */}
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="group relative flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-gray-800/30 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl p-6 transition-all duration-300 hover:border-brand-300 dark:hover:border-brand-700 hover:bg-brand-50/50 dark:hover:bg-brand-900/10 min-h-[280px]"
                    >
                        <div className="h-14 w-14 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center text-gray-400 group-hover:text-brand-500 group-hover:scale-110 transition-all duration-300 mb-4">
                            <Plus className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Create Another App</h3>
                        <p className="text-sm text-gray-500 max-w-[200px]">Launch a new project environment in seconds.</p>
                    </button>
                </div>

                {/* Footer simple link */}
                <div className="mt-20 border-t border-gray-100 dark:border-gray-800 pt-8 flex justify-center text-sm text-gray-400">
                    <p>© 2026 Odipay. All rights reserved.</p>
                </div>

            </main>

            {/* --- CREATE APP MODAL --- */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                className="max-w-md p-0 overflow-hidden"
            >
                <div className="bg-white dark:bg-gray-900">
                    <div className="px-6 py-6 border-b border-gray-100 dark:border-gray-800">
                        <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4">
                            <Terminal className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Create New App</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Set up a new environment for your project.
                        </p>
                    </div>

                    <div className="p-6 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">App Name</label>
                            <Input
                                placeholder="e.g. My Awesome Shop"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Support Email</label>
                            <Input
                                placeholder="support@myapp.com"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 dark:bg-gray-800/50 flex gap-3 justify-end border-t border-gray-100 dark:border-gray-800">
                        <Button
                            variant="outline"
                            onClick={() => setIsCreateModalOpen(false)}
                            disabled={isCreating}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleCreateApp}
                            disabled={!formData.name || !formData.email || isCreating}
                            startIcon={isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        >
                            {isCreating ? "Creating..." : "Create App"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
