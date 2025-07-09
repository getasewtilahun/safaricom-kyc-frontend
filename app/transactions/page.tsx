"use client";
import { useState, useEffect } from "react";
import { apiService } from "../services/api";
import DashboardLayout from "../../components/DashboardLayout";

interface Application {
    id: number;
    accountName: string;
    accountNumber: string;
    status: string;
    bank: { value: string };
    branch: { value: string };
}

interface Transaction {
    id: number;
    transactionId: string;
    value: string;
    status: string;
    createdAt: string;
}

export default function TransactionsPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [selectedAccount, setSelectedAccount] = useState("");
    const [amount, setAmount] = useState("");
    const [narration, setNarration] = useState("");
    const [reverseTransactionId, setReverseTransactionId] = useState("");
    const [reverseReason, setReverseReason] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [appsData, txData] = await Promise.all([
                apiService.getApplications(),
                apiService.getTransactions()
            ]);
            setApplications(appsData);
            setTransactions(txData);
        } catch (error) {
            console.error('Failed to load data:', error);
        }
    };

    const handleCreateTransaction = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAccount || !amount || !narration) {
            setMessage("Please fill all fields");
            return;
        }

        setLoading(true);
        try {
            await apiService.createTransaction({
                accountNumber: selectedAccount,
                amount: parseFloat(amount),
                narration
            });
            setMessage("Transaction created successfully!");
            setSelectedAccount("");
            setAmount("");
            setNarration("");
            loadData(); // Refresh data
        } catch (error: any) {
            setMessage(error.message || "Failed to create transaction");
        } finally {
            setLoading(false);
        }
    };

    const handleReverseTransaction = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reverseTransactionId || !reverseReason) {
            setMessage("Please fill all fields");
            return;
        }

        setLoading(true);
        try {
            await apiService.reverseTransaction({
                transactionId: reverseTransactionId,
                reason: reverseReason
            });
            setMessage("Transaction reversed successfully!");
            setReverseTransactionId("");
            setReverseReason("");
            loadData(); // Refresh data
        } catch (error: any) {
            setMessage(error.message || "Failed to reverse transaction");
        } finally {
            setLoading(false);
        }
    };

    const submittedApplications = applications.filter(app => app.status === "SUBMITTED");

    return (
        <DashboardLayout active="Transactions">
            {/* Transaction Management Content */}
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Transaction Management</h1>

                {message && (
                    <div className={`mb-6 p-4 rounded-md ${message.includes("successfully") ? "bg-green-50 border border-green-200 text-green-800" : "bg-red-50 border border-red-200 text-red-800"
                        }`}>
                        {message}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Create Transaction */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">Create Transaction</h2>
                        <form onSubmit={handleCreateTransaction} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Account Number
                                </label>
                                <select
                                    value={selectedAccount}
                                    onChange={(e) => setSelectedAccount(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#43b02a]"
                                    required
                                >
                                    <option value="">Select Account</option>
                                    {submittedApplications.map((app) => (
                                        <option key={app.id} value={app.accountNumber}>
                                            {app.accountNumber} - {app.accountName} ({app.bank.value})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Amount
                                </label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#43b02a]"
                                    placeholder="Enter amount"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Narration
                                </label>
                                <input
                                    type="text"
                                    value={narration}
                                    onChange={(e) => setNarration(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#43b02a]"
                                    placeholder="Enter narration"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-2 px-4 rounded-md text-white font-medium ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#43b02a] hover:bg-[#369021]'
                                    }`}
                            >
                                {loading ? 'Creating...' : 'Create Transaction'}
                            </button>
                        </form>
                    </div>

                    {/* Reverse Transaction */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">Reverse Transaction</h2>
                        <form onSubmit={handleReverseTransaction} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Transaction ID
                                </label>
                                <select
                                    value={reverseTransactionId}
                                    onChange={(e) => setReverseTransactionId(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#43b02a]"
                                    required
                                >
                                    <option value="">Select Transaction</option>
                                    {transactions
                                        .filter(tx => tx.status === "SUCCESS")
                                        .map((tx) => (
                                            <option key={tx.id} value={tx.transactionId}>
                                                {tx.transactionId} - {tx.value}
                                            </option>
                                        ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Reason
                                </label>
                                <input
                                    type="text"
                                    value={reverseReason}
                                    onChange={(e) => setReverseReason(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#43b02a]"
                                    placeholder="Enter reason for reversal"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-2 px-4 rounded-md text-white font-medium ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                                    }`}
                            >
                                {loading ? 'Reversing...' : 'Reverse Transaction'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Transaction History */}
                <div className="mt-8 bg-white rounded-lg shadow">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold">Transaction History</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Transaction ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Narration
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {transactions.map((tx) => (
                                    <tr key={tx.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {tx.transactionId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {tx.value}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${tx.status === "SUCCESS" ? "bg-green-100 text-green-800" :
                                                tx.status === "REVERSED" ? "bg-red-100 text-red-800" :
                                                    "bg-gray-100 text-gray-800"
                                                }`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(tx.createdAt).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
} 