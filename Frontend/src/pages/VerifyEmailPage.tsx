import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { notificationService } from "../services/notificationService";
import { motion, AnimatePresence } from "framer-motion";

// shadcn/ui
import { Button } from "../components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "../components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "../components/ui/alert";
import { Loader2, CheckCircle2, AlertCircle, RefreshCcw, ArrowLeft } from "lucide-react";

const LOGO_SRC = new URL("../assets/logo.jpeg", import.meta.url).toString();

export const VerifyEmailPage = () => {
    const { t } = useTranslation();
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";

    useEffect(() => {
        // Focus first input on mount
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        // Take only the last character if multiple are entered
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Filter out errors when user starts typing again
        if (error) setError("");

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
        if (pastedData.every(char => /^\d$/.test(char))) {
            const newOtp = [...otp];
            pastedData.forEach((char, i) => {
                if (i < 6) newOtp[i] = char;
            });
            setOtp(newOtp);
            // Focus the last input or the one after the pasted data
            const nextFocus = Math.min(pastedData.length, 5);
            inputRefs.current[nextFocus]?.focus();
        }
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setError("");
        setSuccess("");

        const code = otp.join("");
        if (code.length < 6) {
            setError(t('enterFullCode'));
            return;
        }

        if (!email) {
            setError(t('emailMissing'));
            setTimeout(() => navigate("/register"), 2000);
            return;
        }

        setIsLoading(true);
        try {
            await notificationService.verifyEmail(email, code);
            setSuccess(t('accountVerifiedSuccess'));
            setTimeout(() => navigate("/login"), 2500);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : t('invalidCode'));
            // Clear OTP on error to let user re-enter
            setOtp(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (!email || resending) return;

        setResending(true);
        setError("");
        try {
            await notificationService.resendVerificationEmail(email);
            setSuccess(t('resendSuccess'));
        } catch (err: unknown) {
            setError(t('resendFailed'));
        } finally {
            setResending(false);
            // Auto-clear success message after 5 seconds
            setTimeout(() => setSuccess(""), 5000);
        }
    };

    // Auto-submit when all digits are filled
    useEffect(() => {
        if (otp.every(digit => digit !== "") && !isLoading && !success) {
            handleSubmit();
        }
    }, [otp]);

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden font-sans">
            {/* Dynamic Mesh Background */}
            <div className="absolute inset-0 bg-[#0f172a]" />
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600 blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600 blur-[120px] animate-pulse [animation-delay:2s]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-lg"
            >
                <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl text-white overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

                    <CardHeader className="pt-8 pb-6 text-center space-y-4">
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="mx-auto w-20 h-20 rounded-2xl bg-white p-1 shadow-lg shadow-blue-500/20 flex items-center justify-center overflow-hidden"
                        >
                            <img src={LOGO_SRC} alt="BiznesAsh" className="w-full h-full object-cover" />
                        </motion.div>

                        <div className="space-y-2">
                            <CardTitle className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                                {t('confirmEmailTitle')}
                            </CardTitle>
                            <CardDescription className="text-blue-100/60 text-base max-w-xs mx-auto">
                                {t('confirmEmailDesc')}
                                <span className="block font-semibold text-blue-400 mt-1">{email || t('yourAddress')}</span>
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="px-8 pb-8 space-y-8">
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-400">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle className="font-bold">{t('error')}</AlertTitle>
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                </motion.div>
                            )}
                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <Alert className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
                                        <CheckCircle2 className="h-4 w-4" />
                                        <AlertTitle className="font-bold">{t('success')}</AlertTitle>
                                        <AlertDescription>{success}</AlertDescription>
                                    </Alert>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="flex justify-between gap-2 sm:gap-4 md:px-4">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => {
                                            inputRefs.current[index] = el;
                                        }}
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={handlePaste}
                                        disabled={isLoading || !!success}
                                        className={`w-12 h-16 sm:w-14 sm:h-20 text-center text-3xl font-bold rounded-xl border-2 transition-all outline-none
                      ${digit
                                                ? 'bg-blue-500/20 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                                                : 'bg-white/5 border-white/10 text-white hover:border-white/30 focus:border-blue-500/50'
                                            }
                    `}
                                    />
                                ))}
                            </div>

                            <div className="space-y-4 pt-2">
                                <Button
                                    type="submit"
                                    disabled={isLoading || !!success || otp.some(d => !d)}
                                    className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-600/20 transition-all disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            {t('sending')}
                                        </span>
                                    ) : (
                                        t('verifyAccount')
                                    )}
                                </Button>

                                <div className="flex items-center justify-between text-sm px-1">
                                    <button
                                        type="button"
                                        onClick={handleResend}
                                        disabled={resending || isLoading || !!success}
                                        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors disabled:opacity-30"
                                    >
                                        <RefreshCcw className={`h-4 w-4 ${resending ? 'animate-spin' : ''}`} />
                                        {resending ? t('sending') : t('resendCode')}
                                    </button>

                                    <Link
                                        to="/login"
                                        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        {t('backToLogin')}
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </CardContent>

                    <CardFooter className="bg-white/5 border-t border-white/10 px-8 py-4 flex justify-center">
                        <p className="text-white/30 text-xs">
                            {t('secureVerification')} &bull; BiznesAsh &copy; 2026
                        </p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
};
