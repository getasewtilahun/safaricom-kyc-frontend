"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiService } from "../../services/api";
import DashboardLayout from "../../../components/DashboardLayout";

export default function DashboardConfirmPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<any>(null);
    const [status, setStatus] = useState<string>("");
    const [showToast, setShowToast] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    useEffect(() => {
        const data = localStorage.getItem("fundWithdrawForm");
        if (data) {
            setFormData(JSON.parse(data));
        } else {
            router.replace("/dashboard");
        }
    }, [router]);

    const handleBack = () => {
        router.push("/dashboard");
    };

    const handleSave = async (saveStatus: "DRAFT" | "SUBMITTED") => {
        if (!formData) return;

        setLoading(true);
        try {
            const applicationData = {
                bankId: parseInt(formData.selectedBank),
                branchId: parseInt(formData.selectedBranch),
                accountName: formData.accountName,
                accountNumber: formData.accountNumber,
                status: saveStatus
            };

            await apiService.submitApplication(applicationData);

            setStatus(saveStatus);
            setToastMessage(`Application ${saveStatus.toLowerCase()} successfully!`);
            setShowToast(true);

            setTimeout(() => {
                setShowToast(false);
                if (saveStatus === "SUBMITTED") {
                    router.push("/confirmation");
                }
            }, 2000);

        } catch (error) {
            console.error('Failed to save application:', error);
            setToastMessage('Failed to save application. Please try again.');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } finally {
            setLoading(false);
        }
    };

    if (!formData) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <DashboardLayout active="Dashboard">
            {/* Confirmation Card */}
            <div className="w-full max-w-4xl bg-white rounded-lg shadow p-8">
                <div className="mb-6 flex items-center">
                    <div className="flex-1 border-t border-[#43b02a]" />
                    <div className="px-4 text-[#222] font-semibold text-lg">Fund Withdraw Option</div>
                    <div className="flex-1 border-t border-[#43b02a]" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div>
                        <div className="font-bold text-xs mb-1">BANK NAME:</div>
                        <div className="text-sm">{formData.selectedBank}</div>
                        <div className="font-bold text-xs mt-3 mb-1">ACCOUNT NUMBER:</div>
                        <div className="text-sm">{formData.accountNumber}</div>
                    </div>
                    <div>
                        <div className="font-bold text-xs mb-1">BANK BRANCH NAME:</div>
                        <div className="text-sm">{formData.selectedBranch}</div>
                        <div className="font-bold text-xs mt-3 mb-1">PROOF OF BANK ACCOUNT:</div>
                        <div className="text-sm text-[#43b02a] underline cursor-pointer">BANK ACCOUNT FILE</div>
                    </div>
                    <div>
                        <div className="font-bold text-xs mb-1">ACCOUNT NAME:</div>
                        <div className="text-sm">{formData.accountName}</div>
                    </div>
                </div>
                <div className="flex justify-end gap-4">
                    <button type="button" className="px-6 py-2 rounded bg-white border border-[#43b02a] text-[#43b02a] font-semibold hover:bg-[#f5f6fa]" onClick={handleBack}>Back</button>
                    <button
                        type="button"
                        disabled={loading}
                        className={`px-6 py-2 rounded border border-[#43b02a] text-[#43b02a] font-semibold ${loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-[#fff] hover:bg-[#f5f6fa]'
                            }`}
                        onClick={() => handleSave("DRAFT")}
                    >
                        {loading ? 'Saving...' : 'Save as Draft'}
                    </button>
                    <button
                        type="button"
                        disabled={loading}
                        className={`px-6 py-2 rounded text-white font-semibold ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#43b02a] hover:bg-[#369021]'
                            }`}
                        onClick={() => handleSave("SUBMITTED")}
                    >
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
} 