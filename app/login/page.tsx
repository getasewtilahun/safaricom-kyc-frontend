"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isValid, setIsValid] = useState(false);
    const [usernameTouched, setUsernameTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);

    // Password validation function
    const validatePassword = (password: string) => {
        const errors: string[] = [];
        if (password.length < 8) {
            errors.push("Password must be at least 8 characters long");
        }
        if (!/[A-Z]/.test(password)) {
            errors.push("Password must contain at least one uppercase letter");
        }
        if (!/[a-z]/.test(password)) {
            errors.push("Password must contain at least one lowercase letter");
        }
        if (!/\d/.test(password)) {
            errors.push("Password must contain at least one number");
        }
        if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
            errors.push("Password must contain at least one special character");
        }
        return errors;
    };

    // Validate form
    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.username.trim()) {
            newErrors.username = "Email address is required";
        } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.username)) {
            newErrors.username = "Enter a valid email address";
        }
        const passwordErrors = validatePassword(formData.password);
        if (passwordErrors.length > 0) {
            newErrors.password = passwordErrors.join(", ");
        }
        setErrors(newErrors);
        setIsValid(
            Object.keys(newErrors).length === 0 &&
            formData.username.trim() !== "" &&
            formData.password !== ""
        );
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isValid) {
            router.push("/dashboard");
        }
    };

    useEffect(() => {
        validateForm();
        // eslint-disable-next-line
    }, [formData]);

    return (
        <div className="min-h-screen bg-[#f5f6fa] flex flex-col">
            {/* Header */}
            <header className="bg-[#43b02a] shadow-md shadow-[#43b02a]/30 h-16 flex items-center px-4 md:px-12 justify-between">
                <div className="flex items-center h-full">
                    <img src="/mpesa-logo.png" alt="M-PESA Logo" className="h-7 w-auto" />
                    <img src="/safari.webp" alt="Safaricom Logo" className="h-4 w-auto ml-2" />
                </div>
                <nav className="flex gap-4 items-center">
                    <a className="text-white font-medium hover:underline" href="#">APPLY</a>
                    <a className="text-white font-medium hover:underline" href="#">RECOMMEND</a>
                    <a className="bg-white text-[#43b02a] font-bold px-4 py-1 rounded shadow ml-2 border border-white" href="#">LOGIN</a>
                </nav>
            </header>
            {/* Main Content: Two columns, no card */}
            <main className="flex-1 flex flex-col md:flex-row items-center justify-center w-full max-w-7xl mx-auto px-2 py-8 gap-8">
                {/* Left: Form */}
                <div className="w-full md:w-1/2 flex flex-col justify-center items-start md:items-start pl-8 md:pl-16">
                    <h2 className="text-2xl md:text-2xl font-bold text-gray-900 mb-2">M-PESA Acquisition Portal</h2>
                    <p className="text-gray-700 mb-6 text-sm">Welcome to M-PESA world of convenience! This Portal provides an efficient
                        way to access and manage your sales.</p>
                    <form className="space-y-6 w-full max-w-md" onSubmit={handleSubmit}>
                        {/* Email Field with notched label */}
                        <div className="relative mt-6">
                            <input
                                id="username"
                                name="username"
                                type="email"
                                autoComplete="email"
                                required
                                className={`block w-full pl-10 pr-3 pt-4 pb-2 border ${errors.username ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-[#43b02a] focus:border-[#43b02a] text-gray-900 bg-[#f8fafd]`}
                                placeholder=""
                                value={formData.username}
                                onChange={handleInputChange}
                                onBlur={() => setUsernameTouched(true)}
                            />
                            {/* Notched label */}
                            <label htmlFor="username" className="absolute left-3 -top-2 bg-[#f5f6fa] px-1 text-xs font-semibold text-gray-600 pointer-events-none z-10">
                                Email Address
                            </label>
                            {/* Email icon */}
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="2" /><path d="M3 7l9 6 9-6" strokeWidth="2" /></svg>
                            </span>
                            {errors.username && usernameTouched && <p className="text-xs text-red-600 mt-1">{errors.username}</p>}
                        </div>
                        {/* Password Field with notched label */}
                        <div className="relative mt-6">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                required
                                className={`block w-full pl-10 pr-10 pt-4 pb-2 border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-[#43b02a] focus:border-[#43b02a] text-gray-900 bg-[#f8fafd]`}
                                placeholder=""
                                value={formData.password}
                                onChange={handleInputChange}
                                onBlur={() => setPasswordTouched(true)}
                            />
                            {/* Notched label */}
                            <label htmlFor="password" className="absolute left-3 -top-3 bg-[#f5f6fa] px-1 text-xs font-semibold text-gray-600 pointer-events-none z-10">
                                Password
                            </label>
                            {/* Lock icon */}
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="6" y="10" width="12" height="8" rx="2" strokeWidth="2" /><path d="M9 10V8a3 3 0 116 0v2" strokeWidth="2" /></svg>
                            </span>
                            {/* Show/hide password */}
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                onClick={() => setShowPassword((s) => !s)}
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" /></svg>
                                ) : (
                                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                )}
                            </button>
                            {errors.password && passwordTouched && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
                        </div>
                        <button
                            type="submit"
                            disabled={!isValid}
                            className={`w-full py-2 mt-2 rounded bg-[#43b02a] text-white font-bold text-base ${isValid ? "hover:bg-[#369021]" : "bg-opacity-60 cursor-not-allowed"}`}
                        >
                            LOGIN
                        </button>
                        <div className="mt-2 w-full flex justify-end">
                            <a href="#" className="text-[#43b02a] text-xs font-semibold hover:underline">FORGOT PASSWORD?</a>
                        </div>
                    </form>
                </div>
                {/* Right: Circular Icon Arrangement */}
                <div className="w-full md:w-1/2 flex items-center justify-center mt-8 md:mt-0">
                    <div className="relative w-56 h-56 flex items-center justify-center">
                        {/* Center icon */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow p-4 border-2 border-[#43b02a]">
                            <svg width="40" height="40" fill="#43b02a" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                        {/* Top right icon */}
                        <div className="absolute right-6 top-4 bg-white rounded-full shadow p-3 border-2 border-[#e94e77]">
                            <svg width="32" height="32" fill="#e94e77" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><text x="12" y="16" textAnchor="middle" fontSize="12" fill="#fff">4</text></svg>
                        </div>
                        {/* Bottom right icon */}
                        <div className="absolute right-2 bottom-8 bg-white rounded-full shadow p-3 border-2 border-[#1e90ff]">
                            <svg width="32" height="32" fill="#1e90ff" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><rect x="8" y="8" width="8" height="8" fill="#fff" /></svg>
                        </div>
                        {/* Bottom left icon */}
                        <div className="absolute left-2 bottom-8 bg-white rounded-full shadow p-3 border-2 border-[#00bcd4]">
                            <svg width="32" height="32" fill="#00bcd4" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><rect x="10" y="10" width="4" height="4" fill="#fff" /></svg>
                        </div>
                        {/* Top left icon */}
                        <div className="absolute left-6 top-4 bg-white rounded-full shadow p-3 border-2 border-[#1e90ff]">
                            <svg width="32" height="32" fill="#1e90ff" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><rect x="8" y="8" width="8" height="8" fill="#fff" /></svg>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 