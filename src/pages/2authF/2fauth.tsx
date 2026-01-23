import { ArrowRight, CheckCircle2, ChevronLeft, QrCode, Shield, Smartphone } from "lucide-react";
import { useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import { useAuth } from "../../context/AuthContext";

export default function TwoFactorAuth() {
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [, setLocation] = useLocation();
    const { set2FAEnabled } = useAuth();

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) value = value.slice(-1);
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move to next input if value is entered
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = () => {
        // In a real app, you'd verify the code with your backend here
        if (otp.join("").length === 6) {
            setStep(3);
            set2FAEnabled(true);
            setTimeout(() => {
                setLocation("/settings");
            }, 3000);
        }
    };

    return (
        <div className="max-w-xl mx-auto py-10 px-4">
            <PageMeta title="Setup 2FA | Odipay" description="Enhance your account security" />

            <Link href="/settings" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-8 group">
                <ChevronLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
                Back to Settings
            </Link>

            <div className="bg-white border border-gray-200 rounded-3xl p-8 dark:bg-white/[0.03] dark:border-gray-800 shadow-sm overflow-hidden relative">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <Shield className="w-64 h-64 text-brand-500" />
                </div>

                {step === 1 && (
                    <div className="relative z-10 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center p-4 bg-brand-50 text-brand-600 rounded-2xl mb-6 dark:bg-brand-500/10 dark:text-brand-400">
                                <Smartphone className="w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Secure your account</h2>
                            <p className="mt-3 text-gray-500 dark:text-gray-400 px-4">Two-factor authentication adds an extra layer of security to your account besides your password.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start p-4 border border-gray-100 rounded-2xl dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.01]">
                                <div className="p-2 bg-white rounded-lg shadow-sm mr-4 dark:bg-gray-800">
                                    <QrCode className="w-5 h-5 text-brand-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Authenticator App</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Scan QR code using Google Authenticator, Authy, or Microsoft Authenticator.</p>
                                </div>
                                <div className="pt-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                </div>
                            </div>
                        </div>

                        <Button variant="primary" size="md" className="w-full h-12" endIcon={<ArrowRight className="w-4 h-4" />} onClick={() => setStep(2)}>
                            Get Started
                        </Button>
                    </div>
                )}

                {step === 2 && (
                    <div className="relative z-10 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Scan QR Code</h2>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Use your authenticator app to scan the code below</p>
                        </div>

                        <div className="flex justify-center">
                            <div className="p-4 bg-white rounded-3xl border-4 border-gray-50 dark:border-gray-800 shadow-xl ring-1 ring-gray-100 dark:ring-gray-700">
                                {/* Place holder for QR code */}
                                <div className="w-48 h-48 bg-gray-50 dark:bg-gray-900 flex items-center justify-center rounded-2xl">
                                    <QrCode className="w-32 h-32 text-gray-300 dark:text-gray-700" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="text-center">
                                <p className="text-sm font-medium text-gray-900 dark:text-white mb-4">Enter 6-digit verification code</p>
                                <div className="flex justify-between gap-2 px-4">
                                    {otp.map((digit, i) => (
                                        <input
                                            key={i}
                                            ref={(el) => { inputRefs.current[i] = el; }}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(i, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(i, e)}
                                            className="w-full h-14 text-center text-xl font-bold border border-gray-200 rounded-xl focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                        />
                                    ))}
                                </div>
                            </div>

                            <Button variant="primary" size="md" className="w-full h-12" disabled={otp.join("").length !== 6} onClick={handleVerify}>
                                Verify & Activate
                            </Button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="relative z-10 py-10 text-center space-y-6 animate-in zoom-in duration-500">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-green-50 text-green-500 rounded-full dark:bg-green-500/10 mb-2">
                            <CheckCircle2 className="w-16 h-16 animate-in zoom-in spin-in-12 duration-700" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">2FA Activated!</h2>
                            <p className="mt-3 text-gray-500 dark:text-gray-400">Your account is now more secure with two-factor authentication.</p>
                        </div>
                        <div className="pt-4">
                            <p className="text-xs text-brand-600 font-medium animate-pulse">Redirecting you to settings...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
