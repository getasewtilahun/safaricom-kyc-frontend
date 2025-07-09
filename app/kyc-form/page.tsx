'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
    bankName: string;
    branchName: string;
    accountName: string;
    accountNumber: string;
    proofOfAccount: File | null;
}

interface Bank {
    name: string;
    branches: string[];
}

export default function KYCFormPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        bankName: '',
        branchName: '',
        accountName: '',
        accountNumber: '',
        proofOfAccount: null
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isValid, setIsValid] = useState(false);

    // Sample bank data - in a real app, this would come from an API
    const banks: Bank[] = [
        {
            name: 'Chase Bank',
            branches: ['Downtown Branch', 'Midtown Branch', 'Uptown Branch', 'Airport Branch']
        },
        {
            name: 'Bank of America',
            branches: ['Main Street Branch', 'Central Branch', 'North Branch', 'South Branch']
        },
        {
            name: 'Wells Fargo',
            branches: ['City Center Branch', 'Suburban Branch', 'Metro Branch', 'Express Branch']
        },
        {
            name: 'Citibank',
            branches: ['Financial District Branch', 'Shopping Center Branch', 'University Branch', 'Corporate Branch']
        }
    ];

    // Get available branches for selected bank
    const getAvailableBranches = () => {
        const selectedBank = banks.find(bank => bank.name === formData.bankName);
        return selectedBank ? selectedBank.branches : [];
    };

    // Validate form
    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        // Bank name validation
        if (!formData.bankName) {
            newErrors.bankName = 'Bank name is required';
        }

        // Branch name validation
        if (!formData.branchName) {
            newErrors.branchName = 'Branch name is required';
        }

        // Account name validation
        if (!formData.accountName.trim()) {
            newErrors.accountName = 'Account name is required';
        }

        // Account number validation
        if (!formData.accountNumber) {
            newErrors.accountNumber = 'Account number is required';
        } else if (!/^\d+$/.test(formData.accountNumber)) {
            newErrors.accountNumber = 'Account number must contain only numbers';
        } else if (formData.accountNumber.length < 8) {
            newErrors.accountNumber = 'Account number must be at least 8 digits';
        }

        // File validation
        if (!formData.proofOfAccount) {
            newErrors.proofOfAccount = 'Proof of bank account is required';
        } else {
            const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
            if (!allowedTypes.includes(formData.proofOfAccount.type)) {
                newErrors.proofOfAccount = 'File must be PDF, PNG, or JPG format';
            }
            if (formData.proofOfAccount.size > 5 * 1024 * 1024) { // 5MB limit
                newErrors.proofOfAccount = 'File size must be less than 5MB';
            }
        }

        setErrors(newErrors);
        setIsValid(Object.keys(newErrors).length === 0);
    };

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Reset branch name when bank changes
        if (name === 'bankName') {
            setFormData(prev => ({
                ...prev,
                bankName: value,
                branchName: ''
            }));
        }
    };

    // Handle file upload
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData(prev => ({
            ...prev,
            proofOfAccount: file
        }));
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isValid) {
            // Store form data in localStorage for the confirmation page
            localStorage.setItem('kycFormData', JSON.stringify({
                ...formData,
                proofOfAccount: formData.proofOfAccount ? {
                    name: formData.proofOfAccount.name,
                    size: formData.proofOfAccount.size,
                    type: formData.proofOfAccount.type
                } : null
            }));
            router.push('/confirmation');
        }
    };

    // Validate on form data change
    useEffect(() => {
        validateForm();
    }, [formData]);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white shadow-lg rounded-lg p-8">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            KYC Verification Form
                        </h2>
                        <p className="text-gray-600">
                            Please provide your bank account details for verification
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Bank Name */}
                        <div>
                            <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-2">
                                Bank Name *
                            </label>
                            <select
                                id="bankName"
                                name="bankName"
                                value={formData.bankName}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.bankName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            >
                                <option value="">Select a bank</option>
                                {banks.map((bank) => (
                                    <option key={bank.name} value={bank.name}>
                                        {bank.name}
                                    </option>
                                ))}
                            </select>
                            {errors.bankName && (
                                <p className="mt-1 text-sm text-red-600">{errors.bankName}</p>
                            )}
                        </div>

                        {/* Branch Name */}
                        <div>
                            <label htmlFor="branchName" className="block text-sm font-medium text-gray-700 mb-2">
                                Branch Name *
                            </label>
                            <select
                                id="branchName"
                                name="branchName"
                                value={formData.branchName}
                                onChange={handleInputChange}
                                disabled={!formData.bankName}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.branchName ? 'border-red-500' : 'border-gray-300'
                                    } ${!formData.bankName ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            >
                                <option value="">Select a branch</option>
                                {getAvailableBranches().map((branch) => (
                                    <option key={branch} value={branch}>
                                        {branch}
                                    </option>
                                ))}
                            </select>
                            {errors.branchName && (
                                <p className="mt-1 text-sm text-red-600">{errors.branchName}</p>
                            )}
                        </div>

                        {/* Account Name */}
                        <div>
                            <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-2">
                                Account Name *
                            </label>
                            <input
                                type="text"
                                id="accountName"
                                name="accountName"
                                value={formData.accountName}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.accountName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Enter account holder name"
                            />
                            {errors.accountName && (
                                <p className="mt-1 text-sm text-red-600">{errors.accountName}</p>
                            )}
                        </div>

                        {/* Account Number */}
                        <div>
                            <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                Account Number *
                            </label>
                            <input
                                type="text"
                                id="accountNumber"
                                name="accountNumber"
                                value={formData.accountNumber}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.accountNumber ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Enter account number (numbers only)"
                            />
                            {errors.accountNumber && (
                                <p className="mt-1 text-sm text-red-600">{errors.accountNumber}</p>
                            )}
                        </div>

                        {/* Proof of Bank Account */}
                        <div>
                            <label htmlFor="proofOfAccount" className="block text-sm font-medium text-gray-700 mb-2">
                                Proof of Bank Account *
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 48 48"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <div className="flex text-sm text-gray-600">
                                        <label
                                            htmlFor="proofOfAccount"
                                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                        >
                                            <span>Upload a file</span>
                                            <input
                                                id="proofOfAccount"
                                                name="proofOfAccount"
                                                type="file"
                                                className="sr-only"
                                                accept=".pdf,.png,.jpg,.jpeg"
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PDF, PNG, JPG up to 5MB</p>
                                </div>
                            </div>
                            {formData.proofOfAccount && (
                                <div className="mt-2 flex items-center text-sm text-gray-600">
                                    <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                                    </svg>
                                    {formData.proofOfAccount.name}
                                </div>
                            )}
                            {errors.proofOfAccount && (
                                <p className="mt-1 text-sm text-red-600">{errors.proofOfAccount}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={!isValid}
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isValid
                                    ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                                    : 'bg-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                Next
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 