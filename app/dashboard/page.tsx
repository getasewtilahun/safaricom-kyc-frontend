"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiService, Bank, Branch } from "../services/api";
import DashboardLayout from "../../components/DashboardLayout";

export default function DashboardPage() {
    const [banks, setBanks] = useState<Bank[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [selectedBank, setSelectedBank] = useState("");
    const [selectedBranch, setSelectedBranch] = useState("");
    const [accountName, setAccountName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [uploadedFile, setUploadedFile] = useState<any>(null);
    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const router = useRouter();

    // Load banks on component mount
    useEffect(() => {
        const loadBanks = async () => {
            try {
                const banksData = await apiService.getBanks();
                setBanks(banksData);
            } catch (error) {
                console.error('Failed to load banks:', error);
            }
        };
        loadBanks();
    }, []);

    const handleBankChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const bankId = parseInt(e.target.value);
        setSelectedBank(e.target.value);
        setSelectedBranch("");

        if (bankId) {
            try {
                const branchesData = await apiService.getBranches(bankId);
                setBranches(branchesData);
            } catch (error) {
                console.error('Failed to load branches:', error);
            }
        } else {
            setBranches([]);
        }
    };

    const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedBranch(e.target.value);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        setFile(selectedFile);

        if (selectedFile) {
            setUploading(true);
            try {
                const uploadResult = await apiService.uploadFile(selectedFile);
                setUploadedFile(uploadResult);
            } catch (error) {
                console.error('Failed to upload file:', error);
                alert('Failed to upload file. Please try again.');
                setFile(null);
            } finally {
                setUploading(false);
            }
        }
    };

    const validate = () => {
        const newErrors: any = {};
        if (!selectedBank) newErrors.selectedBank = "Bank is required.";
        if (!selectedBranch) newErrors.selectedBranch = "Branch is required.";
        if (!accountName.trim()) newErrors.accountName = "Account name is required.";
        if (!accountNumber) newErrors.accountNumber = "Account number is required.";
        else if (!/^\d+$/.test(accountNumber)) newErrors.accountNumber = "Account number must be numeric.";
        if (!file) newErrors.file = "Proof of bank account is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            setLoading(true);
            try {
                const applicationData = {
                    bankId: parseInt(selectedBank),
                    branchId: parseInt(selectedBranch),
                    accountName,
                    accountNumber,
                    status: 'SUBMITTED' as const,
                    fileName: uploadedFile?.filename,
                    originalFileName: uploadedFile?.originalName,
                    fileSize: uploadedFile?.size
                };

                await apiService.submitApplication(applicationData);

                // Store form data for confirmation page
                localStorage.setItem("fundWithdrawForm", JSON.stringify({
                    selectedBank,
                    selectedBranch,
                    accountName,
                    accountNumber,
                    file: file ? { name: file.name, size: file.size, type: file.type } : null
                }));

                router.push("/dashboard/confirm");
            } catch (error) {
                console.error('Failed to submit application:', error);
                alert('Failed to submit application. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <DashboardLayout active="Dashboard">
            {/* Stepper and Form Card */}
            <div className="w-full max-w-5xl bg-white rounded-lg shadow p-6">
                {/* Stepper */}
                <div className="mb-8">
                    <div className="flex items-center justify-center gap-2 text-sm font-medium text-[#43b02a]">
                        <span className="flex items-center gap-1"><span className="w-5 h-5 rounded-full bg-[#43b02a] text-white flex items-center justify-center">✓</span> Check Merchant</span>
                        <span className="h-px w-8 bg-[#43b02a]" />
                        <span className="flex items-center gap-1"><span className="w-5 h-5 rounded-full bg-[#43b02a] text-white flex items-center justify-center">✓</span> Distribution Detail</span>
                        <span className="h-px w-8 bg-[#43b02a]" />
                        <span className="flex items-center gap-1"><span className="w-5 h-5 rounded-full bg-[#43b02a] text-white flex items-center justify-center">✓</span> Business Type</span>
                        <span className="h-px w-8 bg-[#43b02a]" />
                        <span className="flex items-center gap-1"><span className="w-5 h-5 rounded-full bg-[#43b02a] text-white flex items-center justify-center">✓</span> Business Detail</span>
                        <span className="h-px w-8 bg-[#43b02a]" />
                        <span className="flex items-center gap-1"><span className="w-5 h-5 rounded-full bg-[#43b02a] text-white flex items-center justify-center">✓</span> Business Owner</span>
                        <span className="h-px w-8 bg-[#43b02a]" />
                        <span className="flex items-center gap-1"><span className="w-5 h-5 rounded-full border-2 border-[#43b02a] text-[#43b02a] flex items-center justify-center">6</span> Fund Withdraw</span>
                        <span className="h-px w-8 bg-[#43b02a]" />
                        <span className="flex items-center gap-1"><span className="w-5 h-5 rounded-full border-2 border-gray-300 text-gray-400 flex items-center justify-center">7</span> Review</span>
                    </div>
                </div>
                {/* Fund Withdraw Option Title */}
                <div className="mb-4 flex items-center">
                    <div className="flex-1 border-t border-[#43b02a]" />
                    <div className="px-4 text-[#222] font-semibold text-lg">Fund Withdraw Option</div>
                    <div className="flex-1 border-t border-[#43b02a]" />
                </div>
                {/* Fund Withdraw Option Form */}
                <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                    <div className="flex items-center mb-4">
                        <div className="flex items-center">
                            <input type="checkbox" checked readOnly className="accent-[#43b02a] w-5 h-5 rounded mr-2" />
                            <span className="font-semibold text-[#222] bg-white px-4 py-2 rounded shadow border border-gray-200">Bank</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Bank</label>
                            <select
                                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#43b02a] focus:border-[#43b02a] ${errors.selectedBank ? 'border-red-500' : 'border-gray-300'}`}
                                value={selectedBank}
                                onChange={handleBankChange}
                            >
                                <option value="">Select Bank</option>
                                {banks.map((bank) => (
                                    <option key={bank.id} value={bank.id}>{bank.value}</option>
                                ))}
                            </select>
                            {errors.selectedBank && <p className="text-xs text-red-600 mt-1">{errors.selectedBank}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Select Branch</label>
                            <select
                                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#43b02a] focus:border-[#43b02a] ${errors.selectedBranch ? 'border-red-500' : 'border-gray-300'}`}
                                value={selectedBranch}
                                onChange={handleBranchChange}
                                disabled={!selectedBank}
                            >
                                <option value="">Select Branch</option>
                                {branches.map((branch) => (
                                    <option key={branch.id} value={branch.id}>{branch.value}</option>
                                ))}
                            </select>
                            {errors.selectedBranch && <p className="text-xs text-red-600 mt-1">{errors.selectedBranch}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Account Name</label>
                            <input
                                type="text"
                                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#43b02a] focus:border-[#43b02a] ${errors.accountName ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter Account Name"
                                value={accountName}
                                onChange={(e) => setAccountName(e.target.value)}
                            />
                            {errors.accountName && <p className="text-xs text-red-600 mt-1">{errors.accountName}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Account Number</label>
                            <input
                                type="text"
                                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#43b02a] focus:border-[#43b02a] ${errors.accountNumber ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter Account Number"
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                            />
                            {errors.accountNumber && <p className="text-xs text-red-600 mt-1">{errors.accountNumber}</p>}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1">Proof of Bank Account</label>
                        <input
                            type="file"
                            className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#43b02a] focus:border-[#43b02a] ${errors.file ? 'border-red-500' : 'border-gray-300'}`}
                            onChange={handleFileChange}
                            accept=".pdf,.png,.jpg,.jpeg"
                            disabled={uploading}
                        />
                        {uploading && <p className="text-xs text-blue-600 mt-1">Uploading file...</p>}
                        {uploadedFile && <p className="text-xs text-green-600 mt-1">✓ File uploaded: {uploadedFile.originalName}</p>}
                        {errors.file && <p className="text-xs text-red-600 mt-1">{errors.file}</p>}
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" className="px-6 py-2 rounded bg-white border border-[#43b02a] text-[#43b02a] font-semibold hover:bg-[#f5f6fa]">Back</button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-2 rounded text-white font-semibold ${loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-[#43b02a] hover:bg-[#369021]'
                                }`}
                        >
                            {loading ? 'Submitting...' : 'Next'}
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
} 