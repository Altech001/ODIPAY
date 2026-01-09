import React, { useState, useRef } from "react";
import { Shield, Lock, ArrowRight, Smartphone } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Button from "./ui/button/Button";

interface TwoFactorGuardProps {
    children: React.ReactNode;
}

const TwoFactorGuard: React.FC<TwoFactorGuardProps> = ({ children }) => {
    const { is2FAEnabled, is2FAVerified, verify2FA } = useAuth();
    const [digits, setDigits] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    if (!is2FAEnabled || is2FAVerified) {
        return <>{children}</>;
    }

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) value = value.slice(-1);
        if (!/^\d*$/.test(value)) return;

        const newDigits = [...digits];
        newDigits[index] = value;
        setDigits(newDigits);
        setError(false);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !digits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const code = digits.join("");
        if (!verify2FA(code)) {
            setError(true);
            setDigits(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4 animate-in fade-in duration-500">
            <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-8 dark:bg-white/[0.03] dark:border-gray-800 shadow-xl overflow-hidden relative">
                <div className="absolute -top-12 -right-12 p-24 opacity-5 pointer-events-none">
                    <Shield className="w-48 h-48 text-brand-500" />
                </div>

                <div className="relative z-10 text-center space-y-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center justify-center p-4 bg-orange-50 text-orange-600 rounded-full dark:bg-orange-500/10 dark:text-orange-400">
                            <Lock className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Security Check</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            This page requires two-factor authentication. Please enter the code from your authenticator app.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex justify-between gap-2">
                            {digits.map((digit, i) => (
                                <input
                                    key={i}
                                    ref={(el) => { inputRefs.current[i] = el; }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(i, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(i, e)}
                                    autoFocus={i === 0}
                                    className={`w-full h-12 text-center text-lg font-bold border rounded-xl outline-none transition-all dark:bg-gray-800 dark:text-white ${error
                                        ? "border-red-500 ring-4 ring-red-500/10"
                                        : "border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700"
                                        }`}
                                />
                            ))}
                        </div>

                        {error && (
                            <p className="text-xs font-semibold text-red-500 animate-bounce">
                                Invalid verification code. Please try again.
                            </p>
                        )}

                        <Button
                            variant="primary"
                            size="md"
                            className="w-full h-11"
                            disabled={digits.join("").length !== 6}
                            endIcon={<ArrowRight className="w-4 h-4" />}
                        >
                            Verify Identity
                        </Button>
                    </form>

                    <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center justify-center">
                        <Smartphone className="w-3 h-3 mr-1" />
                        Authentication Code: 123456 (Demo)
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TwoFactorGuard;
