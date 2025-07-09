'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
    selectedBank: string;
    selectedBranch: string;
    accountName: string;
    accountNumber: string;
    file: {
        name: string;
        size: number;
        type: string;
    } | null;
}

export default function ConfirmationPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<string>('');

    useEffect(() => {
        // Retrieve form data from localStorage
        const storedData = localStorage.getItem('fundWithdrawForm');
        if (storedData) {
            setFormData(JSON.parse(storedData));
        } else {
            // Redirect to dashboard if no data
            router.push('/dashboard');
        }
    }, [router]);

    const handleSubmit = async (action: 'submit' | 'draft') => {
        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            const newStatus = action === 'submit' ? 'Submitted' : 'Draft';
            setStatus(newStatus);

            // In a real app, you would send the data to your backend
            console.log(`KYC Application ${newStatus}:`, formData);

            // Clear localStorage
            localStorage.removeItem('kycFormData');

            // Show success message
            alert(`Application ${newStatus.toLowerCase()} successfully!`);

            // Redirect to login after a delay
            setTimeout(() => {
                router.push('/login');
            }, 1500);

        } catch (error) {
            console.error('Error submitting application:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (!formData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white shadow-lg rounded-lg p-8">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Review Your Information
                        </h2>
                        <p className="text-gray-600">
                            Please review your KYC application details before submitting
                        </p>
                    </div>

                    {status && (
                        <div className={`mb-6 p-4 rounded-md ${status === 'Submitted'
                            ? 'bg-green-50 border border-green-200 text-green-800'
                            : 'bg-yellow-50 border border-yellow-200 text-yellow-800'
                            }`}>
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    {status === 'Submitted' ? (
                                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium">
                                        Application {status}
                                    </h3>
                                    <div className="mt-2 text-sm">
                                        {status === 'Submitted'
                                            ? 'Your KYC application has been submitted successfully and is under review.'
                                            : 'Your KYC application has been saved as a draft. You can complete it later.'
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-gray-50 rounded-lg p-6 space-y-6">
                        {/* Bank Information */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Bank Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Bank Name</label>
                                    <p className="mt-1 text-sm text-gray-900">{formData.selectedBank}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Branch Name</label>
                                    <p className="mt-1 text-sm text-gray-900">{formData.selectedBranch}</p>
                                </div>
                            </div>
                        </div>

                        {/* Account Information */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Account Name</label>
                                    <p className="mt-1 text-sm text-gray-900">{formData.accountName}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Account Number</label>
                                    <p className="mt-1 text-sm text-gray-900">{formData.accountNumber}</p>
                                </div>
                            </div>
                        </div>

                        {/* Document Information */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Document Information</h3>
                            {formData.file && (
                                <div className="flex items-center p-4 bg-white rounded-md border">
                                    <div className="flex-shrink-0">
                                        <svg className="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{formData.file.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    {formData.file.type} • {formatFileSize(formData.file.size)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                        <button
                            type="button"
                            onClick={() => router.push('/kyc-form')}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Edit Information
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSubmit('draft')}
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Saving...' : 'Save as Draft'}
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSubmit('submit')}
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Application'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 