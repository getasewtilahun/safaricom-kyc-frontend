const API_BASE_URL = 'http://localhost:8080/api';

export interface Bank {
    id: number;
    value: string;
}

export interface Branch {
    id: number;
    value: string;
    bank: Bank;
}

export interface ApplicationRequest {
    bankId: number;
    branchId: number;
    accountName: string;
    accountNumber: string;
    status: 'DRAFT' | 'SUBMITTED';
    fileName?: string;
    originalFileName?: string;
    fileSize?: number;
}

export interface FileUploadResponse {
    filename: string;
    originalName: string;
    size: number;
}

export interface TransactionRequest {
    accountNumber: string;
    amount: number;
    narration: string;
}

export interface ReverseRequest {
    transactionId: string;
    reason: string;
}

class ApiService {
    // Get all banks
    async getBanks(): Promise<Bank[]> {
        const response = await fetch(`${API_BASE_URL}/banks`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors',
        });
        if (!response.ok) {
            throw new Error('Failed to fetch banks');
        }
        return response.json();
    }

    // Get branches for a specific bank
    async getBranches(bankId: number): Promise<Branch[]> {
        const response = await fetch(`${API_BASE_URL}/branches?bank_id=${bankId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch branches');
        }
        return response.json();
    }

    // Submit application
    async submitApplication(data: ApplicationRequest): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/applications/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to submit application');
        }

        return response.json();
    }

    // Create transaction
    async createTransaction(data: TransactionRequest): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/transaction`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to create transaction');
        }

        return response.json();
    }

    // Reverse transaction
    async reverseTransaction(data: ReverseRequest): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/reverse`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to reverse transaction');
        }

        return response.json();
    }

    // Upload file
    async uploadFile(file: File): Promise<FileUploadResponse> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_BASE_URL}/files/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to upload file');
        }

        return response.json();
    }

    // Get all applications
    async getApplications(): Promise<any[]> {
        const response = await fetch(`${API_BASE_URL}/applications`);
        if (!response.ok) {
            throw new Error('Failed to fetch applications');
        }
        return response.json();
    }

    // Get all transactions
    async getTransactions(): Promise<any[]> {
        const response = await fetch(`${API_BASE_URL}/transactions`);
        if (!response.ok) {
            throw new Error('Failed to fetch transactions');
        }
        return response.json();
    }
}

export const apiService = new ApiService(); 